const express = require("express");
const { addToCart, getCartItems, removeFromCart } = require("../controllers/cartController");
const authenticateStudent = require("../middleware/authenticateStudent");

const router = express.Router();

router.use(authenticateStudent);
// Add to cart
router.post("/add",  addToCart);

// Get all cart items for a student
router.get("/:studentId", getCartItems);

// Remove a course from the cart
router.delete("/:studentId/:courseId",  removeFromCart);

module.exports = router;
