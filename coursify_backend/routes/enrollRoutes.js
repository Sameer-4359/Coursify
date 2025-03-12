const express = require("express");
const authenticateStudent = require("../middleware/authenticateStudent");
const { getCartItems, enrollCourses,getEnrolledCourses ,unenrollCourse, getEnrolledCoursesCount,updateCourse,checkEnrollmentStatus} = require("../controllers/enrollController");

const router = express.Router();

router.use(authenticateStudent);

// Route to get cart items for a student
router.get("/cart", getCartItems);

// Route to enroll courses for a student
router.post("/enroll", enrollCourses);

//Route to enrolled courses of a student
router.get("/enrolled-courses", getEnrolledCourses);

// Route to unenroll from a course
router.delete("/unenroll/:courseId", unenrollCourse);

// Get the count of enrolled courses for a student
router.get("/count", getEnrolledCoursesCount);

router.put("/unenroll/:courseId", updateCourse);

// router.get("/courses/:courseId/enrollment-status", authenticateStudent, checkEnrollmentStatus);

module.exports = router;

