import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import axios from "axios";
import Footer from "./Footer";
import Menu from "./Menu";
import "../componentscss/cart.css";


function CartPage() {
  const [cart, setCart] = useState([]); // Initialize cart as an empty array
  const [loading, setLoading] = useState(false); // Loading state
  const [error, setError] = useState(""); // Error state

  const navigate = useNavigate(); // Initialize useNavigate
  const studentId = localStorage.getItem("studentId");

  // Fetch cart items from the server
  const handleGetCourses = async () => {
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("token"); // Retrieve token from local storage or another source
      const response = await axios.get(`http://localhost:5000/api/cart/${studentId}`, {
        headers: {
          Authorization: `Bearer ${token}`, // Include token in Authorization header
        },
      });
      setCart(response.data); // Update cart with fetched data
    } catch (err) {
      console.error("Error fetching cart:", err);
      setError("Failed to fetch cart items.");
    } finally {
      setLoading(false);
    }
  };

  // Remove a course from the cart
  const handleRemoveCourse = async (courseId) => {
    const token = localStorage.getItem("token"); // Get the token from localStorage

    alert(`Removing course with ID: ${courseId} for student ID: ${studentId}`); // Debugging alert

    try {
      // Pass both studentId and courseId in the URL for the DELETE request
      const response = await axios.delete(`http://localhost:5000/api/cart/${studentId}/${courseId}`, {
        headers: {
          Authorization: `Bearer ${token}`, // Include the token in Authorization header
        },
      });

      alert(response.data.message); // Show success message
      handleGetCourses(); // Refresh the cart after removing the course
    } catch (err) {
      console.error("Error removing from cart:", err);
      alert("Failed to remove course from cart.");
    }
  };

  // Calculate total price of courses in the cart
  const calculateTotal = () => {
    return cart.reduce((total, course) => total + parseFloat(course.price), 0).toFixed(2);
  };
  

  // Redirect to the checkout page
  const handleCheckout = () => {
    navigate("/checkout"); // Navigate to /checkout
  };

  // Fetch cart items on component mount
  useEffect(() => {
    handleGetCourses();
  }, []);

  return (
    <div>
     <header><Menu /></header>

    <div>
      <Menu />
      <div className="cartPage">
        <div className="cartCourses">
          <h2>Your Cart</h2>
          {loading ? (
            <p>Loading...</p>
          ) : error ? (
            <p className="error">{error}</p>
          ) : cart.length === 0 ? (
            <p>No courses in the cart.</p>
          ) : (
            cart.map((course) => (
              <div key={course.course_id} className="courseItem">
                <div className="courseDetails">
                  <h3>{course.title}</h3>
                  <p>Instructor: {course.instructor_name}</p>
                  <p>Price: ${course.price}</p>
                </div>
                <button
                  className="removeButton"
                  onClick={() => handleRemoveCourse(course.course_id)}
                >
                  Remove from Cart
                </button>
              </div>
            ))
          )}
        </div>
        <div className="cartSummary">
          <h2>Summary</h2>
          <p>Total Amount: ${calculateTotal()}</p>
          <button className="checkoutButton" onClick={handleCheckout}>
            Proceed to Checkout
          </button>
        </div>
      </div>
      <Footer />
    </div>
    <footer><Footer /></footer>
      </div>

  );
}

export default CartPage;
