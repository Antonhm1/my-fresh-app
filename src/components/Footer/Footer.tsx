import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-content">
          <div className="footer-section">
            <h3>Gislev Kirke</h3>
            <p>Et sted for tilbedelse, fællesskab og tro i hjertet af Gislev.</p>
          </div>

          <div className="footer-section">
            <h4>Kontakt</h4>
            <p>📍 Kirkevej 12, 5471 Gislev</p>
            <p>📞 +45 12 34 56 78</p>
            <p>✉️ info@gislevkirke.dk</p>
          </div>

          <div className="footer-section">
            <h4>Gudstjenestetider</h4>
            <p>Søndagsgudstjeneste: 10:00</p>
            <p>Bibelstudium: Onsdag 19:00</p>
            <p>Ungdomsgruppe: Fredag 16:00</p>
          </div>

          <div className="footer-section">
            <h4>Følg Os</h4>
            <div className="footer-social">
              <a href="#" className="social-link">Facebook</a>
              <a href="#" className="social-link">Instagram</a>
              <a href="#" className="social-link">YouTube</a>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; 2024 Gislev Kirke. Alle rettigheder forbeholdes.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;