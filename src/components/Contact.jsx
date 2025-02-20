import React from "react";

function ContactPage() {
  return (
    <div className="contactPage">
      <div className="headerSection">
        <h1>Get in Touch</h1>
        <p>
          We’re here to answer any questions you may have. Reach out to us, and
          we’ll respond as soon as we can.
        </p>
      </div>
      <div className="contactContainer">
        <div className="contactInfo">
          <h2>Contact Us</h2>
          <div className="contactDetails">
            <p>
              <i className="fas fa-map-marker-alt"></i> karachi, Pakistan
            </p>
            <p>
              <i className="fas fa-envelope"></i> contact@coursify.com
            </p>
            <p>
              <i className="fas fa-phone"></i> +92 3220212783
            </p>
          </div>
          <h4>Keep in Touch</h4>
          <div className="socialIcons">
            <i className="fab fa-facebook-f"></i>
            <i className="fab fa-twitter"></i>
            <i className="fab fa-pinterest"></i>
            <i className="fab fa-youtube"></i>
          </div>
          <div className="map">
            <iframe
              title="Google Maps"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3021.970783958644!2d-73.99371622426904!3d40.7388781160004!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c259af4db24cb9%3A0x3a9b8b5f8422d3e9!2s123%205th%20Ave%2C%20New%20York%2C%20NY%2010011%2C%20USA!5e0!3m2!1sen!2s!4v1679072512423!5m2!1sen!2s"
              width="100%"
              height="200"
              allowFullScreen=""
              loading="lazy"
            ></iframe>
          </div>
        </div>
        <div className="contactForm">
          <h2>Have Any Questions?</h2>
          <p>Feel free to ask here</p>
          <form>
            <input type="text" placeholder="Name" required />
            <input type="email" placeholder="Email" required />
            <input type="text" placeholder="Subject" required />
            <textarea
              placeholder="I would like to ask about..."
              required
            ></textarea>
            <button type="submit">Send Message</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ContactPage;
