import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import "../componentscss/addcourse.css";

const UpdateCourse = () => {
  const { courseId } = useParams(); // Get courseId from URL params
  const navigate = useNavigate();

  const [courseDetails, setCourseDetails] = useState({
    title: "",
    price: "",
    description: "",
    imageUrl: "",
    modules: [{ title: "", lessons: [""] }],
  });

  const [loading, setLoading] = useState(true);

  // Fetch course details
  useEffect(() => {
    const fetchCourseDetails = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/instructor/courses/${courseId}/details`
        );
        setCourseDetails(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching course details:", error);
        alert("Failed to load course details.");
      }
    };

    fetchCourseDetails();
  }, [courseId]);

  // Handle form input changes
  const handleChange = (event) => {
    const { name, value } = event.target;
    setCourseDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  // Handle module title changes
  const handleModuleChange = (index, value) => {
    const updatedModules = [...courseDetails.modules];
    updatedModules[index].title = value;
    console.log("Updated Modules after change:", updatedModules);
    setCourseDetails((prevDetails) => ({
      ...prevDetails,
      modules: updatedModules,
    }));
  };
  

  // Handle lesson changes
  const handleLessonChange = (moduleIndex, lessonIndex, value) => {
    const updatedModules = [...courseDetails.modules];
    updatedModules[moduleIndex].lessons[lessonIndex] = value;
    console.log("Updated Modules with Lessons:", updatedModules);
    setCourseDetails((prevDetails) => ({
      ...prevDetails,
      modules: updatedModules,
    }));
  };

  // //handle video upload 
  // const handleVideoUpload = (moduleIndex, lessonIndex, file) => {
  //   const updatedModules = [...courseDetails.modules];
  //   updatedModules[moduleIndex].lessons[lessonIndex].video = file;
  //   setCourseDetails((prevDetails) => ({
  //     ...prevDetails,
  //     modules: updatedModules,
  //   }));
  // };

  const handleVideoUpload = (moduleIndex, lessonIndex, file) => {
    setCourseDetails(prevState => {
        const updatedModules = [...prevState.modules]; // Copy modules array
        const updatedLessons = [...updatedModules[moduleIndex].lessons]; // Copy lessons array

        // Ensure the lesson object exists properly
        if (typeof updatedLessons[lessonIndex] !== "object") {
            updatedLessons[lessonIndex] = { title: updatedLessons[lessonIndex], video: null };
        }

        updatedLessons[lessonIndex].video = file; // Assign video file correctly
        updatedModules[moduleIndex] = { ...updatedModules[moduleIndex], lessons: updatedLessons };

        return { ...prevState, modules: updatedModules };
    });
};

const handlePdfUpload = (moduleIndex, lessonIndex, file) => {
  setCourseDetails(prevState => {
    const updatedModules = [...prevState.modules];
    const updatedLessons = [...updatedModules[moduleIndex].lessons];

    if (typeof updatedLessons[lessonIndex] !== "object") {
      updatedLessons[lessonIndex] = { title: updatedLessons[lessonIndex], video: null, pdf: null };
    }

    updatedLessons[lessonIndex].pdf = file;
    updatedModules[moduleIndex] = { ...updatedModules[moduleIndex], lessons: updatedLessons };

    return { ...prevState, modules: updatedModules };
  });
};


  

  // Add a new module
  const addModule = () => {
    setCourseDetails((prevDetails) => ({
      ...prevDetails,
      modules: [...prevDetails.modules, { title: "", lessons: [""] }],
    }));
  };

  // Add a new lesson to a module
  const addLesson = (moduleIndex) => {
    setCourseDetails((prevDetails) => {
      const updatedModules = [...prevDetails.modules];
      updatedModules[moduleIndex].lessons.push(""); // Add an empty string
      return { ...prevDetails, modules: updatedModules };
    });
  };

  // Submit updated course details
  const handleSubmit = async (event) => {
    event.preventDefault();

    const token = localStorage.getItem("token");
    if (!token) {
        alert("You need to log in to update the course.");
        return;
    }

    // Prepare course data payload
    const courseData = {
        title: courseDetails.title,
        price: courseDetails.price,
        description: courseDetails.description,
        imageUrl: courseDetails.imageUrl,
        modules: courseDetails.modules.map(module => ({
            title: module.title,
            lessons: module.lessons.map(lesson => ({
                title: lesson.title,
                video_url: lesson.video_url || null // Ensure video URL is included if it exists
            }))
        }))
    };

    try {
        // Step 1: Update the course details
        const response = await fetch(`http://localhost:5000/api/instructor/courses/${courseId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(courseData),
        });

        const data = await response.json();
        if (!response.ok) {
            console.error("Error response:", data);
            alert(data.error || "Failed to update course.");
            return;
        }

        console.log("✅ Course updated successfully!", data);
        
        // Step 2: Fetch updated lesson IDs after updating the course
        const lessonsResponse = await fetch(`http://localhost:5000/api/courses/${courseId}/lessons`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        const lessonsWithIds = await lessonsResponse.json();
        console.log("✅ Fetched updated lesson IDs:", lessonsWithIds);

        // Step 3: Upload videos for lessons that have new video files
        // Step 4: Upload PDFs for lessons that have new PDF files
for (let moduleIndex in courseDetails.modules) {
  for (let lessonIndex in courseDetails.modules[moduleIndex].lessons) {
    const lesson = courseDetails.modules[moduleIndex].lessons[lessonIndex];

    if (lesson.pdf && lesson.pdf instanceof File) {
      const matchingLesson = lessonsWithIds.find(l => l.title === lesson.title);
      if (!matchingLesson) {
        console.error("❌ No matching lesson found for:", lesson.title);
        continue;
      }

      const formData = new FormData();
      formData.append("pdf", lesson.pdf);
      formData.append("lessonId", matchingLesson.id);
      formData.append("courseId", courseId);

      console.log("📄 Uploading PDF for lesson ID:", matchingLesson.id);

      await fetch("http://localhost:5000/api/uploads/upload-assignment", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });
    }
  }
}


        alert("Course updated successfully!");
        navigate(`/instructorDashboard`);
    } catch (error) {
        console.error("❌ Error updating course:", error);
        alert("An error occurred. Please try again.");
    }
};


  if (loading) return <div>Loading course details...</div>;

  return (
    <div className="course-creation-container">
      <h2>Update Course</h2>
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
                  <div key={lessonIndex} className="lesson-block">
                    <input type="text" placeholder={`Lesson ${lessonIndex + 1}`} value={lesson.title} onChange={(e) => handleLessonChange(moduleIndex, lessonIndex, e.target.value)} className="lesson-input" />
                    <input type="file" accept="video/*" onChange={(e) => handleVideoUpload(moduleIndex, lessonIndex, e.target.files[0])} className="video-upload" />
                    <input type="file" accept="application/pdf" onChange={(e) => handlePdfUpload(moduleIndex, lessonIndex, e.target.files[0])} className="pdf-upload" />

                  </div>
                ))}
              <button
                type="button"
                onClick={() => addLesson(moduleIndex)}
                className="add-lesson-button">
                Add Lesson
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addModule}
            className="add-module-button"
          >
            Add Module
          </button>
        </div>
        <button type="submit" className="submit-course-button">
          Update Course
        </button>
      </form>
    </div>
  );
};

export default UpdateCourse;
