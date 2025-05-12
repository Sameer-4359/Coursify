const pool = require("../config/db");

// Get total number of courses
const getTotalCourses = async (req, res) => {
  try {
    const result = await pool.query("SELECT COUNT(*) FROM courses");
    const totalCourses = result.rows[0].count;
    res.status(200).json({ totalCourses }); 
  } catch (error) {
    console.error("Error fetching total courses:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get total number of students
const getTotalStudents = async (req, res) => {
  try {
    const result = await pool.query("SELECT COUNT(*) FROM students");
    const totalStudents = result.rows[0].count;
    res.status(200).json({ totalStudents });
  } catch (error) {
    console.error("Error fetching total students:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get admin details (admin's name, for example)
const getAdminDetails = async (req, res) => {
  try {
    // Assuming admin details are stored in a specific admin table or using JWT data
    const adminId = req.adminId;  // Getting admin ID from the JWT token
    const result = await pool.query("SELECT username FROM admins WHERE id = $1", [adminId]);

    if (result.rows.length > 0) {
      const adminName = result.rows[0].username;
      res.status(200).json({ adminName });
    } else {
      res.status(404).json({ message: "Admin not found" });
    }
  } catch (error) {
    console.error("Error fetching admin details:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { getTotalCourses, getTotalStudents, getAdminDetails };
