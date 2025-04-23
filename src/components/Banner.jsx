import React from "react";
import "../componentscss/banner.css";

const Banner = () => {
  return (
    <div className="banner-container">
      <div className="banner-overlay">
        <h1 className="banner-title">One Stop To Learn Anything</h1>
        <p className="banner-subtitle">Learn more to get more knowledge</p>
        <button className="banner-button">Explore Now</button>
      </div>
    </div>
  );
};

export default Banner;
