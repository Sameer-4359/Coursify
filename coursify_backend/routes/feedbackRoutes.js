// routes/feedbackRoutes.js
const express = require('express');
const router = express.Router();
const pool = require('../config/db'); // <-- Corrected this line

const authenticateStudent = require('../middleware/authenticateStudent');
const authenticateInstructor = require('../middleware/authenticateInstructor');

router.post('/student/feedback', authenticateStudent, async (req, res) => {
  const { feedback } = req.body;
  const studentId = req.studentId;// assuming you set req.user from token

  try {
    await pool.query(
      "INSERT INTO student_feedbacks (student_id, feedback_text) VALUES ($1, $2)",
      [studentId, feedback]
    );
    res.status(200).json({ message: "Feedback submitted successfully!" });
  } catch (error) {
    console.error("Error saving feedback:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Instructor feedback submission
router.post('/instructor/feedback', authenticateInstructor, async (req, res) => {
  console.lof("done1");
  const { feedback } = req.body;
  const instructorId = req.instructorId;
  console.lof("done2");
  if (!feedback) {
    return res.status(400).json({ message: "Feedback cannot be empty." });
  }

  try {
    await pool.query(
      "INSERT INTO instructor_feedbacks (instructor_id, feedback_text) VALUES ($1, $2)",
      [instructorId, feedback]
    );
    res.status(200).json({ message: "Instructor feedback submitted successfully!" });
  } catch (error) {
    console.error("Error saving instructor feedback:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
