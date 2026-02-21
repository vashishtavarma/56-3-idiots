import { Link, useLocation, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import styles from './Layout.module.css';

export default function Layout() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';

  const toggleTheme = () => {
    const next = isDark ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
  };

  return (
    <div className={styles.wrapper}>
      <header className={styles.header}>
        <Link to="/" className={styles.logo}>
          <span className={styles.logoIcon}>◇</span>
          Edutube
        </Link>
        <div className={styles.headerRight}>
          <button
            type="button"
            className={styles.iconBtn}
            onClick={toggleTheme}
            aria-label="Toggle theme"
          >
            {isDark ? '☀️' : '🌙'}
          </button>
          <nav className={styles.nav}>
            <Link to="/" className={location.pathname === '/' ? styles.active : ''}>Home</Link>
            <Link to="/explore" className={location.pathname === '/explore' ? styles.active : ''}>Explore</Link>
            {user ? (
              <>
                <Link to="/profile" className={location.pathname === '/profile' ? styles.active : ''}>Profile</Link>
                <button type="button" className={styles.logoutBtn} onClick={logout}>Sign out</button>
              </>
            ) : (
              <Link to="/auth">Sign in</Link>
            )}
          </nav>
        </div>
      </header>
      <main className={styles.main}><Outlet /></main>
      <footer className={styles.footer}>
        <p>© {new Date().getFullYear()} EduTube. All rights reserved.</p>
      </footer>
    </div>
  );
}
