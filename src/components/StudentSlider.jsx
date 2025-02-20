import React, { useState, useEffect } from "react";
import StudentCard from "./StudentCard";
import sampleData from "../carousel"; // Replace with your data source

function StudentSlider() {
  const [currentIndex, setCurrentIndex] = useState(1); // Start at 1 (after duplicate last slide)
  const [adjustedData, setAdjustedData] = useState([]);

  useEffect(() => {
    const duplicateData = [sampleData[sampleData.length - 1], ...sampleData, sampleData[0]];
    setAdjustedData(duplicateData);
  }, []);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => prevIndex + 1);
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => prevIndex - 1);
  };

  useEffect(() => {
    if (currentIndex === adjustedData.length - 1) {
      setTimeout(() => setCurrentIndex(1), 300); // Match the CSS transition time
    } else if (currentIndex === 0) {
      setTimeout(() => setCurrentIndex(adjustedData.length - 2), 300);
    }
  }, [currentIndex, adjustedData.length]);

  return (
    <div className="studentSliderContainer">
      <button className="sliderPrevButton" onClick={prevSlide}>
        &#10094;
      </button>
      <div
        className="sliderTrack"
        style={{
          display: "flex",
          transform: `translateX(-${currentIndex * 100}%)`,
          transition: currentIndex === 0 || currentIndex === adjustedData.length - 1 ? "none" : "transform 0.5s ease",
        }}
      >
        {adjustedData.map((course, index) => (
          <StudentCard
            key={index}
            id={course.id}
            title={course.title}
            img={course.img}
            instructor={course.instructor}
          />
        ))}
      </div>
      <button className="sliderNextButton" onClick={nextSlide}>
        &#10095;
      </button>
    </div>
  );
}

export default StudentSlider;
