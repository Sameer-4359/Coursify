import React, { useState } from "react";
import OrderSummary from "./orderSummary";
import BillingDetails from "./BillingDetails";
import PaymentSection from "./PaymentSection";

const CheckoutPage = () => {
  const [totalPrice, setTotalPrice] = useState(0);

  const handlePriceUpdate = (price) => {
    setTotalPrice(price);
  };

  const handleCheckout = () => {
    // Here, you can add checkout logic, such as calling a backend API for payment
    console.log("Proceeding with checkout...");
  };

  return (
    <div className="checkout-page">
      <h1>Checkout</h1>
      <div className="checkout-container">
        <OrderSummary onPriceUpdate={handlePriceUpdate} />
        <BillingDetails />
        <PaymentSection totalPrice={totalPrice} onCheckout={handleCheckout} />
      </div>
    </div>
  );
};

export default CheckoutPage;
