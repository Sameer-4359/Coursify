const express = require("express");
const { registerUser, loginUser } = require("../controllers/authController");

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);

module.exports = router;

/*const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const router = express.Router();

// Example login route
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  // Log the received email and password for debugging
  console.log("Login attempt:", email, password);

  // Replace this with your authentication logic, e.g., check if email exists, validate password, etc.
  try {
    // Dummy authentication (replace with actual database check)
    if (email === "amna@gmail.com" && password === "hello") {
      const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '1h' });
      return res.json({ token });
    }
    return res.status(400).json({ message: "Invalid credentials" });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;*/

