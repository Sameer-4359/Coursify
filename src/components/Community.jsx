import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../componentscss/community.css";


function Community() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate(); 

  function saveState(event) {
    setEmail(event.target.value);
  }

  async function handleSubscribe() {
    try {
      const response = await fetch("http://localhost:5000/api/community/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      if (response.ok) {
        setMessage(data.message);
      } else {
        setMessage(data.message || "Failed to subscribe.");
      }
    } catch (error) {
      console.error("Error during subscription:", error);
      setMessage("An error occurred. Please try again.");
    }
  }

  return (
    <div className="communityMain">
      <div className="communityContainer">
        <h2>Join our Community</h2>
        <p>
          Enter your email address to register to our newsletter subscription
          delivered on a regular basis!
        </p>
        <input
          onChange={saveState}
          type="text"
          value={email}
          placeholder="Enter your email"
        />
        <button onClick={handleSubscribe}>Subscribe</button>
        <button className="about-us-btn" onClick={() => navigate("/aboutus")}>
                    About Us
                </button>
        <p>{message}</p>
        <hr />
      </div>
    </div>
  );
}

export default Community;
