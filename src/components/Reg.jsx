import React, { useState } from "react";
import { Link } from "react-router-dom";
import Menu from "./Menu";
import Footer from "./Footer";

import "../componentscss/register.css"

function Register() {
  const [registerDetails, setRegisterDetails] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "Student", // Default role
  });

  function handleChange(event) {
    const { name, value } = event.target;
    setRegisterDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    if (registerDetails.password !== registerDetails.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    // Send registration details to the backend
    fetch("http://localhost:5000/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: registerDetails.username,
        email: registerDetails.email,
        password: registerDetails.password,
        role: registerDetails.role, // Include role in the request
      }),
    })
      .then((response) => {
        if (response.ok) {
          alert("Registration successful!");
          window.location.href = "/login"; // Navigate to login page
        } else {
          response.json().then((data) => alert(data.message || "Registration failed"));
        }
      });
  }

  return (
    <div>
      <header><Menu /></header>
      <div className="login-container">
        <div className="image-container">
          <img
            src="https://frontends.udemycdn.com/components/auth/desktop-illustration-step-2-x2.webp"
            alt="Learning Illustration"
            className="desktop-image"
          />
          <img
            src="https://frontends.udemycdn.com/components/auth/mobile-illustration-x2.webp"
            alt="Learning Mobile Illustration"
            className="mobile-image"
          />
        </div>

        <div className="form-container">
          <h2>Sign up and take the first step toward success!</h2>
          <form className="login-form" onSubmit={handleSubmit}>
            <input
              className="input-field"
              type="text"
              name="username"
              placeholder="Username"
              value={registerDetails.username}
              onChange={handleChange}
            />
            <input
            className="input-field"
              type="email"
              name="email"
              placeholder="Email"
              value={registerDetails.email}
              onChange={handleChange}
            />
            <input
            className="input-field"
              type="password"
              name="password"
              placeholder="Password"
              value={registerDetails.password}
              onChange={handleChange}
            />
            <input
            className="input-field"
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={registerDetails.confirmPassword}
              onChange={handleChange}
            />

            {/* Dropdown for Role */}
            <select
            className="input-field"
              name="role"
              value={registerDetails.role}
              onChange={handleChange}
            >
              <option value="Student">Student</option>
              <option value="Instructor">Instructor</option>
              {/* <option value="Admin">Admin</option> */}
            </select>

            <button className="login-button" type="submit">Register</button>
            <div className="register-link">
            <p>
              Already have an account?{" "}
              <span>
                <Link to="/login">Login</Link>
              </span>
            </p>
            </div>
          </form>
        </div>
      </div>
      <footer><Footer /></footer> 
    </div>
  );
}

export default Register;