import React, { useEffect, useState } from "react";
import Menu from "./Menu";
import Footer from "./Footer";
import StudentSlider from "./StudentSlider";
import Slider from "./Slider";
import axios from "axios";
import "../componentscss/student.css";

function StudentDashboard() {
  const [studentName, setStudentName] = useState("Student");
  const [enrolledCoursesCount, setEnrolledCoursesCount] = useState(0);

  useEffect(() => {
    // Retrieve the username from localStorage
    const storedUsername = localStorage.getItem("username");
    if (storedUsername) {
      setStudentName(storedUsername);
    } else {
      console.warn("Username not found in localStorage.");
    }

    // Fetch the count of enrolled courses
    const fetchEnrolledCoursesCount = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.warn("No token found in localStorage.");
          return;
        }
    
        const response = await axios.get("http://localhost:5000/api/checkout/count", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
    
        console.log("Enrolled courses count response:", response.data); // Debug log
        setEnrolledCoursesCount(response.data.count); // Assuming API returns { count: <number> }
      } catch (err) {
        console.error("Failed to fetch enrolled courses count:", err);
      }
    };
    

    fetchEnrolledCoursesCount();
  }, []);

  return (

    
    <div className="studentDashboard">
      {/* Menu */}
      <Menu />

      {/* Welcome Section */}
      <div className="dashboardWelcome">
        <h1>Welcome, {studentName}!</h1>
        <p>Ready to continue learning? Here's your personalized dashboard.</p>
      </div>

      {/* Summary Section */}
      <div className="dashboardSummary">
        <div className="summaryCards">
          <div className="summaryCard">
            <h2>Total Enrolled Courses</h2>
            <p>{enrolledCoursesCount}</p>
          </div>
          <div className="summaryCard">
            <h2>Completed Courses</h2>
            <p>5</p>
          </div>
          <div className="summaryCard">
            <h2>Upcoming Deadlines</h2>
            <p>2 Assignments</p>
          </div>
          <div className="summaryCard">
            <h2>Total Hours Spent</h2>
            <p>25 Hours</p>
          </div>
        </div>
      </div>

      {/* Courses Sliders */}
      <div className="dashboardSliders">
        <div className="sliderSection">
          <h2>Your Enrolled Courses</h2>
          <StudentSlider />
        </div>
        <div className="sliderSection">
          <h2>Explore More Courses</h2>
          <Slider role="Student" />
        </div>
      </div>

      {/* Feedback Section */}
      <div className="feedbackSection">
        <h2>Share Your Feedback</h2>
        <button className="feedbackButton">Give Feedback</button>
      </div>

      {/* Footer */}
     // <Footer />
    </div>
  );
}

export default StudentDashboard;
