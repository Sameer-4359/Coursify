/*import React from "react";
import Login from "./components/Login";
import Register from "./components/Reg"; 
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import ContactPage from "./components/Contact";
import Menu from "./components/Menu.jsx";
import Footer from "./components/Footer.jsx";
import Slider from "./components/Slider.jsx";
import Community from "./components/Community.jsx";
import Experience from "./components/Experience.jsx";
import ChooseUs from "./components/ChooseUs.jsx";
import CheckoutPage from "./components/checkoutpage/checkout.jsx";
import sampleCourse from "./sampleCourse.js";
import courseDetail from "./components/CourseDetails.jsx";

function App() {
  return (
    
    // <Router>
    //   <div className="App">
    //     <Routes>
    //       <Route path="/" element={<Navigate to="/login" replace />} />
    //       <Route path="/login" element={<Login />} />
    //       <Route path="/register" element={<Register />} />
    //     </Routes>
    //   </div>
    // </Router>
    <div className="App">
    <Menu />
    <Slider />
    <Experience />
    <ChooseUs />
    <Community />
    <Footer />
    <CheckoutPage />
    <ContactPage />
    </div>
  );
}

export default App;*/

import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import sampleCourse from "./sampleCourse.js"
import Login from "./components/Login";
import Register from "./components/Reg";
import ContactPage from "./components/Contact";
import Menu from "./components/Menu.jsx";
import Footer from "./components/Footer.jsx";
import Slider from "./components/Slider.jsx";
import Community from "./components/Community.jsx";
import Experience from "./components/Experience.jsx";
import ChooseUs from "./components/ChooseUs.jsx";
import CheckoutPage from "./components/checkoutpage/checkout.jsx";
import CourseDetails from "./components/CourseDetails.jsx";
import AddCourse from "./components/AddCourse.jsx"
import InstructorDashboard from "./components/InstructorDashboard.jsx"
import StudentDashboard from "./components/StudentDashboard.jsx";
import Cart from "./components/Cart.jsx";

function App() {
  return (
    <Router>
      <div className="App">
        {/* Render these components only on non-auth routes */}
        <Routes>
          {/* Default route redirects to Login */}
          <Route path="/" element={<Navigate to="/login" replace />} />

          {/* Auth-related routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Main app routes */}
          <Route
            path="/home"
            element={
              <>
                <Menu />
                <Slider />
                <Experience />
                <ChooseUs />
                <Community />
                <Footer />
              </>
            }
          />

          {/* Additional routes */}
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/CourseDetails" element={<CourseDetails course={sampleCourse} />} />
          <Route path="/addcourse" element={<AddCourse />} />
          <Route path="/instructordashboard" element={<InstructorDashboard />}/>
          <Route path="/studentdashboard" element={<StudentDashboard />}/>
          <Route path="/cart" element={<Cart />}/>
        </Routes>
      </div>
    </Router>
  );
}

export default App;

