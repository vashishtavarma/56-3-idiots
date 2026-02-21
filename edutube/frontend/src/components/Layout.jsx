import { useState, useRef, useEffect } from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import EduTubeLogo from './EduTubeLogo';
import styles from './Layout.module.css';

/**
 * Profile icon for header dropdown (Dashboard & Logout).
 */
const ProfileIcon = ({ className = '' }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" aria-hidden>
    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
  </svg>
);

export default function Layout() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef(null);
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';

  const toggleTheme = () => {
    const next = isDark ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    };
    if (profileOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [profileOpen]);

  return (
    <div className={styles.wrapper}>
      <header className={styles.header}>
        <EduTubeLogo className={styles.logo} />
        <div className={styles.headerRight}>
          <button
            type="button"
            className={styles.iconBtn}
            onClick={toggleTheme}
            aria-label="Toggle theme"
          >
            {isDark ? '☀️' : '🌙'}
          </button>
          {user && (
            <div className={styles.profileWrap} ref={profileRef}>
              <button
                type="button"
                className={styles.iconBtn}
                onClick={() => setProfileOpen((o) => !o)}
                aria-label="Profile menu"
                aria-expanded={profileOpen}
                aria-haspopup="true"
              >
                <ProfileIcon className={styles.profileIcon} />
              </button>
              {profileOpen && (
                <div className={styles.dropdown} role="menu">
                  <Link
                    to="/profile"
                    role="menuitem"
                    className={styles.dropdownItem}
                    onClick={() => setProfileOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <button
                    type="button"
                    role="menuitem"
                    className={styles.dropdownItemLogout}
                    onClick={() => {
                      setProfileOpen(false);
                      logout();
                    }}
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}
          <nav className={styles.nav}>
            <Link to="/" className={location.pathname === '/' ? styles.active : ''}>
              Home
            </Link>
            <Link to="/explore" className={location.pathname === '/explore' ? styles.active : ''}>
              Explore
            </Link>
            {!user && <Link to="/auth">Sign in</Link>}
          </nav>
        </div>
      </header>
      <main className={styles.main}>
        <Outlet />
      </main>
      <footer className={styles.footer}>
        <p>© {new Date().getFullYear()} EduTube. All rights reserved.</p>
      </footer>
    </div>
  );
}
