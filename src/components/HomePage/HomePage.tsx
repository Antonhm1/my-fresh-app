import { useState } from 'react';
import type { UserRole } from '../../types/auth';
import styles from './HomePage.module.css';

interface HomePageProps {
  userRole: UserRole;
  onLogout: () => void;
}

const HomePage = ({ userRole, onLogout }: HomePageProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className={styles.container}>
      {/* Floating hamburger menu */}
      <button
        className={styles.hamburger}
        onClick={toggleMenu}
        aria-label="Menu"
        data-testid="hamburger-menu"
      >
        <span className={styles.hamburgerLine}></span>
        <span className={styles.hamburgerLine}></span>
        <span className={styles.hamburgerLine}></span>
      </button>

      {/* Mobile menu overlay */}
      {isMenuOpen && (
        <nav className={styles.mobileMenu} data-testid="mobile-menu">
          <ul className={styles.menuList}>
            <li className={styles.menuItem}>
              <span className={styles.userRole}>
                {userRole === 'user' ? 'Bruger' : 'Administrator'}
              </span>
            </li>
            <li className={styles.menuItem}>
              <button
                onClick={onLogout}
                className={styles.logoutButton}
                data-testid="logout-button"
              >
                Log ud
              </button>
            </li>
          </ul>
        </nav>
      )}

      {/* Hero section with split layout */}
      <main className={styles.heroSection}>
        <div className={styles.heroImage}>
          {/* Church name positioned in hero */}
          <h1 className={styles.churchName} data-testid="church-name">
            Gislev & Ellested Kirker
          </h1>

          {/* Decorative SVG overlay */}
          <div className={styles.decorativeOverlay}>
            <svg className={styles.decorativeSVG} viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M100 200 Q150 150, 200 200 T300 200" stroke="white" strokeWidth="3" fill="none" opacity="0.7"/>
              <path d="M120 180 Q170 130, 220 180 T320 180" stroke="white" strokeWidth="2" fill="none" opacity="0.5"/>
              <circle cx="200" cy="200" r="40" stroke="white" strokeWidth="2" fill="none" opacity="0.6"/>
              <path d="M180 220 L200 200 L220 220 M200 200 L200 180" stroke="white" strokeWidth="2" opacity="0.6"/>
            </svg>
          </div>
        </div>

        <div className={styles.contentCard}>
          <h2 className={styles.eventTitle}>Hvælving koncert</h2>
          <p className={styles.eventDescription}>
            Oplev asdifs sa fast 3fsf kasif xcjkaebiz c asofa efwlancjkasnfiafxkens wi a asjfbue aye bxfcysaf auwfwf
          </p>
          <div className={styles.eventDetails}>
            <div className={styles.eventInfo}>
              <span className={styles.eventDate}>30 September</span>
            </div>
            <div className={styles.eventMeta}>
              <div className={styles.locationInfo}>
                <span className={styles.locationIcon">📍</span>
                <span className={styles.locationText}>Gislev kirke</span>
              </div>
              <div className={styles.timeInfo}>
                <span className={styles.timeIcon}>🕐</span>
                <span className={styles.timeText}>13:00</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default HomePage;