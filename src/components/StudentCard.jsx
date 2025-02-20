import React from "react";
import { useNavigate } from "react-router-dom";

function StudentCard({ id, img, title, instructor }) {
  const navigate = useNavigate();

  const handleSeeMore = () => {
    navigate(`/course-details/${id}`);
  };

  const handleUnenroll = () => {
    // Add logic to unenroll from the course
    console.log(`Unenrolled from course ID: ${id}`);
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
