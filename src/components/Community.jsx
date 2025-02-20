import React, { useState } from "react";

function Community() {
  const [email, setEmail] = useState("");

  function saveState(event) {
    var newEmail = event.target.value;
    setEmail(newEmail);
  }

  return (
    <div className="communityMain">
      <div className="communityContainer">
        <h2>Join our Community</h2>
        <p>
          Enter your email address to register to our newsletter subscription
          delivered on regular basis!
        </p>
        <input
          onChange={saveState}
          type="text"
          value={email}
          placeholder="Enter your email"
        />
        <button>Subscribe</button>
        <hr />
      </div>
    </div>
  );
}

export default Community;
