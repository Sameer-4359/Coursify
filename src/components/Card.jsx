import React from "react"; 
import { useNavigate } from "react-router-dom";
import "../componentscss/card.css";


function Card({ img, title, instructor, price, role, id }) {
  const navigate = useNavigate(); // Initialize useNavigate hook for navigation

  const handleDelete = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/courses/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (response.ok) {
        alert("Course deleted successfully");
        // Redirect to /adminDashboard after deletion
        navigate("/adminDashboard"); // `replace: true` prevents adding to the browser history stack
      } else {
        alert("Failed to delete course");
      }
    } catch (error) {
      console.error("Error deleting course:", error);
    }
  };

  const handleSeeMore = () => {
    navigate(`/course-details/${id}`); // Navigate to course details page for this specific course
  };

  return (
    <div className="courseCard">
      <div className="cardImg">
        <img src={img} alt="" />
      </div>
      <div className="cardContent">
        <h2>{title}</h2>
        <p>{instructor}</p>
        <p>{price}</p>
        <button onClick={handleSeeMore}>See more...</button>
        {role === "Admin" && (
          <button className="deleteButton" onClick={handleDelete}>
            Delete
          </button>
        )}
      </div>
    </div>
  );
}

export default Card;