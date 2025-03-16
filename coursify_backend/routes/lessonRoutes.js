const express = require("express");
const router = express.Router();
const pool = require("../config/db");

// Get lessons by course ID
router.get("/courses/:courseId/lessons", async (req, res) => {
  try {
    const { courseId } = req.params;
    const lessons = await pool.query("SELECT id, title FROM lessons WHERE course_id = $1", [courseId]);

    res.json(lessons.rows);
  } catch (error) {
    console.error("❌ Error fetching lessons:", error);
    res.status(500).json({ error: "Failed to fetch lessons" });
  }
});

module.exports = router;
