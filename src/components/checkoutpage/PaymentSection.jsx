import React, { useState } from "react";
import "../../componentscss/checkout.css";





const PaymentSection = ({ totalPrice, onCheckout }) => {
  const [paymentMethod, setPaymentMethod] = useState("Credit Card");

  const handlePaymentChange = (e) => {
    setPaymentMethod(e.target.value);
  };

  const handlePayNow = () => {
    // Implement payment processing logic
    onCheckout();
    alert("Payment successful!");
  };

  return (
    <div className="payment-section">
      <h2>Payment Method</h2>
      <select
        className="billingButtons"
        onChange={handlePaymentChange}
        value={paymentMethod}
      >
        <option value="Credit Card">Credit Card</option>
        <option value="PayPal">PayPal</option>
      </select>
      <p>Total to Pay: ${totalPrice.toFixed(2)}</p>
      <button onClick={handlePayNow} className="pay-now-button billingButtons">
        Pay Now
      </button>
    </div>
  );
};

export default PaymentSection;
