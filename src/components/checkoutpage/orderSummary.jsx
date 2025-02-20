import React, { useEffect } from "react";

const OrderSummary = ({ onPriceUpdate }) => {
  const courses = [
    { id: 1, title: "React for Beginners", price: 29.99 },
    { id: 2, title: "Advanced JavaScript", price: 39.99 },
  ];

  const total = courses.reduce((acc, course) => acc + course.price, 0);

  useEffect(() => {
    onPriceUpdate(total);
  }, [total, onPriceUpdate]);

  return (
    <div className="order-summary">
      <h2>Order Summary</h2>
      {courses.map((course) => (
        <div key={course.id} className="order-item">
          <p>{course.title}</p>
          <p>${course.price.toFixed(2)}</p>
        </div>
      ))}
      <div className="order-total">
        <strong>Total: ${total.toFixed(2)}</strong>
      </div>
    </div>
  );
};

export default OrderSummary;
