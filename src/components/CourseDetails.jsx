import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom"; // Import useNavigate here
import axios from "axios";import Footer from "./Footer";
import Menu from "./Menu";
import "../componentscss/coursedetails.css";


const CourseDetails = () => {
  const { courseId } = useParams();
  const navigate = useNavigate(); // Define navigate here
  const [course, setCourse] = useState(null);
  const [reviews, setReviews] = useState([]); // Separate state for reviews
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [completedLessons, setCompletedLessons] = useState({});
  const [reviewInput, setReviewInput] = useState({ rating: "", text: "" });
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [userRole, setUserRole] = useState(""); // Get role from auth context

  
  const role = localStorage.getItem("role"); // Fetch the role from localStorage or API

  // Add course to cart
  const handleAddCourse = async (courseId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "http://localhost:5000/api/cart/add",
        { courseId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert(response.data.message);
    } catch (err) {
      console.error("Error adding course to cart:", err);
      alert(err.response?.data?.message || "Failed to add course to cart.");
    }
  };

  // Fetch course details and reviews
  useEffect(() => {
    const fetchCourseDetails = async () => {
      try {
        const [courseResponse, reviewsResponse] = await Promise.all([
          axios.get(`http://localhost:5000/api/instructor/courses/${courseId}/details`),
          axios.get(`http://localhost:5000/api/courses/${courseId}/reviews`)
        ]);
      

        setCourse(courseResponse.data);
        setReviews(reviewsResponse.data); // Set reviews state
      } catch (err) {
        console.error("Error fetching course details or reviews:", err);
        setError("Failed to load course details or reviews.");
      } finally {
        setLoading(false);
      }
    };

    fetchCourseDetails();
  }, [courseId]);
  
  // Toggle lesson completion
  const toggleLessonCompletion = (moduleId, lessonIndex) => {
    setCompletedLessons((prev) => {
      const updated = { ...prev };
      const moduleLessons = updated[moduleId] || [];
      if (moduleLessons.includes(lessonIndex)) {
        updated[moduleId] = moduleLessons.filter((index) => index !== lessonIndex);
      } else {
        updated[moduleId] = [...moduleLessons, lessonIndex];
      }
      return updated;
    });
  };

  //check if student is enrolled in a course
   
  useEffect(() => {
    async function checkEnrollment() {
      try {
        const response = await fetch(`http://localhost:5000/api/courses/${courseId}/enrollment-status`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`, // Include token if needed
          },
        });

        const data = await response.json();
        if (data.enrolled) {
          setIsEnrolled(true);
        }
      } catch (error) {
        console.error("Error checking enrollment status:", error);
      }
    }

    checkEnrollment();
  }, [courseId]);




  // Check if a module is completed
  const isModuleCompleted = (module) => {
    const moduleLessons = completedLessons[module.id] || [];
    return moduleLessons.length === module.lessons.length;
  };

  // Submit review
  const handleReviewSubmit = async (e) => {
    e.preventDefault();
  
    // Ensure reviewInput is valid
    console.log("Review Input State:", reviewInput);
    if (!reviewInput || !reviewInput.rating || !reviewInput.text) {
      alert("Please fill out all fields.");
      return;
    }
  
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("You must be logged in to submit a review.");
        return;
      }
  
      if (!courseId) {
        alert("Course ID is missing.");
        return;
      }
  
      // Send review data with matching field names
      const { data } = await axios.post(
        `http://localhost:5000/api/courses/${courseId}/reviews`,
        { rating: reviewInput.rating, reviewText: reviewInput.text }, // Ensure the field names match
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Review submitted successfully:", data);
      alert("Review submitted successfully")
    } catch (err) {
      console.error("Error details:", err.response?.data || err);
  
      const errorMessage =
        err.response?.data?.message || err.message || "Failed to submit review. Please try again.";
      alert(errorMessage);
    }
  };

  const studentId = localStorage.getItem("studentId"); // Fetch student ID from storage or state

  const isCourseCompleted = () => {
    return (
      course?.modules?.every((module) =>
        completedLessons[module.id]?.length === module.lessons.length
      ) || false
    );
  };

  const handleGenerateCertificate = () => {
    if (!isCourseCompleted()) {
      alert("Complete all modules to generate a certificate.");
      return;
    }

    navigate(`/certificate`, {
      state: {
        studentData: {
          name: localStorage.getItem("username") || "Student Name",
          courseName: course?.title || "Course Title",
          completionDate: new Date().toLocaleDateString(),
        },
      },
      
    });
    //alert(studentData.name);
  };

  const handleVideoUpload = async (e, moduleId) => {
    e.preventDefault();
    if (!videoFile) {
      alert("Please select a video file to upload.");
      return;
    }

    const formData = new FormData();
    formData.append("video", videoFile);
    formData.append("moduleId", moduleId);

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post("http://localhost:5000/api/upload/upload-video", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      alert("Video uploaded successfully");
      setLessons([...lessons, response.data]);
    } catch (error) {
      console.error("Error uploading video:", error);
      alert("Failed to upload video.");
    }
  };



  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p className="error">{error}</p>;
  }

  if (!course) {
    return <p>No course details found.</p>;
  }

  return (
    <div>
     <header><Menu /></header>

    <div className="course-detail">
      {/* Header Section */}
      <div className="course-header">
        <img
          src={course.image_url}
          alt={course.title}
          className="course-image"
        />
        <div className="course-info">
          <h1 className="course-title">{course.title}</h1>
          <p className="course-instructor">Instructor: {course.instructorName}</p>
          <p className="course-price">Price: ${course.price}</p>
          {/* Add to Cart Button with onClick handler */}
    {!isEnrolled && role === "Student" && (
     <button className="add-to-cart-button" onClick={() => handleAddCourse(courseId)}>
      Add to Cart
    </button>
)}

        </div>
      </div>

      {/* Description Section */}
      <div className="course-description">
        <h2>Course Description</h2>
        <p>{course.description}</p>
      </div>

      {/* Curriculum Section */}
      <div className="course-curriculum">
  <h2>Curriculum</h2>
  {course.modules?.length > 0 ? (
    course.modules.map((module) => (
      <div key={module.id} className="module">
        <h3 className="module-title">
          {role === "Student" && (
            <input
              type="checkbox"
              checked={isModuleCompleted(module)}
              readOnly
            />
          )}
          {module.title}
        </h3>
        <ul>
          {module.lessons.map((lesson, index) => (
            <li key={index} className="course-lesson">
              <label>
                {role === "Student" && (
                  <input
                    type="checkbox"
                    checked={completedLessons[module.id]?.includes(index)}
                    onChange={() => toggleLessonCompletion(module.id, index)}
                  />
                )}
                {lesson.title}
              </label>

              {/* Video Section - Visible only to enrolled Students and Instructors */}
              {(isEnrolled || role === "Instructor") && lesson.video_url && (
                <video controls width="600">
                  <source src={lesson.video_url} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              )}

              {/* Instructor Upload Section */}
              {/* {role === "Instructor" && (
                <div className="video-upload">
                  <input
                    type="file"
                    accept="video/*"
                    onChange={(e) => setVideoFile(e.target.files[0])}
                  />
                  <button onClick={(e) => handleVideoUpload(e, module.id)}>
                    Upload Video
                  </button>
                </div>
              )} */}
            </li>
          ))}
        </ul>
      </div>
    ))
  ) : (
    <p>No modules available</p>
  )}
</div>



      {/* Reviews Section */}
      <div className="course-reviews">
        <hr />
        <h2>Student Reviews</h2>
        {reviews.length > 0 ? (
          reviews.map((review) => (
            <div key={review.id} className="review">
              <p className="review-author">
                <strong>{review.studentname || "Anonymous"}</strong>
              </p>
              <p className="review-content">"{review.review_text}"</p>
              <p className="review-rating">
                <strong>Rating:</strong> {review.rating} / 5
              </p>
              <small className="review-date">
                Reviewed on: {new Date(review.created_at).toLocaleDateString()}
              </small>
            </div>
          ))
        ) : (
          <p>No reviews available.</p>
        )}
      </div>

      {/* Review Submission Section */}
      {/* Review Submission Section */}
{isEnrolled && role === "Student" && (
  <div className="submit-review">
    <h3>Leave a Review</h3>
    <form onSubmit={handleReviewSubmit}>
      <label style={{ display: "block", marginBottom: "10px" }}>
        Rating:
        <input
          type="number"
          min="1"
          max="5"
          value={reviewInput.rating}
          onChange={(e) =>
            setReviewInput({ ...reviewInput, rating: e.target.value })
          }
          required
          style={{
            color: "blue",
            marginLeft: "10px",
            padding: "5px",
            width: "50px",
            fontSize: "16px",
            border: "1px solid #ccc",
            borderRadius: "4px",
            textAlign: "center",
          }}
        />
      </label>
      <label style={{ display: "block", marginBottom: "10px" }}>
        Review:
        <textarea
          value={reviewInput.text}
          onChange={(e) =>
            setReviewInput({ ...reviewInput, text: e.target.value })
          }
          required
          style={{
            color: "blue",
            marginTop: "5px",
            padding: "10px",
            width: "100%",
            fontSize: "16px",
            border: "1px solid #ccc",
            borderRadius: "4px",
          }}
        />
      </label>
      <button
        type="submit"
        style={{
          backgroundColor: "blue",
          color: "white",
          border: "none",
          padding: "10px 20px",
          fontSize: "16px",
          borderRadius: "4px",
          cursor: "pointer",
          marginTop: "10px",
        }}
      >
        Submit Review
      </button>
    </form>
  </div>
)}

      {/* Completion Certificate Section */}
      <div className="certificate-button">
        {isCourseCompleted() && (
          <button
            onClick={handleGenerateCertificate}
            style={{
              backgroundColor: "green",
              color: "white",
              border: "none",
              padding: "10px 20px",
              fontSize: "16px",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Generate Certificate
          </button>
        )}
      </div>
    </div>
    <footer><Footer /></footer>
      </div>

  );
};

export default CourseDetails;

