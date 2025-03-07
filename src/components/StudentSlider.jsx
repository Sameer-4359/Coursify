import React, { useState, useEffect } from "react";
import StudentCard from "./StudentCard";
import axios from "axios";


import "../componentscss/slider.css";

function StudentSlider() {
  const [currentIndex, setCurrentIndex] = useState(0); // Start with the first course
  const [enrolledCourses, setEnrolledCourses] = useState([]); // Store enrolled courses

  useEffect(() => {
    // Fetch enrolled courses for the logged-in student
    const fetchEnrolledCourses = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.error("No authentication token found!");
          return;
        }

        const response = await axios.get("http://localhost:5000/api/checkout/enrolled-courses", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setEnrolledCourses(response.data);
      } catch (error) {
        console.error("Error fetching enrolled courses:", error);
      }
    };

    fetchEnrolledCourses();
  }, []);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % enrolledCourses.length);
  };

  const prevSlide = () => {
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + enrolledCourses.length) % enrolledCourses.length
    );
  };

  if (enrolledCourses.length === 0) {
    return <p>No enrolled courses to display.</p>;
  }

  return (
    <div className="studentSliderContainer">
      <button className="sliderPrevButton" onClick={prevSlide}>
        &#10094;
      </button>

      <div
        className="sliderTrack"
        style={{ transform: `translateX(-${currentIndex * 100}%)`, display: "flex", transition: "transform 0.5s ease" }}
      >
        {enrolledCourses.map((course) => (
          <StudentCard
            key={course.id}
            id={course.id}
            title={course.title}
            img={course.image_url} // Update field name if different in API response
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
