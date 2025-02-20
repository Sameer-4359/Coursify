import React from "react";
import Menu from "./Menu";
import Footer from "./Footer";
import StudentSlider from "./StudentSlider";
import Slider from "./Slider"

function StudentDashboard() {
  return (
    <div className="studentDashboard">
      {/* Menu */}
      <Menu />

      {/* Welcome Section */}
      <div className="dashboardWelcome">
        <h1>Welcome, [Student Name]!</h1>
        <p>Ready to continue learning? Here's your personalized dashboard.</p>
      </div>

      {/* Summary Section */}
      <div className="dashboardSummary">
        <div className="summaryCards">
          <div className="summaryCard">
            <h2>Total Enrolled Courses</h2>
            <p>8</p>
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
          <Slider />
        </div>
      </div>

      {/* Feedback Section */}
      <div className="feedbackSection">
        <h2>Share Your Feedback</h2>
        <button className="feedbackButton">Give Feedback</button>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default StudentDashboard;
