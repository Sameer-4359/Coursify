import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar, Nav, Container, Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShoppingCart } from "@fortawesome/free-solid-svg-icons";
import CourseSearchBar from "./CourseSearchBar";
import { useLocation } from "react-router-dom";
import "../componentscss/menu.css";
import { useAuth } from "./AuthContext";

function Menu() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isLoggedIn, user, logout } = useAuth();
  const [showMenu, setShowMenu] = useState(true); // State to manage menu visibility
  const role = localStorage.getItem("role"); // Fetch role from localStorage

  let lastScrollY = 0; // Tracks the last scroll position

  const handleScroll = () => {
    if (window.scrollY > lastScrollY) {
      // If scrolling down
      setShowMenu(false);
    } else {
      // If scrolling up
      setShowMenu(true);
    }
    lastScrollY = window.scrollY;
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);



  const handleLogout = () => {
    logout();
    navigate("/");
  };
  

  // Handler for View Cart button
  const handleViewCart = () => {
    console.log("View Cart button clicked");
    navigate("/cart");
  };

  return (
    <Navbar
      expand="md"
      className={`navbarCustom ${showMenu ? "show" : "hide"}`} // Add classes based on scroll state
    >
      <Container>
        <Navbar.Brand href="#" className="navbarBrand">
          Coursify
        </Navbar.Brand>
        <Navbar.Toggle
          aria-controls="basic-navbar-nav"
          className="navbar-toggler"
        />
        <Navbar.Collapse id="basic-navbar-nav">
          <div className="searchbar">
            <CourseSearchBar />
          </div>
          <Nav className="ms-auto">
            <Nav.Link href="/home" className="nav-link">
              Home
            </Nav.Link>
            <Nav.Link href="/courses" className="nav-link">
              Courses
            </Nav.Link>
            <Nav.Link href="/aboutus" className="nav-link">
              About Us
            </Nav.Link>
            <Nav.Link href="/contact" className="nav-link">
              Contact Us
            </Nav.Link>
            {!isLoggedIn ? (
              <>
                <Button href="/login" className="authButton">
                  Login
                </Button>
                <Button href="/register" className="authButton">
                  Register
                </Button>
              </>
            ) : (
              <>
                <span className="nav-link">Hi, {user?.username}</span>
                <Button onClick={handleLogout} className="authButton">
                  Logout
                </Button>
                {role === "Student" && location.pathname.toLowerCase() === "/studentdashboard" && (
                  <Button onClick={handleViewCart} className="authButton">
                    <FontAwesomeIcon icon={faShoppingCart} /> View Cart
                  </Button>
                )}
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
export default Menu;
