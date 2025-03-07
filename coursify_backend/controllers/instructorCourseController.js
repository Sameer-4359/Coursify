const db = require("../config/db");

// Fetch all courses for a specific instructor
exports.getCourses = async (req, res) => {
  const loggedInInstructorId = req.instructorId;

  try {
    const result = await db.query(
      `SELECT c.*, i.username AS instructorName 
       FROM courses c 
       JOIN instructors i ON c.instructor_id = i.id 
       WHERE c.instructor_id = $1 
       ORDER BY c.created_at DESC`,
      [loggedInInstructorId]
    );

    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error fetching courses:", error);
    res.status(500).json({ error: "Failed to fetch courses" });
  }
};

// Add a new course with modules and lessons
exports.addCourse = async (req, res) => {
  const loggedInInstructorId = req.instructorId; // Instructor ID from the JWT token
  const { title, price, description, imageUrl, modules } = req.body;

  try {
    // Insert the course into the courses table
    const courseResult = await db.query(
      "INSERT INTO courses (title, instructor_id, price, description, image_url) VALUES ($1, $2, $3, $4, $5) RETURNING id",
      [title, loggedInInstructorId, price, description, imageUrl]
    );
    const courseId = courseResult.rows[0].id;

    // Insert modules and lessons
    for (const module of modules) {
      const moduleResult = await db.query(
        "INSERT INTO modules (course_id, title) VALUES ($1, $2) RETURNING id",
        [courseId, module.title]
      );
      const moduleId = moduleResult.rows[0].id;

      for (const lesson of module.lessons) {
        await db.query("INSERT INTO lessons (module_id, title) VALUES ($1, $2)", [moduleId, lesson]);
      }
    }

    res.status(201).json({ message: "Course added successfully", courseId });
  } catch (error) {
    console.error("Error adding course:", error);
    res.status(500).json({ error: "Failed to add course" });
  }
};

// Update an existing course
exports.updateCourse = async (req, res) => {
  const loggedInInstructorId = req.instructorId;
  const { courseId } = req.params;
  const { title, price, description, imageUrl, modules } = req.body;

  try {
    const client = await db.connect(); // For transaction handling
    await client.query("BEGIN");

    // Check if the course exists and belongs to the instructor
    const courseResult = await client.query(
      "SELECT instructor_id, is_locked FROM courses WHERE id = $1",
      [courseId]
    );

    if (courseResult.rowCount === 0) {
      return res.status(404).json({ error: "Course not found" });
    }

    if (courseResult.rows[0].instructor_id !== loggedInInstructorId) {
      return res.status(403).json({ error: "Forbidden: You can only update your own courses" });
    }

    if (courseResult.rows[0].is_locked) {
      return res.status(423).json({ error: "Course is locked. Try again later." });
    }

    // Lock the course
    await client.query("UPDATE courses SET is_locked = TRUE WHERE id = $1", [courseId]);

    // Update the main course details
    await client.query(
      "UPDATE courses SET title = $1, price = $2, description = $3, image_url = $4 WHERE id = $5",
      [title, price, description, imageUrl, courseId]
    );

    // Delete existing modules and lessons
    await client.query(
      "DELETE FROM lessons WHERE module_id IN (SELECT id FROM modules WHERE course_id = $1)",
      [courseId]
    );
    await client.query("DELETE FROM modules WHERE course_id = $1", [courseId]);

    // Insert new modules and lessons
    for (const module of modules) {
      const moduleResult = await client.query(
        "INSERT INTO modules (title, course_id) VALUES ($1, $2) RETURNING id",
        [module.title, courseId]
      );

      const moduleId = moduleResult.rows[0].id;

      for (const lesson of module.lessons) {
        await client.query(
          "INSERT INTO lessons (title, module_id) VALUES ($1, $2)",
          [lesson, moduleId]
        );
      }
    }

    // Unlock the course
    await client.query("UPDATE courses SET is_locked = FALSE WHERE id = $1", [courseId]);

    await client.query("COMMIT");
    res.status(200).json({ message: "Course updated successfully" });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Error updating course:", error);
    res.status(500).json({ error: "Failed to update course" });
  }
};


//Delete a course
exports.deleteCourse = async (req, res) => {
  const loggedInInstructorId = req.instructorId;
  const { courseId } = req.params;

  try {
    const client = await db.connect(); // For transaction handling
    await client.query("BEGIN");

    const courseResult = await client.query(
      "SELECT instructor_id, is_locked FROM courses WHERE id = $1",
      [courseId]
    );

    if (courseResult.rowCount === 0) {
      return res.status(404).json({ error: "Course not found" });
    }

    if (courseResult.rows[0].instructor_id !== loggedInInstructorId) {
      return res.status(403).json({ error: "Forbidden: You can only delete your own courses" });
    }

    if (courseResult.rows[0].is_locked) {
      return res.status(423).json({ error: "Course is locked. Try again later." });
    }

    // Lock the course
    await client.query("UPDATE courses SET is_locked = TRUE WHERE id = $1", [courseId]);

    // Delete the course
    await client.query("DELETE FROM courses WHERE id = $1", [courseId]);

    await client.query("COMMIT");
    res.status(200).json({ message: "Course deleted successfully" });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Error deleting course:", error);
    res.status(500).json({ error: "Failed to delete course" });
  }
};




// Fetch detailed course information
exports.getCourseDetails = async (req, res) => {
  const { courseId } = req.params;

  try {
    const result = await db.query(
      `
      SELECT 
        c.title, 
        c.price, 
        c.description, 
        c.image_url, 
        i.username AS instructorName,
        json_agg(
          json_build_object(
            'id', m.id,
            'title', m.title,
            'lessons', (
              SELECT array_agg(l.title) 
              FROM lessons l 
              WHERE l.module_id = m.id
            )
          )
        ) AS modules
      FROM courses c
      JOIN instructors i ON c.instructor_id = i.id
      LEFT JOIN modules m ON m.course_id = c.id
      WHERE c.id = $1
      GROUP BY c.id, i.username
      `,
      [courseId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Course not found" });
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error("Error fetching course details:", error);
    res.status(500).json({ error: "Failed to fetch course details" });
  }
};



