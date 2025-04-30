import React, { useState } from "react";
import "../componentscss/feedbackDialog.css"; // Create this CSS too

function FeedbackDialog({ onClose, onSubmit }) {
  const [feedback, setFeedback] = useState("");

  const handleSubmit = () => {
    onSubmit(feedback);
    onClose();
  };

  return (
    <div className="dialogOverlay">
      <div className="dialogBox">
        <h3>Share Your Feedback</h3>
        <textarea
          placeholder="Write your feedback here..."
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          className="feedbackTextarea"
        />
        <div className="dialogActions">
          <button onClick={handleSubmit} className="submitButton">Submit</button>
          <button onClick={onClose} className="cancelButton">Cancel</button>
        </div>
      </div>
    </div>
  );
}

export default FeedbackDialog;
