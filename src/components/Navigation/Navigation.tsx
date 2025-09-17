import { useState } from 'react';
import { Link } from 'react-router-dom';
import './Navigation.css';

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  return (
    <nav className="navigation">
      <button
        className={`burger-menu ${isOpen ? 'open' : ''}`}
        onClick={toggleMenu}
        aria-label="Toggle navigation menu"
      >
        <span></span>
        <span></span>
        <span></span>
      </button>

      <div className={`navigation-menu ${isOpen ? 'open' : ''}`}>
        <Link to="/" onClick={closeMenu}>Home</Link>
        <Link to="/about" onClick={closeMenu}>About</Link>
        <Link to="/services" onClick={closeMenu}>Services</Link>
        <Link to="/contact" onClick={closeMenu}>Contact</Link>
        <Link to="/news" onClick={closeMenu}>News</Link>
      </div>

      {isOpen && <div className="navigation-overlay" onClick={closeMenu}></div>}
    </nav>
  );
};

export default Navigation;