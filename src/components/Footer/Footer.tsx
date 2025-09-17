import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-content">
          <div className="footer-section">
            <h3>Gislev Kirke</h3>
            <p>A place of worship, community, and faith in the heart of Gislev.</p>
          </div>

          <div className="footer-section">
            <h4>Contact</h4>
            <p>📍 Kirkevej 12, 5471 Gislev</p>
            <p>📞 +45 12 34 56 78</p>
            <p>✉️ info@gislevkirke.dk</p>
          </div>

          <div className="footer-section">
            <h4>Service Times</h4>
            <p>Sunday Service: 10:00 AM</p>
            <p>Bible Study: Wednesday 7:00 PM</p>
            <p>Youth Group: Friday 4:00 PM</p>
          </div>

          <div className="footer-section">
            <h4>Follow Us</h4>
            <div className="footer-social">
              <a href="#" className="social-link">Facebook</a>
              <a href="#" className="social-link">Instagram</a>
              <a href="#" className="social-link">YouTube</a>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; 2024 Gislev Kirke. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;