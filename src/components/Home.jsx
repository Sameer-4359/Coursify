import React from "react";
import Menu from "./Menu.jsx";
import Footer from "./Footer.jsx";
import Banner from "./Banner.jsx";
import Slider from "./Slider.jsx";
import Community from "./Community.jsx";
import Experience from "./Experience.jsx";
import ChooseUs from "./ChooseUs.jsx";
import "../componentscss/home.css";
import Heading from "./Heading.jsx";


function Home(){
    return (
        <div>
            <header><Menu /></header>
            <main>
            <Banner />
            <Heading />
            <Experience />
            <Slider />
            <ChooseUs />
            <Community />
            </main>
            <footer><Footer /></footer>
        </div>
    )
};
export default Home;



