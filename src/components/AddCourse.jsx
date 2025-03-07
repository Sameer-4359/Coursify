import React, { useState } from "react";
import "../componentscss/addcourse.css";
import Menu from "./Menu";
import Footer from "./Footer";

const CourseCreation = () => {
  const [courseDetails, setCourseDetails] = useState({
    title: "",
    price: "",
    description: "",
    imageUrl: "",
    modules: [{ title: "", lessons: [""] }],
  });

  // Assuming instructorId is available (e.g., from localStorage or context)
  const instructorId = "instructor123"; // Replace with actual method of getting instructor ID from authentication

  // Handle form input changes
  const handleChange = (event) => {
    const { name, value } = event.target;
    setCourseDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  // Handle changes in modules and lessons
  const handleModuleChange = (index, value) => {
    const updatedModules = [...courseDetails.modules];
    updatedModules[index].title = value;
    setCourseDetails((prevDetails) => ({
      ...prevDetails,
      modules: updatedModules,
    }));
  };

  const handleLessonChange = (moduleIndex, lessonIndex, value) => {
    const updatedModules = [...courseDetails.modules];
    updatedModules[moduleIndex].lessons[lessonIndex] = value;
    setCourseDetails((prevDetails) => ({
      ...prevDetails,
      modules: updatedModules,
    }));
  };

  const addModule = () => {
    setCourseDetails((prevDetails) => ({
      ...prevDetails,
      modules: [...prevDetails.modules, { title: "", lessons: [""] }],
    }));
  };

  const addLesson = (moduleIndex) => {
    const updatedModules = [...courseDetails.modules];
    updatedModules[moduleIndex].lessons.push("");
    setCourseDetails((prevDetails) => ({
      ...prevDetails,
      modules: updatedModules,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    // Basic validation before sending to backend
    if (!courseDetails.title || !courseDetails.price || !courseDetails.modules.length) {
      alert("Title, price, and at least one module are required.");
      return;
    }

    const courseData = {
      title: courseDetails.title,
      price: courseDetails.price,
      description: courseDetails.description,
      imageUrl: courseDetails.imageUrl,
      modules: courseDetails.modules,
    };

    // Add logic to send data to the backend
    fetch(`http://localhost:5000/api/instructor/${instructorId}/courses`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem("token")}`, // Assuming JWT token is stored in localStorage
      },
      body: JSON.stringify(courseData),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.message === "Course added successfully") {
          alert("Course successfully created!");
          setCourseDetails({
            title: "",
            price: "",
            description: "",
            imageUrl: "",
            modules: [{ title: "", lessons: [""] }],
          });
        } else {
          alert(data.message || "Failed to create course");
        }
      })
      .catch((error) => {
        alert("Error submitting course: " + error.message);
      });
  };

  return (
    <div>
     <header><Menu /></header>

    <div className="course-creation-container">
      <h2>Create a New Course</h2>
      <form onSubmit={handleSubmit} className="course-creation-form">
        <input
          type="text"
          name="title"
          placeholder="Course Title"
          value={courseDetails.title}
          onChange={handleChange}
          className="course-input"
        />
        <input
          type="text"
          name="price"
          placeholder="Course Price"
          value={courseDetails.price}
          onChange={handleChange}
          className="course-input"
        />
        <textarea
          name="description"
          placeholder="Course Description"
          value={courseDetails.description}
          onChange={handleChange}
          className="course-textarea"
        />
        <input
          type="text"
          name="imageUrl"
          placeholder="Course Image URL"
          value={courseDetails.imageUrl}
          onChange={handleChange}
          className="course-input"
        />
        <div className="modules-section">
          <h3>Modules</h3>
          {courseDetails.modules.map((module, moduleIndex) => (
            <div key={moduleIndex} className="module-block">
              <input
                type="text"
                placeholder={`Module ${moduleIndex + 1} Title`}
                value={module.title}
                onChange={(e) => handleModuleChange(moduleIndex, e.target.value)}
                className="module-input"
              />
              <h4>Lessons</h4>
              {module.lessons.map((lesson, lessonIndex) => (
                <input
                  key={lessonIndex}
                  type="text"
                  placeholder={`Lesson ${lessonIndex + 1}`}
                  value={lesson}
                  onChange={(e) =>
                    handleLessonChange(moduleIndex, lessonIndex, e.target.value)
                  }
                  className="lesson-input"
                />
              ))}
              <button
                type="button"
                onClick={() => addLesson(moduleIndex)}
                className="add-lesson-button"
              >
                Add Lesson
              </button>
            </div>
          ))}
          <button type="button" onClick={addModule} className="add-module-button">
            Add Module
          </button>
        </div>
        <button type="submit" className="submit-course-button">
          Submit Course
        </button>
      </form>
    </div>
    <footer><Footer /></footer>
      </div>

  );
};

export default CourseCreation;
