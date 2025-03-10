// import React from "react";
// import CourseSearchBar from "./CourseSearchBar";
// import { useNavigate } from "react-router-dom"; // Import useNavigate
// import { Navbar, Nav, Container, Button } from "react-bootstrap";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faShoppingCart } from "@fortawesome/free-solid-svg-icons";

// function Menu() {
//   const navigate = useNavigate(); // Initialize navigate

//   // Handler for View Cart button
//   const handleViewCart = () => {
//     console.log("View Cart button clicked"); // Debug log
//     navigate("/cart");
//   };

//   return (
//     <Navbar expand="md" className="navbarCustom">
//       <Container>
//         <Navbar.Brand href="#" className="navbarBrand">
//           Navbar
//         </Navbar.Brand>
//         <Navbar.Toggle
//           aria-controls="basic-navbar-nav"
//           className="navbar-toggler"
//         />
//         <Navbar.Collapse id="basic-navbar-nav">
//           <Nav className="ms-auto">
//             <Nav.Link href="#home" className="nav-link">
//               Home
//             </Nav.Link>
//             <Nav.Link href="#courses" className="nav-link">
//               Courses
//             </Nav.Link>
//             <Nav.Link href="#about-us" className="nav-link">
//               About Us
//             </Nav.Link>
//             <Nav.Link href="#contact-us" className="nav-link">
//               Contact Us
//             </Nav.Link>
//             <Button href="#login" className="authButton">
//               Login
//             </Button>
//             <Button href="#register" className="authButton">
//               Register
//             </Button>
//             <Button onClick={handleViewCart} className="authButton">
//               <FontAwesomeIcon icon={faShoppingCart} /> View Cart
//             </Button>
//             <CourseSearchBar />
//           </Nav>
//         </Navbar.Collapse>
//       </Container>
//     </Navbar>
//   );
// }

// export default Menu;
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar, Nav, Container, Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShoppingCart } from "@fortawesome/free-solid-svg-icons";
import CourseSearchBar from "./CourseSearchBar";
import "../componentscss/menu.css";


function Menu() {
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(true); // State to manage menu visibility
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
            <Nav.Link href="#about-us" className="nav-link">
              About Us
            </Nav.Link>
            <Nav.Link href="/contact" className="nav-link">
              Contact Us
            </Nav.Link>
            <Button href="/login" className="authButton">
              Login
            </Button>
            <Button href="/register" className="authButton">
              Register
            </Button>
            <Button onClick={handleViewCart} className="authButton">
              <FontAwesomeIcon icon={faShoppingCart} /> View Cart
            </Button>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}


export default Menu;





