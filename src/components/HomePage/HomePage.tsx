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
      {/* Header with hamburger menu */}
      <header className={styles.header}>
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
      </header>

      {/* Hero section with large image and church name */}
      <main className={styles.heroSection}>
        <div className={styles.heroImage}>
          <div className={styles.heroOverlay}>
            <h1 className={styles.churchName} data-testid="church-name">
              Sankt Nikolaj Kirke
            </h1>
          </div>
        </div>
      </main>
    </div>
  );
};

export default HomePage;