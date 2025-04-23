import React from "react";
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
      image: "shaheer.jpg",
    },
    {
      name: "Sameer Sohail",
      email: "sameerhere40@gmail.com",
      role: "Team Leader, Backend Development",
      image: "sameer.jpg",
    },
  ];

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

        <div>
          <section className="section-container">
            <div>
              <h2 className="section-title">Our Mission</h2>
              <p className="section-text">
                Coursify is committed to transforming education through structured, interactive, and accessible digital learning. Our mission is to empower learners and educators by providing a seamless platform for course delivery, assessments, and performance tracking.
              </p>
            </div>

            <div>
              <h2 className="section-title">Our Core Values</h2>
              <ul className="section-list">
                <li><strong>Excellence in Education</strong> — Delivering high-quality, impactful learning experiences.</li>
                <li><strong>Innovation</strong> — Continuously evolving to meet modern educational needs.</li>
                <li><strong>Inclusivity</strong> — Ensuring access and opportunity for all learners.</li>
                <li><strong>Trust & Security</strong> — Providing a reliable and secure digital environment.</li>
              </ul>
            </div>

            <div>
              <h2 className="section-title">Our Strategic Goals</h2>
              <ul className="section-list">
                <li>Facilitate intuitive course creation and seamless enrollment processes.</li>
                <li>Enable detailed analytics for tracking learner progress and performance.</li>
                <li>Incorporate gamified learning experiences to boost engagement and retention.</li>
                <li>Support diverse learning needs through multilingual content and accessible video formats.</li>
              </ul>
            </div>


          </section>

          <section className="team-container">
            <h2 className="section-title">Meet Our Team</h2>
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
      </div>
      <Footer />
    </div>
  );
};

export default AboutUs;