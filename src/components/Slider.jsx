// import React, { useState } from "react";
// import Card from "./Card";
// import Items from "../carousel";
// // import "../../public/styles.css";

// function Slider() {
//   const [currentIndex, setCurrentIndex] = useState(0);

//   const nextSlide = () => {
//     setCurrentIndex((prevIndex) => (prevIndex + 1) % Items.length);
//   };

//   const prevSlide = () => {
//     setCurrentIndex(
//       (prevIndex) => (prevIndex - 1 + Items.length) % Items.length
//     );
//   };

//   return (
//     <div className="sliderContainer">
//       <button className="prevButton" onClick={prevSlide}>
//         &#10094;
//       </button>

//       <div
//         className="sliderTrack"
//         style={{ transform: `translateX(-${currentIndex * 100}%)` }}
//       >
//         {Items.map((item, index) => (
//           <Card
//             key={index}
//             img={item.img}
//             title={item.title}
//             instructor={item.instructor}
//             price={item.price}
//           />
//         ))}
//       </div>

//       <button className="nextButton" onClick={nextSlide}>
//         &#10095;
//       </button>
//     </div>
//   );
// }

// export default Slider;


import React, { useState, useEffect } from "react";
import Card from "./Card";
import Items from "../carousel";

function Slider() {
  const [currentIndex, setCurrentIndex] = useState(1); // Start at 1 (after the duplicate last slide)
  const [adjustedItems, setAdjustedItems] = useState([]);

  // Prepare the items with duplicates for infinite scroll
  useEffect(() => {
    const duplicateItems = [Items[Items.length - 1], ...Items, Items[0]];
    setAdjustedItems(duplicateItems);
  }, []);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => prevIndex + 1);
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => prevIndex - 1);
  };

  // Reset position when reaching the duplicates
  useEffect(() => {
    if (currentIndex === adjustedItems.length - 1) {
      setTimeout(() => {
        setCurrentIndex(1); // Go to the first actual slide
      }, 300); // Match the CSS transition time
    } else if (currentIndex === 0) {
      setTimeout(() => {
        setCurrentIndex(adjustedItems.length - 2); // Go to the last actual slide
      }, 300);
    }
  }, [currentIndex, adjustedItems.length]);

  return (
    <div className="sliderContainer">
      <button className="prevButton" onClick={prevSlide}>
        &#10094;
      </button>

      <div
        className="sliderTrack"
        style={{
          display: "flex",
          transform: `translateX(-${currentIndex * 100}%)`,
          transition: currentIndex === 0 || currentIndex === adjustedItems.length - 1 ? "none" : "transform 0.5s ease",
        }}
      >
        {adjustedItems.map((item, index) => (
          <Card
            key={index}
            img={item.img}
            title={item.title}
            instructor={item.instructor}
            price={item.price}
          />
        ))}
      </div>

      <button className="nextButton" onClick={nextSlide}>
        &#10095;
      </button>
    </div>
  );
}

export default Slider;

