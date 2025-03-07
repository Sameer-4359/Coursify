import React, { useState, useEffect } from "react";
import InstructorCard from "./InstructorCard"; // Path to your InstructorCard component
import axios from "axios";

function InstructorCourses() {
  const [courses, setCourses] = useState([]);

  // Fetch courses when the component mounts
  useEffect(() => {
    async function fetchCourses() {
      try {
        const response = await axios.get("http://localhost:5000/api/instructor/courses", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setCourses(response.data); // Update state with the fetched courses
      } catch (error) {
        console.error("Error fetching courses:", error);
        alert("Failed to load courses.");
      }
    }
    fetchCourses();
  }, []);

  // Handle deleting a course
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/instructor/courses/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      // Update state to remove the deleted course
      setCourses((prevCourses) => prevCourses.filter((course) => course.id !== id));
      alert("Course deleted successfully!");
    } catch (error) {
      console.error("Error deleting course:", error);
      alert("Failed to delete the course.");
    }
  };

  return (
    <div>
      {courses.map((course) => (
        <InstructorCard
          key={course.id}
          id={course.id}
          img={course.image_url}
          title={course.title}
          instructor={course.instructorName}
          price={course.price}
          onDelete={handleDelete} // Pass the delete handler
        />
      ))}
    </div>
  );
}

export default InstructorCourses;
