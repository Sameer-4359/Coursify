// const pool = require("../config/db");
// const bcrypt = require("bcryptjs");
// const jwt = require("jsonwebtoken");
// require("dotenv").config();

// // User Registration
// async function registerUser(req, res) {
//     const { username, email, password, role } = req.body;

//     try {
//         // Validate role
//         if (!["Student", "Instructor", "Admin"].includes(role)) {
//             return res.status(400).json({ message: "Invalid role. Must be 'Student', 'Instructor', or 'Admin'." });
//         }

//         // Check if the email is already in use in all tables
//         const emailExistsInStudents = await pool.query("SELECT * FROM students WHERE email = $1", [email]);
//         const emailExistsInInstructors = await pool.query("SELECT * FROM instructors WHERE email = $1", [email]);
//         const emailExistsInAdmins = await pool.query("SELECT * FROM admins WHERE email = $1", [email]);

//         if (
//             emailExistsInStudents.rows.length > 0 ||
//             emailExistsInInstructors.rows.length > 0 ||
//             emailExistsInAdmins.rows.length > 0
//         ) {
//             return res.status(400).json({ message: "Email already in use." });
//         }

//         // Hash the password
//         const hashedPassword = await bcrypt.hash(password, 10);

//         // Insert data into the respective table
//         let query = "";
//         if (role === "Student") {
//             query = "INSERT INTO students (username, email, password) VALUES ($1, $2, $3) RETURNING *";
//         } else if (role === "Instructor") {
//             query = "INSERT INTO instructors (username, email, password) VALUES ($1, $2, $3) RETURNING *";
//         } else if (role === "Admin") {
//             query = "INSERT INTO admins (username, email, password, role) VALUES ($1, $2, $3, $4) RETURNING *";
//         }

//         const newUser = await pool.query(query, [username, email, hashedPassword, role]);

//         res.status(201).json({
//             message: `User registered successfully as a ${role}`,
//             user: newUser.rows[0],
//         });
//     } catch (err) {
//         console.error("Error registering user:", err.message);
//         res.status(500).json({ message: "Server error", error: err.message });
//     }
// }



// // User Login
// async function loginUser(req, res) {
//     const { email, password } = req.body;

//     if (!email || !password) {
//         return res.status(400).json({ message: "Email and password are required." });
//     }

//     try {
//         console.log("Login request received:", { email, password });

//         // Query each table for the user
//         const studentQuery = await pool.query("SELECT * FROM students WHERE email = $1", [email]);
//         const instructorQuery = await pool.query("SELECT * FROM instructors WHERE email = $1", [email]);
//         const adminQuery = await pool.query("SELECT * FROM admins WHERE email = $1", [email]);

//         console.log("Student Query Result:", studentQuery.rows);
//         console.log("Instructor Query Result:", instructorQuery.rows);
//         console.log("Admin Query Result:", adminQuery.rows);

//         let user = null;
//         let role = "";

//         if (studentQuery.rows.length > 0) {
//             user = studentQuery.rows[0];
//             role = "Student";
//         } else if (instructorQuery.rows.length > 0) {
//             user = instructorQuery.rows[0];
//             role = "Instructor";
//         } else if (adminQuery.rows.length > 0) {
//             user = adminQuery.rows[0];
//             role = "Admin";
//         } else {
//             return res.status(404).json({ message: "User not found" });
//         }

//         // Verify password
//         const isPasswordValid = await bcrypt.compare(password, user.password);
//         if (!isPasswordValid) {
//             return res.status(401).json({ message: "Invalid credentials" });
//         }

//         // Generate JWT
//         const token = jwt.sign(
//             { id: user.id, email: user.email, role },
//             process.env.JWT_SECRET,
//             { expiresIn: "1d" }
//         );

//         console.log("JWT Token:", token);

//         // Redirect based on role
//         if (role === "Admin") {
//             return res.status(200).json({
//                 token,
//                 user: { id: user.id, email: user.email, username: user.username, role },
//                 redirect: "/adminDashboard", // Redirect to admin dashboard
//                 message: "Login successful as Admin",
//             });
//         }

//         res.status(200).json({
//             token,
//             user: { id: user.id, email: user.email, username: user.username, role },
//             message: `Login successful as ${role}`,
//         });
//     } catch (err) {
//         console.error("Error during login:", err.message);
//         res.status(500).json({ message: "Server error", error: err.message });
//     }
// }



// module.exports = { registerUser, loginUser };

const pool = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

// User Registration
async function registerUser(req, res) {
    const { username, email, password, role } = req.body;

    try {
        // Validate role
        if (!["Student", "Instructor", "Admin"].includes(role)) {
            return res.status(400).json({ message: "Invalid role. Must be 'Student', 'Instructor', or 'Admin'." });
        }

        // Check if the email is already in use in all tables
        const emailExistsInStudents = await pool.query("SELECT * FROM students WHERE email = $1", [email]);
        const emailExistsInInstructors = await pool.query("SELECT * FROM instructors WHERE email = $1", [email]);
        const emailExistsInAdmins = await pool.query("SELECT * FROM admins WHERE email = $1", [email]);

        if (
            emailExistsInStudents.rows.length > 0 ||
            emailExistsInInstructors.rows.length > 0 ||
            emailExistsInAdmins.rows.length > 0
        ) {
            return res.status(400).json({ message: "Email already in use." });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert data into the respective table
        let query = "";
        if (role === "Student") {
            query = "INSERT INTO students (username, email, password) VALUES ($1, $2, $3) RETURNING *";
        } else if (role === "Instructor") {
            query = "INSERT INTO instructors (username, email, password) VALUES ($1, $2, $3) RETURNING *";
        } else if (role === "Admin") {
            query = "INSERT INTO admins (username, email, password, role) VALUES ($1, $2, $3, $4) RETURNING *";
        }

        const newUser = await pool.query(query, [username, email, hashedPassword, role]);

        res.status(201).json({
            message: `User registered successfully as a ${role}`,
            user: newUser.rows[0],
        });
    } catch (err) {
        console.error("Error registering user:", err.message);
        res.status(500).json({ message: "Server error", error: err.message });
    }
}


//user login
async function loginUser(req, res) {
    const { email, password } = req.body;
  
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required." });
    }
  
    try {
      // Query each table for the user (students, instructors, admins)
      const studentQuery = await pool.query("SELECT * FROM students WHERE email = $1", [email]);
      const instructorQuery = await pool.query("SELECT * FROM instructors WHERE email = $1", [email]);
      const adminQuery = await pool.query("SELECT * FROM admins WHERE email = $1", [email]);
  
      let user = null;
      let role = "";
  
      if (studentQuery.rows.length > 0) {
        user = studentQuery.rows[0];
        role = "Student";
      } else if (instructorQuery.rows.length > 0) {
        user = instructorQuery.rows[0];
        role = "Instructor";
      } else if (adminQuery.rows.length > 0) {
        user = adminQuery.rows[0];
        role = "Admin";
      } else {
        // Log the failed login attempt
        await pool.query("INSERT INTO login_attempts (email, is_successful) VALUES ($1, FALSE)", [email]);
        return res.status(404).json({ message: "User not found" });
      }
  
      // Check if the user is blocked
      const failedLoginQuery = await pool.query(
        "SELECT failed_count, blocked_until FROM failed_logins WHERE email = $1",
        [email]
      );
  
      if (failedLoginQuery.rows.length > 0) {
        const { blocked_until } = failedLoginQuery.rows[0];
        if (blocked_until && new Date(blocked_until) > new Date()) {
          const remainingTime = (new Date(blocked_until) - new Date()) / 1000;
          return res.status(403).json({
            message: `Too many failed attempts. Try again in ${Math.ceil(remainingTime)} seconds.`,
          });
        }
      }
  
      // Verify the password
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        // Log the failed login attempt
        await pool.query("INSERT INTO login_attempts (email, is_successful) VALUES ($1, FALSE)", [email]);
        return res.status(401).json({ message: "Invalid credentials" });
      }
  
      // Log the successful login attempt
      await pool.query("INSERT INTO login_attempts (email, is_successful) VALUES ($1, TRUE)", [email]);
  
      // If password is correct, generate JWT
      const token = jwt.sign(
        { id: user.id, email: user.email, role },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
      );
  
      res.status(200).json({
        token,
        user: { id: user.id, email: user.email, username: user.username, role },
        message: `Login successful as ${role}`,
      });
    } catch (err) {
      console.error("Error during login:", err.message);
      res.status(500).json({ message: "Server error", error: err.message });
    }
  }
  
  
module.exports = { registerUser, loginUser };
