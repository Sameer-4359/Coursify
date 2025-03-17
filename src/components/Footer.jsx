import React from "react";
import "../componentscss/footer.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFacebook,
  faTwitter,
  faInstagram,
} from "@fortawesome/free-brands-svg-icons";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";

function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="row">
          <div className="footerCol">
            <h4>Company</h4>
            <ul>
              <li>
                <a href="">About us</a>
              </li>
              <li>
                <a href="">Our service</a>
              </li>
              <li>
                <a href="">Privacy policy</a>
              </li>
            </ul>
          </div>

          <div className="footerCol">
            <h4>Get help</h4>
            <ul>
              <li>
                <a href="">FAQ</a>
              </li>
              <li>
                <a href="">Guide</a>
              </li>
              <li>
                <a href="">Report a problem</a>
              </li>
            </ul>
          </div>

          <div className="footerCol">
            <h4>Our platform</h4>
            <ul>
              <li>
                <a href="">Get the app</a>
              </li>
              <li>
                <a href="">Become an instructor</a>
              </li>
              <li>
                <a href="">Blogs</a>
              </li>
            </ul>
          </div>

          <div className="footerCol">
            <h4>Follow us</h4>
            <div className="SocialLinks">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FontAwesomeIcon icon={faFacebook} size="2x" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FontAwesomeIcon icon={faInstagram} size="2x" />
              </a>
              <a href="mailto:info@example.com">
                <FontAwesomeIcon icon={faEnvelope} size="2x" />
              </a>

              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FontAwesomeIcon icon={faTwitter} size="2x" />
              </a>
            </div>
          </div>
        </div>
      </div>
      <hr />
      <div className="copyright"><p>&copy; 2025 Coursify. All rights reserved.</p></div>
      
    </footer>
  );
}
export default Footer;
