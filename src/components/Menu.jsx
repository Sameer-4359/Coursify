import React from "react";
import { Navbar, Nav, Container, Button } from "react-bootstrap";

function Menu() {
  return (
    <Navbar expand="md" className="navbarCustom">
      <Container>
        <Navbar.Brand href="#" className="navbarBrand">
          Navbar
        </Navbar.Brand>
        <Navbar.Toggle
          aria-controls="basic-navbar-nav"
          className="navbar-toggler"
        />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            <Nav.Link href="#home" className="nav-link">
              Home
            </Nav.Link>
            <Nav.Link href="#courses" className="nav-link">
              Courses
            </Nav.Link>
            <Nav.Link href="#about-us" className="nav-link">
              About Us
            </Nav.Link>
            <Nav.Link href="#contact-us" className="nav-link">
              Contact Us
            </Nav.Link>
            <Button href="#login" className="authButton">
              Login
            </Button>
            <Button href="#register" className="authButton">
              Register
            </Button>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Menu;
