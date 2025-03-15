import React from "react";

const AboutUs = () => {
  const teamMembers = [
    {
      name: "Amna Mubashir",
      email: "amnahere40@gmail.com",
      role: "Database, SRS & Testing",
      image: "amna.jpg", // Replace with actual image paths
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
    <div className="bg-gray-100 min-h-screen">
      <header className="bg-blue-600 text-white py-6 text-center">
        <h1 className="text-4xl font-bold">About Coursify</h1>
        <p className="mt-2">Empowering learning through technology.</p>
      </header>

      <section className="max-w-4xl mx-auto mt-10 px-4">
        <h2 className="text-3xl font-semibold text-center mb-6">Our Mission</h2>
        <p className="text-gray-700 text-center">
          At Coursify, our mission is to provide a structured and interactive learning environment with assignments, quizzes, and progress tracking, ensuring seamless online education.
        </p>

        <h2 className="text-3xl font-semibold text-center mt-10">Our Values</h2>
        <ul className="text-gray-700 text-center mt-4">
          <li>📚 Quality Education</li>
          <li>💡 Innovation in Learning</li>
          <li>🤝 Inclusivity & Accessibility</li>
          <li>🔒 Secure & Reliable Platform</li>
        </ul>

        <h2 className="text-3xl font-semibold text-center mt-10">Our Goals</h2>
        <ul className="text-gray-700 text-center mt-4">
          <li>✅ Enable easy course creation & enrollment.</li>
          <li>✅ Provide advanced student progress tracking.</li>
          <li>✅ Implement gamification to enhance learning.</li>
          <li>✅ Support multi-language and captioned video lectures.</li>
        </ul>
      </section>

      <section className="max-w-5xl mx-auto mt-16 px-4">
        <h2 className="text-3xl font-semibold text-center mb-6">Meet Our Team</h2>
        <div className="grid md:grid-cols-3 gap-6 text-center">
          {teamMembers.map((member) => (
            <div key={member.email} className="bg-white shadow-md rounded-lg p-6">
              <img
                src={member.image}
                alt={member.name}
                className="w-32 h-32 mx-auto rounded-full object-cover"
              />
              <h3 className="text-xl font-semibold mt-4">{member.name}</h3>
              <p className="text-gray-600">{member.role}</p>
              <p className="text-blue-600">{member.email}</p>
            </div>
          ))}
        </div>
      </section>

      <footer className="bg-blue-600 text-white text-center py-6 mt-16">
        <p>&copy; 2025 Coursify. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default AboutUs;
