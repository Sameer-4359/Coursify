import React, { useState, useEffect } from "react";
import Card from "./Card";


import "../componentscss/slider.css"
import { faBold } from "@fortawesome/free-solid-svg-icons";

/*function Slider() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [items, setItems] = useState([]);

  useEffect(() => {
    // Fetch courses from the backend
    const fetchCourses = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/courses");
        const data = await response.json();
        setItems(data);
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    };

    fetchCourses();
  }, []);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % items.length);
  };

  const prevSlide = () => {
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + items.length) % items.length
    );
  };

  return (
    <div className="sliderContainer">
      <button className="prevButton" onClick={prevSlide}>
        &#10094;
      </button>

      <div className="sliderTrack" style={{ transform: `translateX(-${currentIndex * 100}%)` }}>
  {items.map((item, index) => (
    <Card
      key={item.id} // Use item.id instead of index for unique keys
      id={item.id} // Pass the id to the Card component
      img={item.img} // Make sure item.img exists in your backend response
      title={item.title} // Make sure item.title exists in your backend response
      instructor={item.instructor} // Make sure item.instructor exists in your backend response
      price={`$${item.price}`} // Format the price appropriately
    />
  ))}
</div>


      <button className="nextButton" onClick={nextSlide}>
        &#10095;
      </button>
    </div>
  );
}

export default Slider;*/
function Slider({ role }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [items, setItems] = useState([]);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/courses");
        const data = await response.json();
        setItems(data);
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    };
    fetchCourses();
  }, []);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % items.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + items.length) % items.length);
  };


  /*const handleDelete = async (id) => {
    if (role !== "admin") return; // Ensure only admins can delete

    try {
      const token = localStorage.getItem("token");
      await fetch(`http://localhost:5000/api/courses/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setItems(items.filter((item) => item.id !== id)); // Update state
    } catch (error) {
      console.error("Error deleting course:", error);
    }
  };*/

  return (
    <div className="sliderContainer">
      <div className="headings"> 
        <h5>Courses and Professional Certificates</h5>
        <h1>New on Coursify</h1>
        <p>Explore our newest programs, focused on delivering in-demand skills.</p>
            </div>
      <button className="prevButton" onClick={prevSlide}>&#10094;</button>
      <div className="sliderTrack" style={{ transform: `translateX(-${currentIndex * 100}%)` }}>
        {items.map((item) => (
          <Card
            key={item.id}
            id={item.id}
            img={item.img}
            title={item.title}
            instructor={item.instructor}
            price={`$${item.price}`}
            role={role} // Pass role to Card
          />
        ))}
      </div>
      <button className="nextButton" onClick={nextSlide}>&#10095;</button>
    </div>
  );
}

export default Slider;




