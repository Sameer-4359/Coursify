import React, { useState } from "react";
import Footer from "./Footer";
import Menu from "./Menu";


function CartPage() {
  const [cart, setCart] = useState([
    // Example initial cart data (empty or pre-filled for testing)
    { id: 1, title: "Course 1", price: 200, instructor: "Instructor A" },
    { id: 2, title: "Course 2", price: 300, instructor: "Instructor B" },
  ]);

  const handleRemoveFromCart = (id) => {
    setCart(cart.filter((course) => course.id !== id));
  };

  const calculateTotal = () => {
    return cart.reduce((total, course) => total + course.price, 0);
  };

  return (
    <div>
      <Menu />
    <div className="cartPage">
      <div className="cartCourses">
        <h2>Your Cart</h2>
        {cart.length === 0 ? (
          <p>No courses in the cart.</p>
        ) : (
          cart.map((course) => (
            <div key={course.id} className="courseItem">
              <div className="courseDetails">
                <h3>{course.title}</h3>
                <p>Instructor: {course.instructor}</p>
                <p>Price: ${course.price}</p>
              </div>
              <button
                className="removeButton"
                onClick={() => handleRemoveFromCart(course.id)}
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
        <button className="checkoutButton">Proceed to Checkout</button>
      </div>
    </div>
      <Footer />
      </div>
    
  );
}

export default CartPage;
