import React from "react";
import Menu from "./Menu.jsx";
import Footer from "./Footer.jsx";
import Banner from "./Banner.jsx";
import Slider from "./Slider.jsx";
import Community from "./Community.jsx";
import Experience from "./Experience.jsx";
import ChooseUs from "./ChooseUs.jsx";
import "../componentscss/home.css";


function Home(){
    return (
        <div>
            <header><Menu /></header>
            <main>
            <Banner image={'https://aroomat.com/wp-content/uploads/2025/04/banner.png'}/>
            <Slider />
            <Experience />
            <ChooseUs />
            <Community />
            </main>
            <footer><Footer /></footer>
        </div>
    )
};
export default Home;



