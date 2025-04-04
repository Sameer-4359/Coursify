// import React from "react";
// import "../componentscss/banner.css";

// const Banner = () => {
//   return (
//     <div className="banner-container">
//       <div className="banner-content">
//       <img
//             src="https://aroomat.com/wp-content/uploads/2025/04/banner.png"
//             alt="Learning Illustration"
//             className="desktop-image"
//           />
//         <h1>Welcome to Our Website</h1>
//         <p>Discover the best products and services tailored just for you.</p>
//         <Button text="Explore Now" onClick={() => alert("Button Clicked!")} />
//       </div>
//     </div>
//   );
// };

// const Button = ({ text, onClick }) => {
//   return (
//     <button className="banner-button" onClick={onClick}>
//       {text}
//     </button>
//   );
// };

// export default Banner;
import React from "react";
import "../componentscss/banner.css";

const Banner = ({ image }) => {
  return (
    <div className="banner-container" style={{ backgroundImage: `url(${image})` }}>
      <div className="banner-content">
      </div>
    </div>
  );
};

export default Banner;
