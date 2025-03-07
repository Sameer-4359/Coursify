import React from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../componentscss/instructorcard.css";

function InstructorCard({ id, img, title, instructor, price }) {
  const navigate = useNavigate();

  // Navigate to UpdateCourse page
  const handleUpdate = () => {
    navigate(`/update-course/${id}`);
  };

  // Navigate to CourseDetails page
  const handleSeeMore = () => {
    navigate(`/course-details/${id}`);
  };

  // Delete the course
  const handleDelete = async () => {
    try {
      if (window.confirm("Are you sure you want to delete this course?")) {
        await axios.delete(
          `http://localhost:5000/api/instructor/courses/${id}`,
          {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
          }
        );
        alert("Course deleted successfully!");
        window.location.reload(); // Reload page after deletion
      }
    } catch (err) {
      console.error("Error deleting course:", err);
      alert("Failed to delete the course.");
    }
  };

  return (
    <div className="instructorCard">
      <div className="cardImg">
        <img src={img} alt={title} />
      </div>
      <div className="cardContent">
        <h2>{title}</h2>
        <p>Instructor: {instructor || "Unknown"}</p>
        <p>Price: ${price}</p>
        <div className="cardActions">
          <button onClick={handleSeeMore}>See More</button>
          <button onClick={handleUpdate}>Update</button>
          <button onClick={handleDelete}>Delete</button>
        </div>
      </div>
    </div>
  );
}

export default InstructorCard;
