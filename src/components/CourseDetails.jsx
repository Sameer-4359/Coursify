import React from "react";

const CourseDetails = ({ course }) => {
  return (
    <div className="course-detail">
      <div className="course-header">
        <img
          src={course.imageUrl}
          alt={course.title}
          className="course-image"
        />
        <div className="course-info">
          <h1 className="course-title">{course.title}</h1>
          <p className="course-instructor">Instructor: {course.instructor}</p>
          <p className="course-rating">Rating: {course.rating} / 5</p>
          <p className="course-price">${course.price}</p>
          <button className="add-to-cart-button">Add to Cart</button>
        </div>
      </div>

      <div className="course-description">
        <h2>Course Description</h2>
        <p>{course.description}</p>
      </div>

      <div className="course-curriculum">
        <h2>Curriculum</h2>
        {course.modules && course.modules.length > 0 ? (
          course.modules.map((module) => (
            <div key={module.moduleId} className="module">
              <h3 className="module-title">{module.title}</h3>
              <ul>
                {module.lessons.map((lesson) => (
                  <li key={lesson.lessonId} className="course-lesson">
                    {lesson.title}
                  </li>
                ))}
              </ul>
            </div>
          ))
        ) : (
          <p>No modules available</p>
        )}
      </div>

      <div className="course-reviews">
        <hr />
        <h2>Student Reviews</h2>
        {course.reviews && course.reviews.length > 0 ? (
          course.reviews.map((review) => (
            <div key={review.reviewId} className="review">
              <p className="review-author">{review.studentName}</p>
              <p className="review-content">{review.reviewText}</p>
              <p className="review-rating">Rating: {review.rating} / 5</p>
            </div>
          ))
        ) : (
          <p>No reviews available</p>
        )}
      </div>
    </div>
  );
};

export default CourseDetails;
