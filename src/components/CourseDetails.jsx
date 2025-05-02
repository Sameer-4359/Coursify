import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Footer from "./Footer";
import Menu from "./Menu";
import "../componentscss/coursedetails.css";

// Subcomponent: Course Header
const CourseHeader = ({ course, role, isEnrolled, onAddToCart }) => (
  <div className="course-header">
    <img src={course.image_url} alt={course.title} className="course-image" />
    <div className="course-info">
      <h1 className="course-title">{course.title}</h1>
      <p className="course-instructor">Instructor: {course.instructor}</p>
      <p className="course-price">Price: ${course.price}</p>
      {!isEnrolled && role === "Student" && (
        <button className="add-to-cart-button" onClick={onAddToCart}>
          Add to Cart
        </button>
      )}
    </div>
  </div>
);

// Subcomponent: Module Item
const ModuleItem = ({ module, role, isEnrolled, onToggleLesson }) => {
  const isModuleCompleted = (moduleLessons) => 
    moduleLessons?.length === module.lessons.length;

  return (
    <div className="module">
      <h3 className="module-title">
        {role === "Student" && isEnrolled && (
          <input
            type="checkbox"
            checked={isModuleCompleted(completedLessons[module.id])}
            readOnly
          />
        )}
        {module.title}
      </h3>
      <ul>
        {module.lessons.map((lesson, index) => (
          <LessonItem 
            key={index}
            lesson={lesson}
            moduleId={module.id}
            index={index}
            role={role}
            isEnrolled={isEnrolled}
            onToggleLesson={onToggleLesson}
          />
        ))}
      </ul>
    </div>
  );
};

// Subcomponent: Lesson Item
const LessonItem = ({ lesson, moduleId, index, role, isEnrolled, onToggleLesson }) => (
  <li className="course-lesson">
    <label>
      {role === "Student" && isEnrolled && (
        <input
          type="checkbox"
          checked={completedLessons[moduleId]?.includes(index)}
          onChange={() => onToggleLesson(moduleId, index)}
        />
      )}
      {lesson.title}
    </label>

    {(isEnrolled || role === "Instructor") && lesson.video_url && (
      <VideoPlayer videoUrl={lesson.video_url} />
    )}

    {(isEnrolled || role === "Instructor") && lesson.assignment_url && (
      <AssignmentPreview assignmentUrl={lesson.assignment_url} />
    )}
  </li>
);

// Subcomponent: Video Player
const VideoPlayer = ({ videoUrl }) => (
  <video controls width="600">
    <source src={videoUrl} type="video/mp4" />
    Your browser does not support the video tag.
  </video>
);

// Subcomponent: Assignment Preview
const AssignmentPreview = ({ assignmentUrl }) => (
  <div>
    <h4>Assignment Preview:</h4>
    <iframe
      src={`https://docs.google.com/gview?url=${encodeURIComponent(assignmentUrl)}&embedded=true`}
      width="100%"
      height="300px"
      frameBorder="0"
      title="PDF Preview"
    />
    <div style={{ marginTop: "10px" }}>
      <a 
        href={assignmentUrl.replace("/upload/", "/upload/fl_attachment/")} 
        target="_blank" 
        rel="noopener noreferrer"
      >
        📥 Download Assignment PDF
      </a>
    </div>
  </div>
);

// Subcomponent: Review List
const ReviewList = ({ reviews }) => (
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
);

// Subcomponent: Review Form
const ReviewForm = ({ onSubmit, reviewInput, setReviewInput }) => (
  <div className="submit-review">
    <h3>Leave a Review</h3>
    <form onSubmit={onSubmit}>
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
);

// Subcomponent: Certificate Button
const CertificateButton = ({ isCourseCompleted, onClick }) => (
  <div className="certificate-button">
    {isCourseCompleted && (
      <button
        onClick={onClick}
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
);

// Main Component
const CourseDetails = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [completedLessons, setCompletedLessons] = useState({});
  const [reviewInput, setReviewInput] = useState({ rating: "", text: "" });
  const [isEnrolled, setIsEnrolled] = useState(false);
  const role = localStorage.getItem("role");

  // API Client
  const api = axios.create({
    baseURL: "http://localhost:5000/api",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`
    }
  });

  // Fetch course data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [courseRes, reviewsRes] = await Promise.all([
          api.get(`/instructor/courses/${courseId}/details`),
          api.get(`/courses/${courseId}/reviews`)
        ]);
        setCourse(courseRes.data);
        setReviews(reviewsRes.data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load course data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [courseId]);

  // Check enrollment status
  useEffect(() => {
    const checkEnrollment = async () => {
      try {
        const { data } = await api.get(`/courses/${courseId}/enrollment-status`);
        setIsEnrolled(data.enrolled);
      } catch (err) {
        console.error("Error checking enrollment:", err);
      }
    };

    if (role === "Student") checkEnrollment();
  }, [courseId, role]);

  // Add to cart handler
  const handleAddCourse = async () => {
    try {
      await api.post("/cart/add", { courseId });
      alert("Course added to cart successfully");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to add course to cart");
    }
  };

  // Toggle lesson completion
  const toggleLessonCompletion = (moduleId, lessonIndex) => {
    setCompletedLessons(prev => ({
      ...prev,
      [moduleId]: prev[moduleId]?.includes(lessonIndex)
        ? prev[moduleId].filter(i => i !== lessonIndex)
        : [...(prev[moduleId] || []), lessonIndex]
    }));
  };

  // Submit review
  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post(`/courses/${courseId}/reviews`, {
        rating: reviewInput.rating,
        reviewText: reviewInput.text
      });
      alert("Review submitted successfully");
      setReviewInput({ rating: "", text: "" });
      // Refresh reviews
      const { data } = await api.get(`/courses/${courseId}/reviews`);
      setReviews(data);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to submit review");
    }
  };

  // Check course completion
  const isCourseCompleted = () => {
    return course?.modules?.every(module => 
      completedLessons[module.id]?.length === module.lessons.length
    );
  };

  // Generate certificate
  const handleGenerateCertificate = () => {
    if (!isCourseCompleted()) {
      alert("Complete all modules to generate a certificate");
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
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!course) return <div>No course details found.</div>;

  return (
    <div>
      <Menu />
      <div className="course-detail">
        <CourseHeader 
          course={course} 
          role={role} 
          isEnrolled={isEnrolled} 
          onAddToCart={handleAddCourse} 
        />


        <div className="course-description">
          <h2>Course Description</h2>
          <p>{course.description}</p>
        </div>

        <div class="certificate-container">
          <div class="certificate-text">
            <h2>Earn a career certificate</h2>
            <p>Add this credential to your LinkedIn profile, resume, or CV</p>
            <p>Share it on social media and in your performance review</p>
          </div>
          <div class="certificate-image">
            <img src="/images/certificate.png" alt="Certificate illustration" />
          </div>
        </div>

        <div className="course-curriculum">
          <h2>Curriculum</h2>
          {course.modules?.length > 0 ? (
            course.modules.map(module => (
              <ModuleItem
                key={module.id}
                module={module}
                role={role}
                isEnrolled={isEnrolled}
                onToggleLesson={toggleLessonCompletion}
              />
            ))
          ) : (
            <p>No modules available</p>
          )}
        </div>

        <ReviewList reviews={reviews} />

        {isEnrolled && role === "Student" && (
          <ReviewForm
            onSubmit={handleReviewSubmit}
            reviewInput={reviewInput}
            setReviewInput={setReviewInput}
          />
        )}

        <CertificateButton
          isCourseCompleted={isCourseCompleted()}
          onClick={handleGenerateCertificate}
        />
      </div>
      <Footer />
    </div>
  );
};

export default CourseDetails;