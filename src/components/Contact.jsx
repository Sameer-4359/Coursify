import React from "react";
import Menu from "./Menu";
import Footer from "./Footer";
import "../componentscss/contact.css";



const ContactUs = () => {
  return (
    <div>
      <Menu />
      <div className="contact-section">
        <div className="contactBanner">
          <div className="leftpart">
              <h1>Contact Us</h1>
              <p>Have a question or want to get in touch? We'd love to hear from you.</p>
          </div>
          <div className="Rigthpart">
            <img src="/images/contactus.jpg" alt="Contact Us" className="contact-image" />
          </div>
        </div>
        <div className="aboutheadline"  ><p>Check out our latest company news!</p></div>
        <div className="contact-container">
          <div className="contact-content">
            <form className="contact-form">
              <input type="text" placeholder="Your Name" required />
              <input type="email" placeholder="Your Email" required />
              <input type="text" placeholder="Subject" />
              <textarea rows="5" placeholder="Your Message" required />
              <button type="submit">Send Message</button>
            </form>

            <div className="contact-info">
              <h3>Reach us at</h3>
              <p><strong>Email:</strong> support@coursify.com</p>
              <p><strong>Phone:</strong> +92 322 1234567</p>
              <p><strong>Location:</strong> NUCES-FAST, Karachi, Pakistan</p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ContactUs;