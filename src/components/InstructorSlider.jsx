import React, { useState, useEffect } from "react";
import InstructorCard from "./InstructorCard"; // Adjust import based on actual file path
import sampleData from "../carousel"; // Importing the sample data

function InstructorSlider() {
  const [currentIndex, setCurrentIndex] = useState(1); // Start at 1 (after the duplicate last slide)
  const [adjustedData, setAdjustedData] = useState([]);

  // Prepare the sample data with duplicates for infinite scrolling
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

  // Reset position when reaching the duplicates
  useEffect(() => {
    if (currentIndex === adjustedData.length - 1) {
      setTimeout(() => {
        setCurrentIndex(1); // Go to the first actual slide
      }, 300); // Match the CSS transition time
    } else if (currentIndex === 0) {
      setTimeout(() => {
        setCurrentIndex(adjustedData.length - 2); // Go to the last actual slide
      }, 300);
    }
  }, [currentIndex, adjustedData.length]);

  return (
    <div className="instructorSliderContainer">
      <button className="sliderPrevButton" onClick={prevSlide}>
        &#10094;
      </button>

      <div
        className="sliderTrack"
        style={{
          display: "flex",
          transform: `translateX(-${currentIndex * 100}%)`,
          transition:
            currentIndex === 0 || currentIndex === adjustedData.length - 1
              ? "none"
              : "transform 0.5s ease",
        }}
      >
        {adjustedData.map((course, index) => (
          <InstructorCard
            key={index}
            title={course.title}
            img={course.img}
            instructor={course.instructor}
            price={course.price}
          />
        ))}
      </div>

      <button className="sliderNextButton" onClick={nextSlide}>
        &#10095;
      </button>
    </div>
  );
}

export default InstructorSlider;
