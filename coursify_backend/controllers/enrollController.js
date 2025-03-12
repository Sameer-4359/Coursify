const pool = require("../config/db"); // Assuming you're using a PostgreSQL database with a pool setup

// Fetch cart items for the student
const getCartItems = async (req, res) => {
    const { studentId } = req;
    try {
      const result = await pool.query(
        "SELECT c.id, c.title, CAST(c.price AS FLOAT) AS price FROM cart ca JOIN courses c ON ca.course_id = c.id WHERE ca.student_id = $1",
        [studentId]
      );
      res.json(result.rows);
    } catch (error) {
      console.error("Error fetching cart items:", error);
      res.status(500).json({ error: "Failed to fetch cart items" });
    }
  };
  

// Enroll student in courses
const enrollCourses = async (req, res) => {
    const { studentId } = req;
  
    try {
      // Fetch all courses in the cart for the student
      const cartCourses = await pool.query(
        "SELECT course_id FROM cart WHERE student_id = $1",
        [studentId]
      );
  
      // Iterate through the cart courses to check for already enrolled courses
      for (const row of cartCourses.rows) {
        const courseId = row.course_id;
  
        // Check if the student is already enrolled in this course
        const enrollmentCheck = await pool.query(
          "SELECT 1 FROM enrollments WHERE student_id = $1 AND course_id = $2",
          [studentId, courseId]
        );
  
        if (enrollmentCheck.rowCount > 0) {
          // If already enrolled, remove the course from the cart
          await pool.query(
            "DELETE FROM cart WHERE student_id = $1 AND course_id = $2",
            [studentId, courseId]
          );
  
          return res.status(400).json({
            error: `Already enrolled in course with ID: ${courseId}. It has been removed from your cart.`,
          });
        }
      }
  
      // Enroll the student in all courses remaining in the cart
      await pool.query(
        "INSERT INTO enrollments (student_id, course_id) SELECT $1, course_id FROM cart WHERE student_id = $1",
        [studentId]
      );
  
      // Clear the cart after successful enrollment
      await pool.query("DELETE FROM cart WHERE student_id = $1", [studentId]);
  
      res.json({ message: "Courses successfully enrolled!" });
    } catch (error) {
      console.error("Error enrolling courses:", error);
      // Clear the cart as a fallback to prevent issues
      await pool.query("DELETE FROM cart WHERE student_id = $1", [studentId]);
      res.status(500).json({ error: "Failed to enroll courses" });
    }
  };
  

// Fetch enrolled courses for the student
const getEnrolledCourses = async (req, res) => {
    const { studentId } = req;
    try {
      const result = await pool.query(
        `SELECT 
          c.id, 
          c.title, 
          c.image_url, 
          c.price, 
          i.username AS instructor 
         FROM enrollments e
         JOIN courses c ON e.course_id = c.id
         JOIN instructors i ON c.instructor_id = i.id
         WHERE e.student_id = $1`,
        [studentId]
      );
      res.json(result.rows);
    } catch (error) {
      console.error("Error fetching enrolled courses:", error);
      res.status(500).json({ error: "Failed to fetch enrolled courses" });
    }
  };

  const unenrollCourse = async (req, res) => {
    const { studentId } = req; // Extract student ID from token
    const { courseId } = req.params; // Extract course ID from route parameters
  
    try {
      // Delete the specific enrollment for the student and course
      const result = await pool.query(
        "DELETE FROM enrollments WHERE student_id = $1 AND course_id = $2 RETURNING *",
        [studentId, courseId]
      );
  
      if (result.rowCount === 0) {
        return res.status(404).json({ error: "Enrollment not found or already unenrolled." });
      }
  
      res.json({ message: "Successfully unenrolled from the course." });
    } catch (error) {
      console.error("Error unenrolling from the course:", error);
      res.status(500).json({ error: "Failed to unenroll from the course." });
    }
  };
  
  const getEnrolledCoursesCount = async (req, res) => {
    try {
      const studentId = req.studentId; // Updated to match middleware
      const result = await pool.query(
        "SELECT COUNT(*) AS count FROM enrollments WHERE student_id = $1",
        [studentId]
      );
      res.json({ count: parseInt(result.rows[0].count, 10) }); // Ensure count is returned as an integer
    } catch (err) {
      console.error("Error fetching enrolled courses count:", err);
      res.status(500).json({ error: "Failed to fetch enrolled courses count" });
    }
  };
  
  const updateCourse = async (req, res) => {
    console.log(req.body);
    const { id } = req.params;
    const { title, price, description, imageUrl, modules } = req.body;

    try {
        // Update the course's basic details
        await pool.query(
            "UPDATE courses SET title = $1, price = $2, description = $3, image_url = $4 WHERE id = $5",
            [title, price, description, imageUrl, id]
        );

        // Update modules and lessons
        for (const module of modules) {
            if (module.id) {
                // Update existing module
                await pool.query(
                    "UPDATE modules SET title = $1 WHERE id = $2",
                    [module.title, module.id]
                );
            } else {
                // Insert new module
                const result = await pool.query(
                    "INSERT INTO modules (course_id, title) VALUES ($1, $2) RETURNING id",
                    [id, module.title]
                );
                module.id = result.rows[0].id; // Update module ID in the object
            }

            // Update lessons for the module
            for (const lesson of module.lessons) {
                if (lesson.id) {
                    // Update existing lesson
                    await pool.query(
                        "UPDATE lessons SET title = $1 WHERE id = $2",
                        [lesson.title, lesson.id]
                    );
                } else {
                    // Insert new lesson
                    await pool.query(
                        "INSERT INTO lessons (module_id, title) VALUES ($1, $2)",
                        [module.id, lesson.title]
                    );
                }
            }
        }

        res.json({ message: "Course updated successfully!" });
    } catch (error) {
        console.error("Error updating course:", error);
        res.status(500).json({ error: "Failed to update course" });
    }
};

// Check if a student is enrolled in a specific course
const checkEnrollmentStatus = async (req, res) => {
  const { studentId } = req;
  const { courseId } = req.params; // Get course ID from request params

  console.log("Student ID:", req.studentId);
  console.log("Course ID:", req.params.courseId);

  try {
      const result = await pool.query(
          "SELECT 1 FROM enrollments WHERE student_id = $1 AND course_id = $2",
          [studentId, courseId]
      );

      if (result.rowCount > 0) {
          return res.json({ enrolled: true });
      } else {
          return res.json({ enrolled: false });
      }
  } catch (error) {
      console.error("Error checking enrollment status:", error);
      res.status(500).json({ error: "Failed to check enrollment status" });
  }
};




  
  module.exports = { getCartItems, enrollCourses, getEnrolledCourses ,unenrollCourse, getEnrolledCoursesCount, updateCourse , checkEnrollmentStatus};
  
