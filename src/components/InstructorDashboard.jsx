import React, { useState, useEffect } from "react";
import Menu from "./Menu";
import InstructorSlider from "./InstructorSlider";
import Footer from "./Footer.jsx"
import { useNavigate } from "react-router-dom";

function InstructorDashboard({ instructorId }) {
  const [courses, setCourses] = useState([]);
  const [summary, setSummary] = useState({
    totalCourses: 0,
    averageRating: 0,
    totalStudents: 0,
    totalEarnings: 0,
  });

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const coursesResponse = await fetch(`/api/instructor/${instructorId}/courses`);
        const coursesData = await coursesResponse.json();
        setCourses(coursesData);

        const summaryResponse = await fetch(`/api/instructor/${instructorId}/summary`);
        const summaryData = await summaryResponse.json();
        setSummary(summaryData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [instructorId]);

  const handleAddCourse = () => {
    navigate("/add-course");
  };

  return (
    <div className="instructorDashboard">
      <Menu />

      {/* Summary Section */}
      <div className="dashboardSummary">
        <h1>Welcome, Instructor!</h1>
      
        <div className="summaryCards">
          <div className="summaryCard">
            <h2>Total Courses</h2>
            <p>{summary.totalCourses}</p>
          </div>
          <div className="summaryCard">
            <h2>Average Rating</h2>
            <p>{summary.averageRating.toFixed(1)} / 5</p>
          </div>
          <div className="summaryCard">
            <h2>Total Students</h2>
            <p>{summary.totalStudents}</p>
          </div>
          <div className="summaryCard">
            <h2>Total Earnings</h2>
            <p>${summary.totalEarnings.toFixed(2)}</p>
          </div>
        </div>
      </div>

      {/* Instructor Slider */}
      <div className="coursesSlider">
        <h2>Your Courses</h2>
        <InstructorSlider courses={courses} />
      </div>

      {/* Add New Course Button */}
      <div className="addCourseButtonContainer">
        <button className="addCourseButton" onClick={handleAddCourse}>
          Add New Course
        </button>
      </div>
      <Footer />
    </div>
  );
}

export default InstructorDashboard;
