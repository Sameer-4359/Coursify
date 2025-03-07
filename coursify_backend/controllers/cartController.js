const pool = require("../config/db");

// Add a course to the cart
// const addToCart = async (req, res) => {
//     const studentId = req.studentId; // Extracted from the token
//     const { courseId } = req.body;
  
//     console.log("Authenticated studentId:", studentId);
//     console.log("Received courseId:", courseId);
  
//     if (!courseId) {
//       return res.status(400).json({ message: "Course ID is required." });
//     }
  
//     try {
//       // Check if the course is already in the cart for the student
//       const existingCart = await pool.query(
//         "SELECT * FROM cart WHERE student_id = $1 AND course_id = $2",
//         [studentId, courseId]
//       );
  
//       if (existingCart.rows.length > 0) {
//         return res.status(400).json({ message: "This course is already in your cart." });
//       }
  
//       // Insert the course into the cart
//       await pool.query(
//         "INSERT INTO cart (student_id, course_id, added_at) VALUES ($1, $2, NOW())",
//         [studentId, courseId]
//       );
  
//       res.status(200).json({ message: "Course added to cart successfully!" });
//     } catch (err) {
//       console.error("Error adding course to cart:", err);
//       res.status(500).json({ message: "Server error" });
//     }
//   };
  
const addToCart = async (req, res) => {
  const studentId = req.studentId;
  const { courseId } = req.body;

  if (!courseId) {
    return res.status(400).json({ message: "Course ID is required." });
  }

  try {
    // Check if the course is locked
    const course = await pool.query("SELECT is_locked FROM courses WHERE id = $1", [courseId]);

    if (course.rowCount === 0) {
      return res.status(404).json({ message: "Course not found." });
    }

    if (course.rows[0].is_locked) {
      return res.status(423).json({ message: "Course is currently locked. Try again later." });
    }

    // Check if the course is already in the cart
    const existingCart = await pool.query(
      "SELECT * FROM cart WHERE student_id = $1 AND course_id = $2",
      [studentId, courseId]
    );

    if (existingCart.rows.length > 0) {
      return res.status(400).json({ message: "This course is already in your cart." });
    }

    // Add the course to the cart
    await pool.query(
      "INSERT INTO cart (student_id, course_id, added_at) VALUES ($1, $2, NOW())",
      [studentId, courseId]
    );

    res.status(200).json({ message: "Course added to cart successfully!" });
  } catch (err) {
    console.error("Error adding course to cart:", err);
    res.status(500).json({ message: "Server error" });
  }
};




// Get all cart items for a student
const getCartItems = async (req, res) => {
  const { studentId } = req.params;

  try {
    const cartItems = await pool.query(
      `SELECT c.id AS course_id, c.title, c.price, c.image_url, i.username AS instructor_name
       FROM cart
       INNER JOIN courses c ON cart.course_id = c.id
       INNER JOIN instructors i ON c.instructor_id = i.id
       WHERE cart.student_id = $1;`, // Add a semicolon to terminate the query
      [studentId]
    );

    res.json(cartItems.rows);
  } catch (error) {
    console.error("Error fetching cart items:", error);
    res.status(500).json({ message: "Server error" });
  }
};


// Remove a course from the cart
const removeFromCart = async (req, res) => {
  const { courseId } = req.params;
  const studentId = req.studentId;  // Get studentId from token

  try {
    const result = await pool.query(
      "DELETE FROM cart WHERE student_id = $1 AND course_id = $2",
      [studentId, courseId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Course not found in cart." });
    }

    res.json({ message: "Course removed from cart" });
  } catch (error) {
    console.error("Error removing from cart:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  addToCart,
  getCartItems,
  removeFromCart,
};
