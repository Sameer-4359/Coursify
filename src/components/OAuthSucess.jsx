import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function OAuthSuccess() {
  const navigate = useNavigate();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");

    if (token) {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const { id, role, username } = payload;

      localStorage.setItem("token", token);
      localStorage.setItem("userId", id);
      localStorage.setItem("role", role);
      localStorage.setItem("username", username);

      if (role === "Student") {
        localStorage.setItem("studentId", id);
        navigate("/studentDashboard");
      } else if (role === "Instructor") {
        navigate("/instructordashboard");
      } else if (role === "Admin") {
        navigate("/adminDashboard");
      }
    } else {
      alert("Login failed or token missing");
      navigate("/login");
    }
  }, [navigate]);

  return <p>Redirecting...</p>;
}

export default OAuthSuccess;