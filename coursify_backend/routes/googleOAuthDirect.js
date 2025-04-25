const express = require("express");
const { OAuth2Client } = require("google-auth-library");
const jwt = require("jsonwebtoken");
const pool = require("../config/db"); // Your PostgreSQL pool

const router = express.Router();

const client = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_CALLBACK_URL
);

// STEP 1: Redirect user to Google OAuth consent screen
router.get("/google", (req, res) => {
  const url = client.generateAuthUrl({
    access_type: "offline",
    scope: ["profile", "email"],
  });
  res.redirect(url);
});

// STEP 2: Google sends user back with code
router.get("/google/callback", async (req, res) => {
  const code = req.query.code;

  try {
    const { tokens } = await client.getToken(code);
    client.setCredentials(tokens);

    // STEP 3: Get user info from Google
    const ticket = await client.verifyIdToken({
      idToken: tokens.id_token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const email = payload.email.toLowerCase();
    const username = payload.name;

    // STEP 4: Check user in your DB or create new
    let user = null;
    let role = "";

    const studentQuery = await pool.query("SELECT * FROM students WHERE email = $1", [email]);
    const instructorQuery = await pool.query("SELECT * FROM instructors WHERE email = $1", [email]);

    if (studentQuery.rows.length > 0) {
      user = studentQuery.rows[0];
      role = "Student";
    } else if (instructorQuery.rows.length > 0) {
      user = instructorQuery.rows[0];
      role = "Instructor";
    } else {
      const insert = await pool.query(
        "INSERT INTO students (username, email, password) VALUES ($1, $2, $3) RETURNING *",
        [username, email, "google-auth"]
      );
      user = insert.rows[0];
      role = "Student";
    }

    // STEP 5: Create your JWT
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        username: user.username,
        role: role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    // STEP 6: Redirect with token
    res.redirect(`http://localhost:3000/oauth-success?token=${token}`);
  } catch (err) {
    console.error("Google login error:", err);
    res.status(500).send("Authentication failed");
  }
});

module.exports = router;