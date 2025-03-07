import React, { useEffect, useState } from "react";
import axios from "axios";
import "../../componentscss/checkout.css";

const OrderSummary = ({ onPriceUpdate }) => {
  const [courses, setCourses] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:5000/api/checkout/cart", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setCourses(response.data);
      } catch (err) {
        console.error("Error fetching cart items:", err);
        setError("Failed to fetch cart items.");
      }
    };

    fetchCartItems();
  }, []);

  const total = courses.reduce((acc, course) => acc + (Number(course.price) || 0), 0);

  useEffect(() => {
    onPriceUpdate(total);
  }, [total, onPriceUpdate]);

  if (error) return <p className="error">{error}</p>;

  return (
    <div className="order-summary">
      <h2>Order Summary</h2>
      {courses.length === 0 ? (
        <p>No items in the cart.</p>
      ) : (
        <>
          {courses.map((course) => (
            <div key={course.id} className="order-item">
              <p>{course.title}</p>
              <p>${(Number(course.price) || 0).toFixed(2)}</p>
            </div>
          ))}
          <div className="order-total">
            <strong>Total: ${total.toFixed(2)}</strong>
          </div>
        </>
      )}
    </div>
  );
};

export default OrderSummary;
