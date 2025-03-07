import React, { useEffect, useState } from "react";
import axios from "axios";
import Menu from "./Menu";
import Footer from "./Footer";
import Slider from "./Slider";

function AdminDashboard() {
  const [totalCourses, setTotalCourses] = useState(0);
  const [totalStudents, setTotalStudents] = useState(0);
  const [adminName, setAdminName] = useState("Admin");
  const [role, setRole] = useState(""); // Ensure role is initialized

  useEffect(() => {
    const fetchSummaryData = async () => {
      try {
        const token = localStorage.getItem("token");

        if (token) {
          // Decode JWT to extract the role
          const decoded = JSON.parse(atob(token.split(".")[1])); // Decode the token
          setRole(decoded.role || ""); // Example: "admin" or "student"
        } else {
          console.error("No token found. Defaulting role to empty.");
        }

        // Fetch total courses
        const coursesResponse = await axios.get("http://localhost:5000/api/admin/total-courses", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTotalCourses(coursesResponse.data.totalCourses);

        // Fetch total students
        const studentsResponse = await axios.get("http://localhost:5000/api/admin/total-students", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTotalStudents(studentsResponse.data.totalStudents);

        // Fetch admin name
        const adminResponse = await axios.get("http://localhost:5000/api/admin/details", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAdminName(adminResponse.data.adminName || "Admin");
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    };

    fetchSummaryData();
  }, []);

  if (!role) {
    return <p>Loading...</p>; // Handle the case where role is not yet determined
  }

  return (
    <div className="adminDashboard">
      <Menu />

      {/* Summary Section */}
      <div className="dashboardSummary">
        <h1>Welcome, {adminName}!</h1>
        <div className="summaryCards">
          <div className="summaryCard">
            <h2>Total Courses</h2>
            <p>{totalCourses}</p>
          </div>
          <div className="summaryCard">
            <h2>Total Students</h2>
            <p>{totalStudents}</p>
          </div>
          <div className="summaryCard">
            <h2>Admin Name</h2>
            <p>{adminName}</p>
          </div>
        </div>
      </div>

      {/* Slider Section */}
      <div className="dashboardSliders">
        <div className="sliderSection">
          <h2>Manage Courses</h2>
          <Slider role={role} />
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default AdminDashboard;


