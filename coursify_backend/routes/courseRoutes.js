const express = require('express');
const router = express.Router();
const { getAllCourses,searchCourses, getCourseDetails , deleteCourse, addReview, getCourseReviews,getInstructorReviews, getInstructorEarnings} = require('../controllers/courseController');
const authenticateAdmin = require('../middleware/authenticateAdmin');
const authenticateInstructor = require('../middleware/authenticateInstructor');
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



router.get("/courses/reviews", authenticateInstructor, getInstructorReviews); // Use your auth middleware
router.get("/instructor/:instructorId/earnings",authenticateInstructor, getInstructorEarnings);


module.exports = router;
