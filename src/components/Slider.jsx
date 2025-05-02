// import React, { useState, useEffect } from "react";
// import Card from "./Card";
// import "../componentscss/slider.css";

// function Slider({ role }) {
//   const [currentIndex, setCurrentIndex] = useState(0);
//   const [items, setItems] = useState([]);
//   const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

//   const itemsPerPage = 4;

//   useEffect(() => {
//     const fetchCourses = async () => {
//       try {
//         const response = await fetch("http://localhost:5000/api/courses");
//         const data = await response.json();

//         // Fill last slide if needed by repeating from the beginning
//         const remainder = data.length % itemsPerPage;
//         if (remainder !== 0) {
//           const itemsToAdd = itemsPerPage - remainder;
//           const clonedItems = [...data, ...data.slice(0, itemsToAdd)];
//           setItems(clonedItems);
//         } else {
//           setItems(data);
//         }
//       } catch (error) {
//         console.error("Error fetching courses:", error);
//       }
//     };
//     fetchCourses();
//   }, []);

//   useEffect(() => {
//     const handleResize = () => {
//       setIsMobile(window.innerWidth < 768);
//     };
//     window.addEventListener("resize", handleResize);
//     return () => window.removeEventListener("resize", handleResize);
//   }, []);

//   const totalSlides = Math.ceil(items.length / itemsPerPage);

//   const nextSlide = () => {
//     if (currentIndex < totalSlides - 1) {
//       setCurrentIndex((prev) => prev + 1);
//     }
//   };

//   const prevSlide = () => {
//     if (currentIndex > 0) {
//       setCurrentIndex((prev) => prev - 1);
//     }
//   };

//   if (isMobile) {
//     const mobileItems = items.slice(0, 6);
//     return (
//       <div className="mobileCardWrapper">
//         {mobileItems.map((item) => (
//           <Card
//             key={item.id}
//             id={item.id}
//             img={item.img}
//             title={item.title}
//             instructor={item.instructor}
//             price={`$${item.price}`}
//             role={role}
//           />
//         ))}
//       </div>
//     );
//   }

//   const startIndex = currentIndex * itemsPerPage;
//   const visibleItems = items.slice(startIndex, startIndex + itemsPerPage);

//   return (
//     <div className="sliderContainer">
//       <button
//         className="sliderButton"
//         onClick={prevSlide}
//         disabled={currentIndex === 0}
//       >
//         &#10094;
//       </button>

//       <div className="sliderCardsWrapper">
//         {visibleItems.map((item) => (
//           <Card
//             key={item.id + "-" + startIndex} // Ensure unique key
//             id={item.id}
//             img={item.img}
//             title={item.title}
//             instructor={item.instructor}
//             price={`$${item.price}`}
//             role={role}
//           />
//         ))}
//       </div>

//       <button
//         className="sliderButton"
//         onClick={nextSlide}
//         disabled={currentIndex === totalSlides - 1}
//       >
//         &#10095;
//       </button>
//     </div>
//   );
// }

// export default Slider;


import React, { useState, useEffect } from "react";
import Slider from "react-slick";
import Card from "./Card";
import axios from "axios";
import "../componentscss/slider.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

function CourseSlider({ role }) {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/courses");
        setCourses(response.data);
      } catch (error) {
        console.error("Error fetching courses:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  const settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    arrows: true,
    responsive: [
      {
        breakpoint: 1200,
        settings: {
          slidesToShow: 3,
        }
      },
      {
        breakpoint: 900,
        settings: {
          slidesToShow: 2,
        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          arrows: false,
          dots: true
        }
      }
    ]
  };

  if (loading) {
    return <div className="loading">Loading courses...</div>;
  }

  if (courses.length === 0) {
    return <div className="no-courses">No courses available.</div>;
  }

  return (
    <div className="course-slider-container">
      <div className="slider-header">
        <h2>Featured Courses</h2>
        {role === "Student" && (
          <a href="/courses" className="view-all-link">View All</a>
        )}
      </div>

      <div className="course-slider">
        <Slider {...settings}>
          {courses.map((course) => (
            <div key={course.id} className="slider-card-wrapper">
              <Card
                id={course.id}
                img={course.image_url || course.img}
                title={course.title}
                instructor={course.instructor}
                price={`$${course.price}`}
                role={role}
              />
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
}

export default CourseSlider;
