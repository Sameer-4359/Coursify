import React, { useState } from "react";
import { Link } from "react-router-dom";


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
    <div className="loginContainer">
      <h2>Create a Coursify Account</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={registerDetails.username}
          onChange={handleChange}
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={registerDetails.email}
          onChange={handleChange}
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={registerDetails.password}
          onChange={handleChange}
        />
        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirm Password"
          value={registerDetails.confirmPassword}
          onChange={handleChange}
        />

        {/* Dropdown for Role */}
        <select
          name="role"
          value={registerDetails.role}
          onChange={handleChange}
        >
          <option value="Student">Student</option>
          <option value="Instructor">Instructor</option>
          <option value="Admin">Admin</option>
        </select>

        <button type="submit">Register</button>
        <p>
          Already have an account?{" "}
          <span>
            <Link to="/login">Login</Link>
          </span>
        </p>
      </form>
    </div>
  );
}

export default Register;