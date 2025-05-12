const express = require('express');
const router = express.Router();
const instructorCourseController = require('../controllers/instructorCourseController');
const authenticateInstructor = require('../middleware/authenticateInstructor');

// Fetch detailed information about a specific course (no authentication required)
router.get('/courses/:courseId/details', instructorCourseController.getCourseDetails);

// Apply authentication middleware for the rest of the routes
router.use(authenticateInstructor);

// Get all courses for an instructor
router.get('/:instructorId/courses', instructorCourseController.getCourses);

// Add a course
router.post('/:instructorId/courses', instructorCourseController.addCourse);

// Update a course
router.put('/courses/:courseId', instructorCourseController.updateCourse); 

// Delete a course
router.delete('/courses/:courseId', instructorCourseController.deleteCourse);

// Add these to your instructor routes (router.js)
router.get('/:instructorId/reviews', instructorCourseController.getInstructorReviews);
router.get('/:instructorId/earnings', instructorCourseController.getInstructorEarnings);



module.exports = router;
