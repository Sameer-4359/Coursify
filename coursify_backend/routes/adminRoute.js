const express = require("express");
const router = express.Router();
const authenticateAdmin = require("../middleware/authenticateAdmin");
const { getTotalCourses, getTotalStudents, getAdminDetails } = require("../controllers/adminController");

// Route for getting total courses
router.get("/total-courses", authenticateAdmin, getTotalCourses);

// Route for getting total students
router.get("/total-students", authenticateAdmin, getTotalStudents);

// Route for getting admin details
router.get("/details", authenticateAdmin, getAdminDetails);

module.exports = router;
