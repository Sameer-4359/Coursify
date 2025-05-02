import React, { useEffect, useState } from "react";
import Menu from "./Menu";
import Footer from "./Footer";
import StudentSlider from "./StudentSlider";
import Slider from "./Slider";
import axios from "axios";
import "../componentscss/student.css";
import FeedbackDialog from "./FeedbackDialog";

function StudentDashboard() {
  const [studentName, setStudentName] = useState("Student");
  const [enrolledCoursesCount, setEnrolledCoursesCount] = useState(0);
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);

  const handleSubmitFeedback = async (feedbackText) => {
    try {
      const token = localStorage.getItem("token");
      await axios.post("http://localhost:5000/api/website/student/feedback", 
        { feedback: feedbackText }, 
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Feedback submitted successfully!");
    } catch (error) {
      console.error("Failed to submit feedback:", error);
    }
  };
  
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

    <div>
      <Menu />
      <div className="studentDashboard">
        {/* Welcome Section */}
        <div className="dashboardWelcome">
          <h1 className="slide-in-left text-4xl font-bold text-gray-800">
            WELCOME !
          </h1>
          <h2 className="slide-in-left text-4xl font-bold text-gray-800"> {studentName}</h2>
          <p className="slide-in-left-delay text-2xl text-gray-600 mt-2">
            Ready to continue learning? Here's your personalized dashboard.
          </p>
        </div>

        {/* Summary Section */}
        <div className="dashboardSummary">
          <h1>Overview</h1>
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

        <div className="sliderSection">
            <StudentSlider />
          </div>
        {/* Courses Sliders */}
        {/* <div className="dashboardSliders"> */}
          
          <div className="sliderSection">
            <h1 className="headings">What to Learn Next</h1>
            <Slider role="Student" />
          </div>
        {/* </div> */}

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
      </div>
      <Footer />
    </div>
  );
}

export default StudentDashboard;
