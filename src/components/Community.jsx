import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../componentscss/community.css";

function Community() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  async function handleSubscribe() {
    try {
      const response = await fetch("http://localhost:5000/api/community/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      setMessage(response.ok ? data.message : "Failed to subscribe.");
    } catch (error) {
      setMessage("An error occurred. Please try again.");
    }
  }

  return (
    <div className="communityMain">
      <div className="communityContainer">
        <h2>Join our Community</h2>
        <p>Enter your email to subscribe to our newsletter!</p>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button onClick={handleSubscribe}>Subscribe</button>
        <button className="about-us-btn" onClick={() => navigate("/aboutus")}>
          About Us
        </button>
        {message && <p>{message}</p>}
      </div>
    </div>
  );
}

export default Community;
