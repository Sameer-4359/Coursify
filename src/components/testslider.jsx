import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "../componentscss/testslider.css";

const slides = [
  {
    image: "https://about.udemy.com/wp-content/uploads/2024/02/about-homepage-hero-jan-2024.png",
    title: "A meeting of the minds",
    description:
      "When Angela switched careers from surgery to development, she had no idea the impact she’d later have on millions of learners.",
  },
  {
    image: "https://source.unsplash.com/800x500/?technology,learning",
    title: "Empowering Learners",
    description:
      "Technology is shaping the future of education. Join us in making learning accessible for everyone.",
  },
];

const ImageTextSlider = () => {
  return (
    <Swiper
      modules={[Navigation, Pagination]}
      navigation
      pagination={{ clickable: true }}
      loop={true}
      className="custom-slider"
    >
      {slides.map((slide, index) => (
        <SwiperSlide key={index}>
          <div className="slide-content">
            <div className="image-container">
              <img src={slide.image} alt={slide.title} />
              <button className="play-button">▶</button>
            </div>
            <div className="text-content">
              <h2>{slide.title}</h2>
              <p>{slide.description}</p>
              <button className="next-btn">→</button>
            </div>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default ImageTextSlider;
