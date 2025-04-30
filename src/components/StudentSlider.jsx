import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import axios from "axios";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "../componentscss/studentslider.css";

function StudentSlider() {
  const [enrolledCourses, setEnrolledCourses] = useState([]);

  useEffect(() => {
    const fetchEnrolledCourses = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.error("No token found");
          return;
        }

        const response = await axios.get("http://localhost:5000/api/checkout/enrolled-courses", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setEnrolledCourses(response.data);
      } catch (error) {
        console.error("Failed to fetch enrolled courses:", error);
      }
    };

    fetchEnrolledCourses();
  }, []);

  const settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    arrows: true,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 2 } },
      { breakpoint: 768, settings: { slidesToShow: 1 } }
    ]
  };

  if (enrolledCourses.length === 0) {
    return <p className="no-courses">No enrolled courses to display.</p>;
  }

  return (
    <div className="student-slider-wrapper">
      <div className="student-slider-header">
        <h2>Continue Learning</h2>
        <a href="/mylearning" className="my-learning-link">My Learning</a>
      </div>

      <Slider {...settings}>
        {enrolledCourses.map((course) => (
          <div key={course.id} className="course-card">
            <div className="thumbnail">
              <img src={course.image_url} alt={course.title} />
              <div className="play-button">▶</div>
            </div>
            <div className="details">
              <p className="course-title">{course.title}</p>
              <p className="lecture-title">{course.instructor}</p>
              <p className="lecture-time">Lecture • 5 min left</p>
              <div className="progress-bar">
                <div className="progress" style={{ width: "30%" }}></div>
              </div>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
}

export default StudentSlider;
