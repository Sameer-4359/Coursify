import React, { useState } from "react";
import "../componentscss/addcourse.css";
import Menu from "./Menu";
import Footer from "./Footer";
import axios from "axios";

const CourseCreation = () => {
  const [courseDetails, setCourseDetails] = useState({
    title: "",
    price: "",
    description: "",
    imageUrl: "",
    modules: [{ title: "", lessons: [{ title: "", video: null ,assignment: null }] }],
  });

  const instructorId = "instructor123"; // Replace with actual method of getting instructor ID from authentication

  const handleChange = (event) => {
    const { name, value } = event.target;
    setCourseDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

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
    updatedModules[moduleIndex].lessons[lessonIndex].title = value;
    setCourseDetails((prevDetails) => ({
      ...prevDetails,
      modules: updatedModules,
    }));
  };

  const handleVideoUpload = (moduleIndex, lessonIndex, file) => {
    const updatedModules = [...courseDetails.modules];
    updatedModules[moduleIndex].lessons[lessonIndex].video = file;
    setCourseDetails((prevDetails) => ({
      ...prevDetails,
      modules: updatedModules,
    }));
  };

  const handleAssignmentUpload = (moduleIndex, lessonIndex, file) => {
    const updatedModules = [...courseDetails.modules];
    updatedModules[moduleIndex].lessons[lessonIndex].assignment = file;
    setCourseDetails((prevDetails) => ({
      ...prevDetails,
      modules: updatedModules,
    }));
  };

  // const handleImageUpload = async (event,courseId) => {
  //   const file = event.target.files[0];
  //   if (!file) return;
  
  //   const formData = new FormData();
  //   formData.append("image", file);           // keep this ✅
  //   formData.append("courseId", courseId);    // add this ✅
  
  //   try {
  //     const response = await fetch("/api/upload/upload-course-image", {
  //       method: "POST",
  //       body: formData,
  //     });
  
  //     const data = await response.json();
  
  //     if (response.ok) {
  //       // Set the image URL returned from Cloudinary into state
  //       setCourseDetails((prev) => ({
  //         ...prev,
  //         imageUrl: data.image_url,
  //       }));
  //     } else {
  //       console.error("Image upload failed:", data.error);
  //     }
  //   } catch (error) {
  //     console.error("Upload error:", error);
  //   }
  // };
  
  

  const addModule = () => {
    setCourseDetails((prevDetails) => ({
      ...prevDetails,
      modules: [...prevDetails.modules, { title: "", lessons: [{ title: "", video: null }] }],
    }));
  };

  const addLesson = (moduleIndex) => {
    const updatedModules = [...courseDetails.modules];
    updatedModules[moduleIndex].lessons.push({ title: "", video: null });
    setCourseDetails((prevDetails) => ({
      ...prevDetails,
      modules: updatedModules,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
  
    if (!courseDetails.title || !courseDetails.price || !courseDetails.modules.length) {
      alert("Title, price, and at least one module are required.");
      return;
    }
  
    try {
      const token = localStorage.getItem("token");
  
      // Step 1: Create the course
      const courseData = {
        title: courseDetails.title,
        price: courseDetails.price,
        description: courseDetails.description,
        imageUrl: courseDetails.imageUrl,
        modules: courseDetails.modules.map((module) => ({
          title: module.title,
          lessons: module.lessons.map((lesson) => ({ title: lesson.title , hasAssignment: !!lesson.assignment})),
        })),
      };
  
      const response = await axios.post(
        `http://localhost:5000/api/instructor/${instructorId}/courses`,
        courseData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      const courseId = response.data.courseId;
      console.log("✅ Course created, courseId:", courseId);
  
      // Step 2: Fetch lesson IDs from the backend
      const lessonsResponse = await axios.get(
        `http://localhost:5000/api/courses/${courseId}/lessons`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            
          },
        }
      );
  
      const lessonsWithIds = lessonsResponse.data;
      console.log("✅ Lessons with IDs:", lessonsWithIds);
  
      // Step 3: Upload videos with correct lesson IDs
      for (let moduleIndex in courseDetails.modules) {
        for (let lessonIndex in courseDetails.modules[moduleIndex].lessons) {
          const lesson = courseDetails.modules[moduleIndex].lessons[lessonIndex];
          const matchingLesson = lessonsWithIds.find((l) => l.title === lesson.title);
          if (!matchingLesson) {
            console.error("❌ Error: No matching lesson found for", lesson.title);
            continue; // Skip this lesson if ID is not found
          }
  
          if (lesson.video) {
            // Find the correct lesson ID by matching the title
            const matchingLesson = lessonsWithIds.find((l) => l.title === lesson.title);
  
            
  
            const formData = new FormData();
            formData.append("video", lesson.video);
            formData.append("lessonId", matchingLesson.id); // ✅ Using the correct lesson ID
            formData.append("courseId", courseId);
            formData.append("moduleTitle", courseDetails.modules[moduleIndex].title);
            formData.append("lessonTitle", lesson.title);
  
            console.log("✅ Uploading video for lesson ID:", matchingLesson.id);
  
            await axios.post("http://localhost:5000/api/upload/upload-video", formData, {
              headers: {
                Authorization: `Bearer ${token}`,
                
              },
            });
          }

          if (lesson.assignment) {
            const assignmentFormData = new FormData();
            // if (!matchingLesson) {
            //   console.error("❌ Error: No matching lesson found for", lesson.title);
            //   continue; // Skip this lesson if ID is not found
            // }
            assignmentFormData.append("pdf", lesson.assignment);
            assignmentFormData.append("lessonId", matchingLesson.id);
            assignmentFormData.append("description", `Assignment for ${lesson.title}`);
  
            await axios.post("http://localhost:5000/api/upload/upload-assignment", assignmentFormData, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });
          }

        }
      }
  
      alert("Course successfully created!");
      setCourseDetails({
        title: "",
        price: "",
        description: "",
        imageUrl: "",
        modules: [{ title: "", lessons: [{ title: "", video: null, assignment: null  }] }],
      });
    } catch (error) {
      console.error("❌ Error submitting course:", error);
      alert("Error submitting course: " + error.message);
    }
  };
  
  return (
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

<input type="text" 
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
                {/* {module.lessons.map((lesson, lessonIndex) => (
                  <div key={lessonIndex} className="lesson-block">
                    <input type="text" placeholder={`Lesson ${lessonIndex + 1}`} value={lesson.title} onChange={(e) => handleLessonChange(moduleIndex, lessonIndex, e.target.value)} className="lesson-input" />
                    <input type="file" accept="video/*" onChange={(e) => handleVideoUpload(moduleIndex, lessonIndex, e.target.files[0])} className="video-upload" />
                    <input type="file" accept=".pdf" onChange={(e) => handleAssignmentUpload(moduleIndex, lessonIndex, e.target.files[0])} className="assignment-upload" />
                  </div>
                ))} */}
                {module.lessons.map((lesson, lessonIndex) => (
  <div key={lessonIndex} className="lesson-block">
    <input 
      type="text" 
      placeholder={`Lesson ${lessonIndex + 1} Title`} 
      value={lesson.title} 
      onChange={(e) => handleLessonChange(moduleIndex, lessonIndex, e.target.value)} 
      className="lesson-input" 
    />
    
    <div className="file-upload-group">
      <div className="upload-wrapper">
        <label className="upload-label">Lesson Video:</label>
        <input 
          type="file" 
          accept="video/*" 
          onChange={(e) => handleVideoUpload(moduleIndex, lessonIndex, e.target.files[0])} 
          className="video-upload" 
        />
      </div>
      
      <div className="upload-wrapper">
        <label className="upload-label">Assignment PDF:</label>
        <input 
          type="file" 
          accept=".pdf" 
          onChange={(e) => handleAssignmentUpload(moduleIndex, lessonIndex, e.target.files[0])} 
          className="assignment-upload" 
        />
      </div>
    </div>
  </div>
))}
                <button type="button" 
                onClick={() => addLesson(moduleIndex)} 
                className="add-lesson-button">Add Lesson</button>
              </div>
            ))}
            <button 
            type="button" 
            onClick={addModule} 
            className="add-module-button">Add Module</button>
          </div>
          <button type="submit" className="submit-course-button">Submit Course</button>
        </form>
      </div>
  );
};

export default CourseCreation;
