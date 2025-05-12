// const db = require("../config/db");

// // Fetch all courses for a specific instructor
// exports.getCourses = async (req, res) => {
//   const loggedInInstructorId = req.instructorId;

//   try {
//     const result = await db.query(
//       `SELECT c.*, i.username AS instructorName 
//        FROM courses c 
//        JOIN instructors i ON c.instructor_id = i.id 
//        WHERE c.instructor_id = $1 
//        ORDER BY c.created_at DESC`,
//       [loggedInInstructorId]
//     );

//     res.status(200).json(result.rows);
//   } catch (error) {
//     console.error("Error fetching courses:", error);
//     res.status(500).json({ error: "Failed to fetch courses" });
//   }
// };

// // Add a new course with modules and lessons
// exports.addCourse = async (req, res) => {
//   const loggedInInstructorId = req.instructorId; // Instructor ID from the JWT token
//   const { title, price, description, imageUrl, modules } = req.body;

//   try {
//     // Insert the course into the courses table
//     const courseResult = await db.query(
//       "INSERT INTO courses (title, instructor_id, price, description, image_url) VALUES ($1, $2, $3, $4, $5) RETURNING id",
//       [title, loggedInInstructorId, price, description, imageUrl]
//     );
//     const courseId = courseResult.rows[0].id;

//     // Insert modules and lessons
//     for (const module of modules) {
//       const moduleResult = await db.query(
//         "INSERT INTO modules (course_id, title) VALUES ($1, $2) RETURNING id",
//         [courseId, module.title]
//       );
//       const moduleId = moduleResult.rows[0].id;

//       for (const lesson of module.lessons) {
//         await db.query("INSERT INTO lessons (module_id, title) VALUES ($1, $2)", [moduleId, lesson]);
//       }
//     }

//     res.status(201).json({ message: "Course added successfully", courseId });
//   } catch (error) {
//     console.error("Error adding course:", error);
//     res.status(500).json({ error: "Failed to add course" });
//   }
// };

// // Update an existing course
// exports.updateCourse = async (req, res) => {
//   const loggedInInstructorId = req.instructorId;
//   const { courseId } = req.params;
//   const { title, price, description, imageUrl, modules } = req.body;

//   try {
//     const client = await db.connect(); // For transaction handling
//     await client.query("BEGIN");

//     // Check if the course exists and belongs to the instructor
//     const courseResult = await client.query(
//       "SELECT instructor_id, is_locked FROM courses WHERE id = $1",
//       [courseId]
//     );

//     if (courseResult.rowCount === 0) {
//       return res.status(404).json({ error: "Course not found" });
//     }

//     if (courseResult.rows[0].instructor_id !== loggedInInstructorId) {
//       return res.status(403).json({ error: "Forbidden: You can only update your own courses" });
//     }

//     if (courseResult.rows[0].is_locked) {
//       return res.status(423).json({ error: "Course is locked. Try again later." });
//     }

//     // Lock the course
//     await client.query("UPDATE courses SET is_locked = TRUE WHERE id = $1", [courseId]);

//     // Update the main course details
//     await client.query(
//       "UPDATE courses SET title = $1, price = $2, description = $3, image_url = $4 WHERE id = $5",
//       [title, price, description, imageUrl, courseId]
//     );

//     // Delete existing modules and lessons
//     await client.query(
//       "DELETE FROM lessons WHERE module_id IN (SELECT id FROM modules WHERE course_id = $1)",
//       [courseId]
//     );
//     await client.query("DELETE FROM modules WHERE course_id = $1", [courseId]);

//     // Insert new modules and lessons
//     for (const module of modules) {
//       const moduleResult = await client.query(
//         "INSERT INTO modules (title, course_id) VALUES ($1, $2) RETURNING id",
//         [module.title, courseId]
//       );

//       const moduleId = moduleResult.rows[0].id;

//       for (const lesson of module.lessons) {
//         await client.query(
//           "INSERT INTO lessons (title, module_id) VALUES ($1, $2)",
//           [lesson, moduleId]
//         );
//       }
//     }

//     // Unlock the course
//     await client.query("UPDATE courses SET is_locked = FALSE WHERE id = $1", [courseId]);

//     await client.query("COMMIT");
//     res.status(200).json({ message: "Course updated successfully" });
//   } catch (error) {
//     await client.query("ROLLBACK");
//     console.error("Error updating course:", error);
//     res.status(500).json({ error: "Failed to update course" });
//   }
// };


// //Delete a course
// exports.deleteCourse = async (req, res) => {
//   const loggedInInstructorId = req.instructorId;
//   const { courseId } = req.params;

//   try {
//     const client = await db.connect(); // For transaction handling
//     await client.query("BEGIN");

//     const courseResult = await client.query(
//       "SELECT instructor_id, is_locked FROM courses WHERE id = $1",
//       [courseId]
//     );

//     if (courseResult.rowCount === 0) {
//       return res.status(404).json({ error: "Course not found" });
//     }

//     if (courseResult.rows[0].instructor_id !== loggedInInstructorId) {
//       return res.status(403).json({ error: "Forbidden: You can only delete your own courses" });
//     }

//     if (courseResult.rows[0].is_locked) {
//       return res.status(423).json({ error: "Course is locked. Try again later." });
//     }

//     // Lock the course
//     await client.query("UPDATE courses SET is_locked = TRUE WHERE id = $1", [courseId]);

//     // Delete the course
//     await client.query("DELETE FROM courses WHERE id = $1", [courseId]);

//     await client.query("COMMIT");
//     res.status(200).json({ message: "Course deleted successfully" });
//   } catch (error) {
//     await client.query("ROLLBACK");
//     console.error("Error deleting course:", error);
//     res.status(500).json({ error: "Failed to delete course" });
//   }
// };




// // Fetch detailed course information
// exports.getCourseDetails = async (req, res) => {
//   const { courseId } = req.params;

//   try {
//     const result = await db.query(
//       `
//       SELECT 
//         c.title, 
//         c.price, 
//         c.description, 
//         c.image_url, 
//         i.username AS instructorName,
//         json_agg(
//           json_build_object(
//             'id', m.id,
//             'title', m.title,
//             'lessons', (
//               SELECT array_agg(l.title) 
//               FROM lessons l 
//               WHERE l.module_id = m.id
//             )
//           )
//         ) AS modules
//       FROM courses c
//       JOIN instructors i ON c.instructor_id = i.id
//       LEFT JOIN modules m ON m.course_id = c.id
//       WHERE c.id = $1
//       GROUP BY c.id, i.username
//       `,
//       [courseId]
//     );

//     if (result.rowCount === 0) {
//       return res.status(404).json({ error: "Course not found" });
//     }

//     res.status(200).json(result.rows[0]);
//   } catch (error) {
//     console.error("Error fetching course details:", error);
//     res.status(500).json({ error: "Failed to fetch course details" });
//   }
// };




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

// Add a new course with modules and lessons (with video_url)
exports.addCourse = async (req, res) => {
  const loggedInInstructorId = req.instructorId;
  const { title, price, description, imageUrl, modules } = req.body;

  try {
    // Insert course
    const courseResult = await db.query(
      "INSERT INTO courses (title, instructor_id, price, description, image_url) VALUES ($1, $2, $3, $4, $5) RETURNING id",
      [title, loggedInInstructorId, price, description, imageUrl]
    );
    const courseId = courseResult.rows[0].id;

    // Insert modules and lessons with video_url
    for (const module of modules) {
      const moduleResult = await db.query(
        "INSERT INTO modules (course_id, title) VALUES ($1, $2) RETURNING id",
        [courseId, module.title]
      );
      const moduleId = moduleResult.rows[0].id;

      for (const lesson of module.lessons) {
        await db.query(
          "INSERT INTO lessons (module_id, title, video_url,course_id,assignment_url) VALUES ($1, $2, $3,$4,$5)",
          [moduleId, lesson.title, lesson.video_url ,courseId,lesson.assignment_url|| null]
        );
      }
    }

    res.status(201).json({ message: "Course added successfully", courseId });
  } catch (error) {
    console.error("Error adding course:", error);
    res.status(500).json({ error: "Failed to add course" });
  }
};

// Update course details including modules and lessons
exports.updateCourse = async (req, res) => {
  const loggedInInstructorId = req.instructorId;
  const { courseId } = req.params;
  const { title, price, description, imageUrl, modules } = req.body;

  try {
    const client = await db.connect();
    await client.query("BEGIN");

    // Check if the course belongs to the instructor
    const courseResult = await client.query(
      "SELECT instructor_id FROM courses WHERE id = $1",
      [courseId]
    );

    if (courseResult.rowCount === 0) {
      return res.status(404).json({ error: "Course not found" });
    }

    if (courseResult.rows[0].instructor_id !== loggedInInstructorId) {
      return res.status(403).json({ error: "Forbidden: You can only update your own courses" });
    }

    // Update course details
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
          "INSERT INTO lessons (title, module_id, video_url,course_id,assignment_url) VALUES ($1, $2, $3,$4,$5)",
          [lesson.title, moduleId, lesson.video_url,courseId,lesson.assignment_url || null]
        );
      }
    }

    await client.query("COMMIT");
    res.status(200).json({ message: "Course updated successfully" });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Error updating course:", error);
    res.status(500).json({ error: "Failed to update course" });
  }
};

// Fetch course details with lessons and video URLs
// exports.getCourseDetails = async (req, res) => {
//   const { courseId } = req.params;

//   try {
//     const result = await db.query(
//       `
//       SELECT 
//         c.title, 
//         c.price, 
//         c.description, 
//         c.image_url, 
//         i.username AS instructorName,
//         COALESCE(
//           json_agg(
//             json_build_object(
//               'id', m.id,
//               'title', m.title,
//               'lessons', (
//                 SELECT COALESCE(json_agg(
//                   json_build_object(
//                     'id', l.id, 
//                     'title', l.title, 
//                     'video_url', l.video_url,
//                     'assignment_url', l.assignment_url
//                   )
//                 ), '[]'::json)
//                 FROM lessons l 
//                 WHERE l.module_id = m.id
//               )
//             )
//           ) FILTER (WHERE m.id IS NOT NULL), '[]'::json
//         ) AS modules
//       FROM courses c
//       JOIN instructors i ON c.instructor_id = i.id
//       LEFT JOIN modules m ON m.course_id = c.id
//       WHERE c.id = $1
//       GROUP BY c.id, i.username
//       `,
//       [courseId]
//     );

//     if (result.rowCount === 0) {
//       return res.status(404).json({ error: "Course not found" });
//     }

//     res.status(200).json(result.rows[0]);
//   } catch (error) {
//     console.error("Error fetching course details:", error);
//     res.status(500).json({ error: "Failed to fetch course details" });
//   }
// };

exports.getCourseDetails = async (req, res) => {
  const { courseId } = req.params;

  try {
    const result = await db.query(
      `
      SELECT 
        c.id,
        c.title, 
        c.price, 
        c.description, 
        c.image_url, 
        i.id AS instructor_id,
        i.username AS instructor_name,
        COALESCE(
          json_agg(
            json_build_object(
              'id', m.id,
              'title', m.title,
              'lessons', (
                SELECT COALESCE(json_agg(
                  json_build_object(
                    'id', l.id, 
                    'title', l.title, 
                    'video_url', l.video_url,
                    'assignment_url', l.assignment_url
                  )
                ), '[]'::json)
                FROM lessons l 
                WHERE l.module_id = m.id
              )
            )
          ) FILTER (WHERE m.id IS NOT NULL), '[]'::json
        ) AS modules
      FROM courses c
      JOIN instructors i ON c.instructor_id = i.id
      LEFT JOIN modules m ON m.course_id = c.id
      WHERE c.id = $1
      GROUP BY c.id, i.id
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


// Update a specific lesson
exports.updateLesson = async (req, res) => {
  const { lessonId } = req.params;
  const { title, video_url ,assignment_url} = req.body;

  try {
    const result = await db.query(
      "UPDATE lessons SET title = $1, video_url = $2 , assignment_url=$3 WHERE id = $4 RETURNING *",
      [title, video_url,assignment_url, lessonId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Lesson not found" });
    }

    res.status(200).json({ message: "Lesson updated successfully", lesson: result.rows[0] });
  } catch (error) {
    console.error("Error updating lesson:", error);
    res.status(500).json({ error: "Failed to update lesson" });
  }
};

// Fetch all lessons for a specific course
exports.getLessons = async (req, res) => {
  const { courseId } = req.params;

  try {
    const result = await db.query(
      `SELECT l.id, l.title, l.video_url, m.title AS module_title
       FROM lessons l
       JOIN modules m ON l.module_id = m.id
       WHERE m.course_id = $1
       ORDER BY m.id, l.id`,
      [courseId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "No lessons found for this course" });
    }

    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error fetching lessons:", error);
    res.status(500).json({ error: "Failed to fetch lessons" });
  }
};


// Delete a specific lesson
exports.deleteLesson = async (req, res) => {
  const { lessonId } = req.params;

  try {
    const result = await db.query("DELETE FROM lessons WHERE id = $1 RETURNING *", [lessonId]);

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Lesson not found" });
    }

    res.status(200).json({ message: "Lesson deleted successfully" });
  } catch (error) {
    console.error("Error deleting lesson:", error);
    res.status(500).json({ error: "Failed to delete lesson" });
  }
};



// Delete a course along with its modules, lessons, and videos
exports.deleteCourse = async (req, res) => {
  const loggedInInstructorId = req.instructorId;
  const { courseId } = req.params;

  try {
    const client = await db.connect(); // For transaction handling
    await client.query("BEGIN");

    // Check if the course exists and belongs to the instructor
    const courseResult = await client.query(
      "SELECT instructor_id FROM courses WHERE id = $1",
      [courseId]
    );

    if (courseResult.rowCount === 0) {
      return res.status(404).json({ error: "Course not found" });
    }

    if (courseResult.rows[0].instructor_id !== loggedInInstructorId) {
      return res.status(403).json({ error: "Forbidden: You can only delete your own courses" });
    }

    // Get all video URLs from lessons before deleting them
    const lessonsResult = await client.query(
      "SELECT video_url,assignment_url FROM lessons WHERE module_id IN (SELECT id FROM modules WHERE course_id = $1)",
      [courseId]
    );

    // Delete videos from Cloudinary
    for (const lesson of lessonsResult.rows) {
      if (lesson.video_url) {
        const publicId = lesson.video_url.split("/").pop().split(".")[0]; // Extract public ID
        await cloudinary.uploader.destroy(publicId);
      }
      if (lesson.assignment_url) {
        const publicId = lesson.assignment_url.split("/").pop().split(".")[0];
        await cloudinary.uploader.destroy(publicId, { resource_type: "raw" }); // Cloudinary raw file delete
      }
      
    }

    // Delete lessons
    await client.query(
      "DELETE FROM lessons WHERE module_id IN (SELECT id FROM modules WHERE course_id = $1)",
      [courseId]
    );

    // Delete modules
    await client.query("DELETE FROM modules WHERE course_id = $1", [courseId]);

    // Finally, delete the course
    await client.query("DELETE FROM courses WHERE id = $1", [courseId]);

    await client.query("COMMIT");

    res.status(200).json({ message: "Course deleted successfully" });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Error deleting course:", error);
    res.status(500).json({ error: "Failed to delete course" });
  }
};


// Add these to your instructorCourseController.js

// Get instructor reviews
exports.getInstructorReviews = async (req, res) => {
  const instructorId = req.params.instructorId;

  try {
    const result = await db.query(
      `SELECT r.*, c.title AS course_title, s.username AS student_name
       FROM reviews r
       JOIN courses c ON r.course_id = c.id
       JOIN students s ON r.student_id = s.id
       WHERE c.instructor_id = $1
       ORDER BY r.created_at DESC`,
      [instructorId]
    );

    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error fetching reviews:", error);
    res.status(500).json({ error: "Failed to fetch reviews" });
  }
};

// Get instructor earnings
exports.getInstructorEarnings = async (req, res) => {
  const instructorId = req.params.instructorId;

  try {
    // Get total earnings
    const earningsResult = await db.query(
      `SELECT 
         COALESCE(SUM(c.price * COUNT(e.id)), 0) AS total_earnings,
         COALESCE(COUNT(DISTINCT e.student_id), 0) AS total_students,
         COALESCE(COUNT(DISTINCT e.course_id), 0) AS total_courses
       FROM enrollments e
       JOIN courses c ON e.course_id = c.id
       WHERE c.instructor_id = $1
       GROUP BY c.instructor_id`,
      [instructorId]
    );

    // Default values if no results
    const earningsData = earningsResult.rowCount > 0 ? earningsResult.rows[0] : {
      total_earnings: 0,
      total_students: 0,
      total_courses: 0
    };

    // Get earnings breakdown
    const breakdownResult = await db.query(
      `SELECT 
         c.id,
         c.title,
         c.price,
         COALESCE(COUNT(e.id), 0) AS enrollments_count,
         COALESCE((c.price * COUNT(e.id)), 0) AS course_earnings
       FROM courses c
       LEFT JOIN enrollments e ON e.course_id = c.id
       WHERE c.instructor_id = $1
       GROUP BY c.id`,
      [instructorId]
    );

    res.status(200).json({
      totalEarnings: earningsData.total_earnings,
      totalStudents: earningsData.total_students,
      totalCourses: earningsData.total_courses,
      breakdown: breakdownResult.rows
    });
  } catch (error) {
    console.error("Error fetching earnings:", error);
    res.status(500).json({ 
      error: "Failed to fetch earnings",
      details: error.message 
    });
  }
};