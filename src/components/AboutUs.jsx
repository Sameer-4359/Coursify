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
              At Coursify, our mission is to provide a structured and interactive learning environment with assignments, quizzes, and progress tracking, ensuring seamless online education.
            </p>
          </div>
          <div>
          <h2 className="section-title">Our Values</h2>
          <ul className="section-list">
            <li>📚 Quality Education</li>
            <li>💡 Innovation in Learning</li>
            <li>🤝 Inclusivity & Accessibility</li>
            <li>🔒 Secure & Reliable Platform</li>
          </ul>
          </div>

          <div>
          <h2 className="section-title">Our Goals</h2>
          <ul className="section-list">
            <li>✅ Enable easy course creation & enrollment.</li>
            <li>✅ Provide advanced student progress tracking.</li>
            <li>✅ Implement gamification to enhance learning.</li>
            <li>✅ Support multi-language and captioned video lectures.</li>
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
