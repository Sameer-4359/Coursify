import React, { useState, useEffect } from "react";
import Card from "./Card";
import "../componentscss/slider.css";

function Slider({ role }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [items, setItems] = useState([]);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  const itemsPerPage = 4;

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/courses");
        const data = await response.json();

        // Fill last slide if needed by repeating from the beginning
        const remainder = data.length % itemsPerPage;
        if (remainder !== 0) {
          const itemsToAdd = itemsPerPage - remainder;
          const clonedItems = [...data, ...data.slice(0, itemsToAdd)];
          setItems(clonedItems);
        } else {
          setItems(data);
        }
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    };
    fetchCourses();
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const totalSlides = Math.ceil(items.length / itemsPerPage);

  const nextSlide = () => {
    if (currentIndex < totalSlides - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const prevSlide = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  if (isMobile) {
    const mobileItems = items.slice(0, 6);
    return (
      <div className="mobileCardWrapper">
        {mobileItems.map((item) => (
          <Card
            key={item.id}
            id={item.id}
            img={item.img}
            title={item.title}
            instructor={item.instructor}
            price={`$${item.price}`}
            role={role}
          />
        ))}
      </div>
    );
  }

  const startIndex = currentIndex * itemsPerPage;
  const visibleItems = items.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="sliderContainer">
      <button
        className="sliderButton"
        onClick={prevSlide}
        disabled={currentIndex === 0}
      >
        &#10094;
      </button>

      <div className="sliderCardsWrapper">
        {visibleItems.map((item) => (
          <Card
            key={item.id + "-" + startIndex} // Ensure unique key
            id={item.id}
            img={item.img}
            title={item.title}
            instructor={item.instructor}
            price={`$${item.price}`}
            role={role}
          />
        ))}
      </div>

      <button
        className="sliderButton"
        onClick={nextSlide}
        disabled={currentIndex === totalSlides - 1}
      >
        &#10095;
      </button>
    </div>
  );
}

export default Slider;

