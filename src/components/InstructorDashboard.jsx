import React, { useState, useEffect } from "react";
import Menu from "./Menu";
import InstructorSlider from "./InstructorSlider";
import Footer from "./Footer.jsx";
import { useNavigate } from "react-router-dom";
import "../componentscss/instructordashboard.css";
import FeedbackDialog from "./FeedbackDialog";


function InstructorDashboard() {
  const [courses, setCourses] = useState([]); // State for storing courses
  const [summary, setSummary] = useState({
    totalCourses: 0,
    averageRating: 0,
    totalStudents: 0,
    totalEarnings: 0,
  });

  const navigate = useNavigate(); // For navigation
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);

  const handleSubmitFeedback = async (feedbackText) => {
    try {
      const token = localStorage.getItem("token");
      await axios.post("http://localhost:5000/api/website/instructor/feedback", 
        { feedback: feedbackText }, 
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Feedback submitted successfully!");
    } catch (error) {
      console.error("Failed to submit feedback:", error);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    //alert(token);
    const instructorId = localStorage.getItem("instructorId");

    if (!token ) {
      console.log("Unauthorized user - Redirecting to /login");
      alert("Unauthorized access! Please log in.");
      window.location.href = "/login";
      return;
    }

    console.log("User authenticated with ID:", instructorId);

    const fetchData = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/instructor/${instructorId}/courses`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch courses. Redirecting to login.");
        }

        const data = await response.json();
        console.log("Fetched data:", data);

        // Update the courses and summary
        setCourses(data); // Store courses
        setSummary({
          totalCourses: data.length,
          averageRating: 4.5, // Placeholder, replace with actual data if available
          totalStudents: 100, // Placeholder
          totalEarnings: 5000, // Placeholder
        });
      } catch (error) {
        console.error("Fetch error:", error);
        alert("Session expired. Please log in again.");
        localStorage.removeItem("token");
        localStorage.removeItem("instructorId");
        window.location.href = "/login";
      }
    };

    fetchData();
  }, []);

  const handleAddCourse = () => {
    navigate("/addcourse");
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
        {courses.length > 0 ? (
          <InstructorSlider courses={courses} /> // Pass courses as props
        ) : (
          <p>No courses available. Start adding some!</p>
        )}
      </div>

      {/* Add New Course Button */}
      <div className="addCourseButtonContainer">
        <button className="addCourseButton" onClick={handleAddCourse}>
          Add New Course
        </button>
      </div>

      {/* Feedback Section */}
<div className="feedbackSection">
  <h2>Share Your Feedback</h2>
  <button className="feedbackButton" onClick={() => setIsFeedbackOpen(true)}>
    Give Feedback
  </button>
</div>

{isFeedbackOpen && (
  <FeedbackDialog
    onClose={() => setIsFeedbackOpen(false)}
    onSubmit={handleSubmitFeedback}
  />
)}

      <Footer />
    </div>
    

  );
}

export default InstructorDashboard;
