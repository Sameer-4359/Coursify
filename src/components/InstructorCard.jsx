import React from "react";
import { useNavigate } from "react-router-dom";

function InstructorCard({ id, img, title, instructor, price, onDelete }) {
  const navigate = useNavigate();

  const handleUpdate = () => {
    navigate(`/update-course/${id}`);
  };

  const handleSeeMore = () => {
    navigate(`/course-details/${id}`);
  };

  return (
    <div className="instructorCard">
      <div className="cardImg">
        <img src={img} alt={title} />
      </div>
      <div className="cardContent">
        <h2>{title}</h2>
        <p>Instructor: {instructor}</p>
        <p>Price: ${price}</p>
        <div className="cardActions">
          <button onClick={handleSeeMore}>See More</button>
          <button onClick={handleUpdate}>Update</button>
          <button onClick={() => onDelete(id)}>Delete</button>
        </div>
      </div>
    </div>
  );
}

export default InstructorCard;
