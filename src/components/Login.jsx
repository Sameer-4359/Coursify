import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom"; // Import useNavigate
import Menu from "./Menu";
import Footer from "./Footer";
import "../componentscss/login.css"

function Login() {
  const [loginDetails, setLoginDetails] = useState({ email: "", password: "" });
  const [error, setError] = useState(""); // State to manage error messages
  const navigate = useNavigate(); // Initialize navigate

  function handleChange(event) {
    const { name, value } = event.target;
    setLoginDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  }

  const handleSubmit = (event) => {
    event.preventDefault(); // Prevent default form submission behavior

    const { email, password } = loginDetails;

    // Basic validation to ensure email and password are not empty
    if (!email || !password) {
      alert("Please enter both email and password.");
      return;
    }

    // Send login request to the backend
    fetch("http://localhost:5000/api/auth/login", { // Corrected URL
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }), // Sending email and password
    })
    
      .then((response) => {
        if (!response.ok) {
          throw new Error("Login failed with status: " + response.status);
        }
        return response.json(); // Try parsing the JSON
      })
      .then((data) => {
        if (data.token) {
          // If login is successful, store the JWT token and role
          localStorage.setItem("token", data.token);
          localStorage.setItem("userId", data.user.id); // Store the user ID
          localStorage.setItem("role", data.user.role); // Store the role (instructor or student)
          localStorage.setItem("username", data.user.username);
          alert("Logged in as: " + data.user.role);

          if (data.user.role === "Student") {
            localStorage.setItem("studentId", data.user.id); // Assuming the user ID is the student ID
          }
          // Navigate to the appropriate dashboard based on the user's role
          if (data.user.role === 'Instructor') {
            navigate("/instructordashboard");
          } else if (data.user.role === 'Student') {
            navigate("/studentDashboard");
          }
          else if(data.user.role === 'Admin'){
            navigate("/adminDashboard");
          }
        } else {
          alert(data.message || "Login failed. Please try again.");
        }
      })
      .catch((error) => {
        console.error("Error logging in:", error);

        // Check if the error is due to too many failed attempts
        if (error.message.includes("403")) {
          setError("Too many failed attempts. Please try again after a short period.");
        } else {
          setError("Error logging in. Please check your credentials.");
        }

        // Alert the user in case of error
        alert(error.message);
      });
  };

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
          <h2>Log in to continue your learning journey</h2>
          <form className="login-form" onSubmit={handleSubmit}>
            <input className="input-field"
              type="email"
              name="email"
              placeholder="Email"
              value={loginDetails.email}
              onChange={handleChange}
            />
            <input className="input-field"
              type="password"
              name="password"
              placeholder="Password"
              value={loginDetails.password}
              onChange={handleChange}
            />
            {error && <div className="error">{error}</div>} {/* Show error message if there's an issue */}

            <button className="login-button" type="submit">Login</button>

            <div className="divider">
            <hr /><span>Other log in options</span><hr />
          </div>

          {/* Social Login Buttons */}
          <div className="social-buttons">
            <button className="social-btn">
              <img src="https://img.icons8.com/color/48/000000/google-logo.png" alt="Google" />
            </button>
            <button className="social-btn">
              <img src="https://img.icons8.com/ios-filled/50/1877F2/facebook-new.png" alt="Facebook" />
            </button>
            <button className="social-btn">
              <img src="https://img.icons8.com/ios-filled/50/000000/mac-os.png" alt="Apple" />
            </button>
          </div>
          <p>
              or <span>Forgot password</span>
            </p>

            <div className="register-link">
              <p>
                Don't have an account?{" "}
                <span>
                  <Link to="/register">Sign up</Link>
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

export default Login;