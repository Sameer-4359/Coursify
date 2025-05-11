import React, { useEffect, useState } from "react";
import axios from "axios";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { FaBars, FaChartBar, FaBook, FaUsers, FaCogs, FaTachometerAlt, FaSignOutAlt } from "react-icons/fa";
import Slider from "./Slider";
import "../componentscss/adminDashboard.css";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function AdminDashboard() {
  const [totalCourses, setTotalCourses] = useState(0);
  const [totalStudents, setTotalStudents] = useState(0);
  const [adminName, setAdminName] = useState("Admin");
  const [role, setRole] = useState("");
  const [activePage, setActivePage] = useState("Dashboard");
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (token) {
          const decoded = JSON.parse(atob(token.split(".")[1]));
          setRole(decoded.role || "");
        }

        const [coursesRes, studentsRes, adminRes] = await Promise.all([
          axios.get("http://localhost:5000/api/admin/total-courses", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("http://localhost:5000/api/admin/total-students", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("http://localhost:5000/api/admin/details", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        setTotalCourses(coursesRes.data.totalCourses);
        setTotalStudents(studentsRes.data.totalStudents);
        setAdminName(adminRes.data.adminName || "Admin");
      } catch (error) {
        console.error("Dashboard fetch error:", error);
      }
    };

    fetchData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login"; // Redirect to login
  };

  if (!role) return <p className="loading">Loading...</p>;

  const barData = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    datasets: [
      {
        label: "New Signups",
        data: [12, 19, 3, 5, 2, 10],
        backgroundColor: "#007bff",
      },
    ],
  };

  const renderPage = () => {
    switch (activePage) {
      case "Dashboard":
        return (
          <>
            <section className="admincards">
              <div className="admincard blue">
                <h3>Courses</h3>
                <p>{totalCourses}</p>
              </div>
              <div className="admincard green">
                <h3>Students</h3>
                <p>{totalStudents}</p>
              </div>
              <div className="admincard orange">
                <h3>Admin</h3>
                <p>{adminName}</p>
              </div>
            </section>

            <section className="charts">
              <div className="chart-box">
                <h3>Weekly Signups</h3>
                <Bar data={barData} />
              </div>
            </section>
          </>
        );
      case "Charts":
        return <div className="content-box">📊 Charts View (Coming Soon)</div>;
      case "Courses":
        return <div className="content-box"><h2>Manage Courses</h2>
           <Slider role={role} /></div>;
      case "Students":
        return <div className="content-box">👨‍🎓 Manage Students (Placeholder)</div>;
      case "Settings":
        return <div className="content-box">⚙️ Admin Settings (Placeholder)</div>;
      default:
        return <div className="content-box">🔧 Under Construction</div>;
    }
  };


  return (
    <div className={`dashboard-container ${isSidebarCollapsed ? "collapsed" : ""}`}>
      {/* Sidebar */}
      <aside className={`sidebar ${isSidebarCollapsed ? "collapsed" : ""}`}>
        <div className="sidebarHeader">
          <h2 className="logo">{!isSidebarCollapsed && "Admin"}</h2>
          <button
            className="toggleBtn"
            onClick={() => setIsSidebarCollapsed((prev) => !prev)}
          >
            <FaBars />
          </button>
        </div>
        <nav>
          <ul>
            {[
              { name: "Dashboard", icon: <FaTachometerAlt /> },
              { name: "Charts", icon: <FaChartBar /> },
              { name: "Courses", icon: <FaBook /> },
              { name: "Students", icon: <FaUsers /> },
              { name: "Settings", icon: <FaCogs /> },
            ].map(({ name, icon }) => (
              <li
                key={name}
                className={activePage === name ? "active" : ""}
                onClick={() => setActivePage(name)}
              >
                <span style={{ marginRight: "10px" }}>{icon}</span>
                {!isSidebarCollapsed && name}
              </li>
            ))}

          </ul>
        </nav>
        <button className="logout-btn" onClick={handleLogout}>
           <FaSignOutAlt />
           {!isSidebarCollapsed && <span>Logout</span>}
         </button>
      </aside>

      {/* Main */}
      <main className="dashboard-main">
        {renderPage()}
      </main>
    </div>

  );
}

export default AdminDashboard;
