import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./components/AuthContext";
import sampleCourse from "./sampleCourse.js";
import Home from "./components/Home";
import Login from "./components/Login";
import Register from "./components/Reg";
import ContactPage from "./components/Contact";
import CheckoutPage from "./components/checkoutpage/checkout.jsx";
import CourseDetails from "./components/CourseDetails.jsx";
import AddCourse from "./components/AddCourse.jsx";
import InstructorDashboard from "./components/InstructorDashboard.jsx";
import StudentDashboard from "./components/StudentDashboard.jsx";
import Cart from "./components/Cart.jsx";
import UpdateCourse from "./components/UpdateCourse.jsx"
import Certificate from './components/Certificate.jsx';
import AboutUs from './components/AboutUs.jsx'
import OAuthSuccess from './components/OAuthSucess.jsx'
import CoursesPage from './components/CoursesPage.jsx'
import AdminDashboard from './components/AdminDashboard.jsx'

function App() {
  return (
    <AuthProvider>
    <Router>
      <div className="App">
        {/* Render these components only on non-auth routes */}
        <Routes>
          {/* Default route redirects to Login */}
          <Route path="/" element={<Navigate to="/home" replace />} />


          {/* Auth-related routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/home" element={<Home />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/course-details/:courseId" element={<CourseDetails />} />
          <Route path="/addcourse" element={<AddCourse />} />
          <Route path="/instructordashboard" element={<InstructorDashboard />}/>
          <Route path="/studentdashboard" element={<StudentDashboard />}/>
          <Route path="/cart" element={<Cart />}/>
          <Route path="/update-course/:courseId" element={<UpdateCourse />} />
          <Route path="/certificate" element={<Certificate />} />
          <Route path="/aboutus" element={<AboutUs />} />
          <Route path="/oauth-success" element={<OAuthSuccess />} />
          <Route path="/courses" element={<CoursesPage />} />
          <Route path="/admindashboard" element={<AdminDashboard />} />
        </Routes>
      </div>
    </Router>
    </AuthProvider>
  );
}


export default App;
