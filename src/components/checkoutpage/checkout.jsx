import React, { useState } from "react";
import OrderSummary from "./orderSummary";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Menu from "../Menu";
import Footer from "../Footer";
import "../../componentscss/checkout.css";

const CheckoutPage = () => {
  const [totalPrice, setTotalPrice] = useState(0);
  const [enrollMessage, setEnrollMessage] = useState("");
  const [reloadKey, setReloadKey] = useState(Date.now()); // State to force re-mount
  const navigate = useNavigate();

  const handlePriceUpdate = (price) => {
    setTotalPrice(price);
  };

  const handleEnroll = async () => {
    try {
      const token = localStorage.getItem("token");

      // Send the enroll request
      const response = await axios.post(
        "http://localhost:5000/api/checkout/enroll",
        null,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // On success, navigate to StudentDashboard
      setEnrollMessage(response.data.message);
      alert(response.data.message);
      navigate("/studentDashboard");
    } catch (err) {
      console.error("Error enrolling in courses:", err);

      // Check if the error response contains a specific message
      if (err.response && err.response.data && err.response.data.error) {
        // Handle error: course already enrolled
        setEnrollMessage(err.response.data.error);
        alert(err.response.data.error);

        // Force reload OrderSummary by updating the reloadKey
        setReloadKey(Date.now());
      } else {
        // Handle other errors
        setEnrollMessage("An error occurred while enrolling in the course.");
        alert("An error occurred while enrolling in the course.");
      }
    }
  };

  return (
    <div>
      <header><Menu /></header>
          <div className="checkout-page">
          <h1>Checkout</h1>
          <div className="checkout-container">
          {/* Use reloadKey to force re-mount */}
          <OrderSummary key={reloadKey} onPriceUpdate={handlePriceUpdate} />
          <button className="enroll-button" onClick={handleEnroll}>
          Enroll
          </button>
          {enrollMessage && <p className="enroll-message">{enrollMessage}</p>}
          </div>
          </div>
          <footer><Footer /></footer>
    </div>
  );
};

export default CheckoutPage;
