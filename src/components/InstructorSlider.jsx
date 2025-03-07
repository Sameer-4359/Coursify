import React from "react";
import InstructorCard from "./InstructorCard";


import "../componentscss/instructorslider.css"

const InstructorSlider = ({ courses, onDelete }) => {
  return (
    <div className="slider">
      {courses.length > 0 ? (
        courses.map((course) => (
          <div className="slide" key={course.id}>
            <InstructorCard
              id={course.id}
              img={course.image_url}
              title={course.title}
              instructor={course.instructor || "Unknown"}
              price={course.price}
              onDelete={onDelete}
            />
          </div>
        ))
      ) : (
        <p>No courses available.</p>
      )}
    </div>
  );
};

export default InstructorSlider;
