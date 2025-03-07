import React, { useState } from "react";
import AsyncSelect from "react-select/async";
import { useNavigate } from "react-router-dom";
import "../componentscss/coursesearchbar.css";

function CourseSearchBar() {
  const [selectedCourse, setSelectedCourse] = useState(null);
  const navigate = useNavigate(); // Hook for navigation

  // Function to fetch matching courses from the server
  const fetchCourses = async (inputValue) => {
    if (!inputValue) return []; // Avoid unnecessary API calls
    try {
      const response = await fetch(`http://localhost:5000/api/courses/search?query=${inputValue}`);
      const courses = await response.json();

      // Map the data into a format suitable for react-select
      return courses.map((course) => ({
        label: course.name, // The text shown in the dropdown
        value: course.id,   // The unique value for each option
      }));
    } catch (error) {
      console.error("Error fetching courses:", error);
      return [];
    }
  };

  // Handle when a course is selected
  const handleCourseChange = (selectedOption) => {
    setSelectedCourse(selectedOption);
    console.log("Selected course:", selectedOption);

    if (selectedOption) {
      // Navigate to CourseDetails page with courseId
      navigate(`/course-details/${selectedOption.value}`);
    }
  };

  return (
    <div className="course-search-bar">
      <AsyncSelect
        loadOptions={fetchCourses} // Async fetch for dropdown suggestions
        onChange={handleCourseChange} // Handle selection
        placeholder="Type to search..."
        isClearable // Adds a clear button to the dropdown
      />
    </div>
  );
}

export default CourseSearchBar;
