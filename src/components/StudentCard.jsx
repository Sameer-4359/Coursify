import React from "react";
import { useNavigate } from "react-router-dom";


function StudentCard({ id, img, title, instructor }) {
  const navigate = useNavigate();

  const handleSeeMore = () => {
    navigate(`/course-details/${id}`);
  };

  const handleUnenroll = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No authentication token found!");
        return;
      }

      const response = await fetch(`http://localhost:5000/api/checkout/unenroll/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        console.log(`Successfully unenrolled from course ID: ${id}`);
        // Optionally refresh the list of courses or notify the parent component
        window.location.reload(); // Reload to update the list of enrolled courses
      } else {
        const errorData = await response.json();
        console.error("Error:", errorData.error);
      }
    } catch (error) {
      console.error("Error during unenrollment:", error);
      alert("Error during unenrollment:", error);
    }
  };

  return (
    <div className="studentCard">
      <div className="cardImg">
        <img src={img} alt={title} />
      </div>
      <div className="cardContent">
        <h2>{title}</h2>
        <p>Instructor: {instructor}</p>
        <div className="cardActions">
          <button onClick={handleSeeMore}>See More</button>
          <button onClick={handleUnenroll}>Unenroll</button>
        </div>
      </div>
    </div>
  );
}

export default StudentCard;
