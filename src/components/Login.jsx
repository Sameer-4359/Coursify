/*import React, { useState } from "react";
import { Link } from "react-router-dom";

function Login() {
  const [loginDetails, setLoginDetails] = useState({ email: "", password: "" });

  function handleChange(event) {
    const { name, value } = event.target;
    setLoginDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  }

  //function handleSubmit(event) {
    //event.preventDefault();
    //console.log("Login details:", loginDetails);
    // Add login logic here, like API call to authenticate
  //}

  function handleSubmit(event) {
    event.preventDefault();
  
    // Send login details to the backend
    fetch("http://localhost:5000/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: loginDetails.email,
        password: loginDetails.password,
      }),
    })
      .then((response) => {
        if (!response.ok) {
          return response.json().then((data) => {
            throw new Error(data.message || "Login failed!");
          });
        }
        return response.json(); // Parse JSON if the response is ok
      })
      .then((data) => {
        if (data.token) {
          localStorage.setItem("token", data.token); // Save the JWT token
          alert("Login successful!");
          window.location.href = "/menu"; // Navigate to home
        } else {
          alert("Login failed! No token received.");
        }
      })
      .catch((error) => {
        console.error("Error during login:", error);
        alert(error.message);
      });
  }
  
  

  return (
    <div className="loginContainer">
      <h2>Log in to your Coursify Account</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={loginDetails.email}
          onChange={handleChange}
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={loginDetails.password}
          onChange={handleChange}
        />
        <p>
          or <span>Forgot password</span>
        </p>
        <button type="submit">Login</button>
        <p>
          Don't have an account?{" "}
          <span>
            <Link to="/register">Sign up</Link>
          </span>
        </p>
      </form>
    </div>
  );
}

export default Login;*/
import React, { useState } from "react";
import { Link } from "react-router-dom";

function Login() {
  const [loginDetails, setLoginDetails] = useState({ email: "", password: "" });

  function handleChange(event) {
    const { name, value } = event.target;
    setLoginDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  }

  function handleSubmit(event) {
    event.preventDefault();

    localStorage.removeItem('token'); // Clear the stored token
    console.log("Sending Login Details:", loginDetails);
    // Send login details to the backend
    fetch("http://localhost:5000/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      body: JSON.stringify({
        email: loginDetails.email,
        password: loginDetails.password,
      }),
    })
      .then((response) => {
        if (!response.ok) {
          // Handle HTTP errors (like 400 or 500)
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        if (data.token) {
          localStorage.setItem("token", data.token); // Store the token
          alert("Login successful!");
          window.location.href = "/menu"; // Redirect to menu
        } else {
          alert(data.message || "Login failed!");
        }
      })
      .catch((error) => {
        console.error("Error during login:", error);
        alert("An error occurred while logging in.");
      });
  }
  
  
  return (
    <div className="loginContainer">
      <h2>Log in to your Coursify Account</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={loginDetails.email}
          onChange={handleChange}
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={loginDetails.password}
          onChange={handleChange}
        />
        <p>
          or <span>Forgot password</span>
        </p>
        <button type="submit">Login</button>
        <p>
          Don't have an account?{" "}
          <span>
            <Link to="/register">Sign up</Link>
          </span>
        </p>
      </form>
    </div>
  );
}

export default Login;
