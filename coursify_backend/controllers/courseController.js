const pool = require("../config/db");

// Fetch all courses
const getAllCourses = async (req, res) => {
  try {
    const query = `
      SELECT 
        c.id, c.title, c.price, c.image_url AS img, 
        i.username AS instructor 
      FROM courses c
      LEFT JOIN instructors i ON c.instructor_id = i.id
      ORDER BY c.created_at DESC;
    `;
    const result = await pool.query(query);
    res.status(200).json(result.rows);
  } catch (err) {
    console.error("Error fetching courses:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Search courses by query
const searchCourses = async (req, res) => {
  const query = req.query.query; // Get the search query from the request
  try {
    const sql = `
      SELECT id, title AS name
      FROM courses
      WHERE LOWER(title) LIKE $1
      ORDER BY title ASC;
    `;
    const values = [`${query.toLowerCase()}%`]; // Matches "starts with"
    const result = await pool.query(sql, values);
    res.status(200).json(result.rows);
  } catch (err) {
    console.error("Error searching courses:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Delete a course
const deleteCourse = async (req, res) => {
  const { id } = req.params;
  try {
    const query = "DELETE FROM courses WHERE id = $1";
    await pool.query(query, [id]);
    res.status(200).json({ message: "Course deleted successfully" });
  } catch (err) {
    console.error("Error deleting course:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getCourseDetails = async (req, res) => {
  const { courseId } = req.params;
  try {
    const result = await pool.query(
      `SELECT courses.*, instructors.name as instructorName 
       FROM courses 
       JOIN instructors ON courses.instructor_id = instructors.id 
       WHERE courses.id = $1`, 
      [courseId]
    );

    if (result.rows.length > 0) {
      res.json(result.rows[0]);
    } else {
      res.status(404).json({ message: "Course not found" });
    }
  } catch (err) {
    console.error("Error fetching course details:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

const addReview = async (req, res) => {
  const { courseId } = req.params;
  const { rating, reviewText } = req.body;
  const { studentId } = req;
  console.log()
  if (!rating || !reviewText) {
    return res.status(400).json({ message: "Rating and review text are required." });
  }

  try {
    const result = await pool.query(
      `INSERT INTO reviews (course_id, student_id, review_text, rating) 
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [courseId, studentId, reviewText, rating]
    );

    res.status(201).json({
      message: "Review submitted successfully!",
      review: result.rows[0],
    });
  } catch (err) {
    console.error("Error submitting review:", err);
    res.status(500).json({ message: "Failed to submit review", error: err.message });
  }
};

const getCourseReviews = async (req, res) => {
  const { courseId } = req.params;

  try {
    const result = await pool.query(
      `SELECT reviews.*, students.username as studentName 
       FROM reviews 
       JOIN students ON reviews.student_id = students.id 
       WHERE reviews.course_id = $1`,
      [courseId]
    );

    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching course reviews:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

const getInstructorReviews= async (req, res) => {
  const { courseIds } = req.query;
  try {
    const result = await pool.query(
      `SELECT r.id, r.review_text, r.rating, r.created_at, s.username AS student_name, c.title AS course_title
       FROM reviews r
       JOIN students s ON r.student_id = s.id
       JOIN courses c ON r.course_id = c.id
       WHERE r.course_id = ANY($1::int[])
       ORDER BY r.created_at DESC`,
      [courseIds.split(",").map(Number)]
    );
    res.status(200).json(result.rows);
  } catch (err) {
    console.error("Error fetching reviews:", err);
    res.status(500).json({ error: "Server error" });
  }
};

const getInstructorEarnings = async (req, res) => {
  const { instructorId } = req.params;
  try {
    const result = await pool.query(
      `SELECT c.id AS course_id, c.title AS course_title, c.price,
              COUNT(e.student_id) AS student_count,
              (c.price * COUNT(e.student_id)) AS total_revenue
       FROM courses c
       LEFT JOIN enrollments e ON c.id = e.course_id
       WHERE c.instructor_id = $1
       GROUP BY c.id, c.title, c.price
       ORDER BY c.title`,
      [instructorId]
    );
    res.status(200).json(result.rows);
  } catch (err) {
    console.error("Error fetching instructor earnings:", err);
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = {
  getAllCourses,
  searchCourses,
  getCourseDetails,
  deleteCourse, // Add deleteCourse here
  addReview,
  getCourseReviews,
  getInstructorReviews,
  getInstructorEarnings
};
