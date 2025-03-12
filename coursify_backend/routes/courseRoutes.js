const express = require('express');
const router = express.Router();
const { getAllCourses,searchCourses, deleteCourse, addReview, getCourseReviews} = require('../controllers/courseController');
const authenticateAdmin = require('../middleware/authenticateAdmin');
const authenticateStudent = require('../middleware/authenticateStudent');
const { checkEnrollmentStatus } = require("../controllers/enrollController");

// Route to get all courses
router.get('/', getAllCourses);

// Route to search courses by query
router.get("/search", searchCourses);

router.delete("/:id",authenticateAdmin,deleteCourse)

// Route to submit a review (only for authenticated students)
router.post("/:courseId/reviews", authenticateStudent, addReview);

// Route to get reviews for a specific course
router.get("/:courseId/reviews", getCourseReviews);

router.get("/:courseId/enrollment-status", authenticateStudent, checkEnrollmentStatus);



module.exports = router;
