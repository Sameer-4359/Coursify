import React, { useState, useEffect } from "react";
import Menu from "./Menu";
import Footer from "./Footer";
import "../componentscss/aboutus.css";

const AboutUs = () => {
  const teamMembers = [
    {
      name: "Amna Mubashir",
      email: "amnahere40@gmail.com",
      role: "Database, SRS & Testing",
      image: "amna.jpg",
    },
    {
      name: "Shaheer Mustafa Awan",
      email: "shaheerhere40@gmail.com",
      role: "Frontend Development, UI/UX",
      image: "/images/shaheer.png",
    },
    {
      name: "Sameer Sohail",
      email: "sameerhere40@gmail.com",
      role: "Team Leader, Backend Development",
      image: "sameer.jpg",
    },
  ];
  const coreValues = [
    {
      title: "Excellence in Education",
      description: "Delivering high-quality, impactful learning experiences.",
      image: "/images/quality.png",
    },
    {
      title: "Innovation",
      description: "Continuously evolving to meet modern educational needs.",
      image: "/images/innovation2.jpg",
    },
    {
      title: "Inclusivity",
      description: "Ensuring access and opportunity for all learners.",
      image: "/images/innovation.jpg",
    },
    {
      title: "Trust & Security",
      description: "Providing a reliable and secure digital environment.",
      image: "/images/security.jpg",
    },
  ];

  const [current, setCurrent] = useState(0);

  // Auto-slide every 4 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % coreValues.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const goToSlide = (index) => {
    setCurrent(index);
  };
  

  return (
    <div className="aboutusPage">
      <Menu />
      <div className="page-container">
        <div className="aboutBanner">
          <div className="leftArea">
            <header className="header-container">
              <h1 className="title">Welcome to Where possibilities begins</h1>
              <p className="subtitle">Empowering learning through technology.</p>
            </header>
          </div>
          <div className="RigthArea">
            <div style={{ backgroundImage: `url('https://about.udemy.com/wp-content/uploads/2024/02/about-homepage-hero-jan-2024.png')` }}>
            </div>
          </div>
        </div>
      <div className="headline"  ><p>Check out our latest company news!</p></div>

      <div className="mission-section">
      <h2 className="headings">Our Mission</h2>
        <div className="mission-images">
          <img src="/images/mission4.png" alt="Coursify Team 1" className="mission-img top-img" />
          <img src="/images/mission2.jpg" alt="Coursify Team 2" className="mission-img middle-img" />
          <img src="/images/mission3.jpg" alt="Coursify Team 3" className="mission-img bottom-img" />
        </div>
        <div className="mission-content">
          <h2>Empowering Learning, Everywhere</h2>
          <p>
            At Coursify, our mission is to make quality education accessible to all. 
            We believe in breaking barriers through technology—helping learners and educators 
            connect from anywhere in the world. Every feature we build centers around enabling 
            growth, inclusivity, and lifelong learning.
          </p>
        </div>
      </div>

      <section className="core-values-section">
      <h2 className="headings">Our Core Values</h2>
      <div className="slider-container">
        <div
          className="slider-track"
          style={{ transform: `translateX(-${current * 100}%)` }}
        >
          {coreValues.map((value, index) => (
            <div className="slide" key={index}>
            <div className="slide-content">
              <img src={value.image} alt={value.title} className="slide-image" />
              <div className="slide-text">
                <h3>{value.title}</h3>
                <p>{value.description}</p>
              </div>
            </div>
          </div>
          
          ))}
        </div>
        <div className="dots">
          {coreValues.map((_, index) => (
            <span
              key={index}
              className={`dot ${index === current ? "active" : ""}`}
              onClick={() => goToSlide(index)}
            />
          ))}
        </div>
      </div>
    </section>

        <section className="team-container">
          <h2 className="headings">Meet Our Team</h2>
          <div className="team-grid">
            {teamMembers.map((member) => (
              <div key={member.email} className="team-card">
                <img
                  src={member.image}
                  alt={member.name}
                  className="team-image"
                />
                <h3 className="team-name">{member.name}</h3>
                <p className="team-role">{member.role}</p>
                <p className="team-email">{member.email}</p>
              </div>
            ))}
          </div>
        </section>
        </div>
      <Footer />
    </div>
  );
};

export default AboutUs;