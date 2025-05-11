const pool = require("../config/db");

// Save or Update Note
exports.saveOrUpdateNote = async (req, res) => {
  const { lessonId } = req.params;
  const studentId = req.studentId; // Assuming auth middleware sets this
  const { note } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO lesson_notes (student_id, lesson_id, note)
       VALUES ($1, $2, $3)
       ON CONFLICT (student_id, lesson_id)
       DO UPDATE SET note = EXCLUDED.note
       RETURNING *`,
      [studentId, lessonId, note]
    );

    res.status(200).json({ message: "Note saved successfully", note: result.rows[0] });
  } catch (err) {
    console.error("Error saving note:", err);
    res.status(500).json({ message: "Failed to save note" });
  }
};

// Get Note for a Lesson
exports.getNoteByLesson = async (req, res) => {
  const { lessonId } = req.params;
  const studentId = req.studentId;

  try {
    const result = await pool.query(
      `SELECT note FROM lesson_notes WHERE student_id = $1 AND lesson_id = $2`,
      [studentId, lessonId]
    );

    if (result.rows.length > 0) {
      res.status(200).json(result.rows[0]);
    } else {
      res.status(200).json({ note: "" }); // Empty if not found
    }
  } catch (err) {
    console.error("Error fetching note:", err);
    res.status(500).json({ message: "Failed to fetch note" });
  }
}; 