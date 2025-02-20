import React from "react";

function Card(props) {
  return (
    <div className="courseCard">
      <div className="cardImg">
        <img src={props.img} alt="" />
      </div>
      <div className="cardContent">
        <h2>{props.title}</h2>
        <p>{props.instructor}</p>
        <p>{props.price}</p>
        <button>See more...</button>
      </div>
    </div>
  );
}

export default Card;
