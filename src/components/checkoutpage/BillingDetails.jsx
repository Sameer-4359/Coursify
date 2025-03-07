import React, { useState } from "react";
import "../../componentscss/checkout.css";


const BillingDetails = () => {
  const [billingInfo, setBillingInfo] = useState({
    fullName: "",
    email: "",
    address: "",
    city: "",
    zip: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBillingInfo({ ...billingInfo, [name]: value });
  };

  return (
    <div className="billing-details">
      <h2>Billing Details</h2>
      <input
        className="billingButtons"
        type="text"
        name="fullName"
        placeholder="Full Name"
        onChange={handleChange}
      />
      <input
        className="billingButtons"
        type="email"
        name="email"
        placeholder="Email Address"
        onChange={handleChange}
      />
      <input
        className="billingButtons"
        type="text"
        name="address"
        placeholder="Address"
        onChange={handleChange}
      />
      <input
        className="billingButtons"
        type="text"
        name="city"
        placeholder="City"
        onChange={handleChange}
      />
      <input
        className="billingButtons"
        type="text"
        name="zip"
        placeholder="ZIP Code"
        onChange={handleChange}
      />
    </div>
  );
};

export default BillingDetails;
