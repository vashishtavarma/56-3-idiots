import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { logout } from '../Constants';
import EduTubeLogo from './EduTubeLogo';
import { getAuthToken } from '../api/journeys';
import { useTheme } from '../contexts/ThemeContext';

/**
 * Profile icon (user avatar) for header - used to open dropdown with Dashboard & Logout.
 */
const ProfileIcon = ({ className = '' }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" aria-hidden>
    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
  </svg>
);

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [navOpen, setNavOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef(null);
  const { isDark, toggleTheme } = useTheme();
  const isAuthPage = location.pathname === '/auth';
  const isSignupPage = location.pathname === '/signup';
  const isAuthOrSignupPage = isAuthPage || isSignupPage;
  const isLoggedIn = !!getAuthToken();

  const handleLogout = () => {
    logout();
    setProfileOpen(false);
    navigate('/auth');
  };

  // Close profile dropdown when clicking outside
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

  const navLinkBase =
    'block py-2.5 px-3 rounded-md lg:rounded-md font-medium text-sm text-foreground/90 border-b border-border lg:border-0 hover:bg-accent hover:text-accent-foreground lg:hover:bg-transparent lg:py-1.5 lg:px-0 transition-colors hover:text-foreground';
  const navLinkActive = 'bg-primary text-primary-foreground lg:bg-transparent lg:text-primary';

  return (
    <header className="sticky top-0 z-50">
      <nav
        className={`border-b border-border text-card-foreground ${
          isAuthOrSignupPage
            ? 'auth-page-gradient'
            : 'bg-card shadow-sm border-border/80'
        }`}
      >
        <div className="flex flex-wrap justify-between items-center gap-4 mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8 py-3 min-h-[3.25rem]">
          {/* Logo */}
          <EduTubeLogo className="flex items-center flex-shrink-0 order-1" />

          {/* Main nav: Home, Explore (and Sign in when logged out). Hidden on login/signup pages. */}
          {!isAuthOrSignupPage && (
            <div
              className={`${navOpen ? 'flex' : 'hidden'} flex-col w-full lg:flex lg:flex-row lg:items-center lg:flex-1 lg:justify-center lg:order-2 order-3 lg:min-w-0`}
              id="main-nav"
            >
              <ul className="flex flex-col mt-2 font-medium lg:flex-row lg:items-center lg:gap-6 lg:mt-0 lg:py-0">
                <li>
                  <Link
                    to="/"
                    className={`${navLinkBase} ${location.pathname === '/' ? navLinkActive : ''}`}
                    aria-current={location.pathname === '/' ? 'page' : undefined}
                    onClick={() => setNavOpen(false)}
                  >
                    Home
                  </Link>
                </li>
                <li>
                  <Link
                    to="/explore"
                    className={`${navLinkBase} ${location.pathname === '/explore' ? navLinkActive : ''}`}
                    onClick={() => setNavOpen(false)}
                  >
                    Explore
                  </Link>
                </li>
                {!isLoggedIn && (
                  <li>
                    <Link
                      to="/auth"
                      className={navLinkBase}
                      onClick={() => setNavOpen(false)}
                    >
                      Sign in
                    </Link>
                  </li>
                )}
              </ul>
            </div>
          )}

          {/* Right: theme toggle + profile dropdown (when logged in) */}
          <div className="flex items-center gap-0.5 order-2 lg:order-3">
            <button
              type="button"
              onClick={toggleTheme}
              className="p-2.5 text-muted-foreground rounded-lg hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-0 transition-colors inline-flex items-center justify-center"
              aria-label="Toggle theme"
            >
              {isDark ? (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path
                    fillRule="evenodd"
                    d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
                    clipRule="evenodd"
                  />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                </svg>
              )}
            </button>

            {isLoggedIn && (
              <div className="relative" ref={profileRef}>
                <button
                  type="button"
                  onClick={() => setProfileOpen((o) => !o)}
                  className="p-2.5 text-muted-foreground rounded-lg hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-0 transition-colors inline-flex items-center justify-center"
                  aria-label="Profile menu"
                  aria-expanded={profileOpen}
                  aria-haspopup="true"
                >
                  <ProfileIcon className="w-5 h-5" />
                </button>
                {profileOpen && (
                  <div
                    className="absolute right-0 mt-1 w-44 rounded-lg border border-border bg-card py-1 shadow-lg z-50"
                    role="menu"
                  >
                    <Link
                      to="/profile"
                      role="menuitem"
                      className="flex items-center gap-2 px-4 py-2.5 text-sm text-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
                      onClick={() => setProfileOpen(false)}
                    >
                      <svg className="w-4 h-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                      </svg>
                      Dashboard
                    </Link>
                    <button
                      type="button"
                      role="menuitem"
                      onClick={handleLogout}
                      className="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-destructive hover:bg-destructive/10 transition-colors text-left"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      Logout
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Mobile menu toggle – hidden on login/signup (no nav items to show) */}
            {!isAuthOrSignupPage && (
              <button
                type="button"
                onClick={() => setNavOpen((o) => !o)}
                className="inline-flex items-center justify-center p-2.5 rounded-lg lg:hidden text-muted-foreground hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-0 min-w-[2.75rem] min-h-[2.75rem]"
                aria-controls="main-nav"
                aria-expanded={navOpen}
                aria-label="Toggle menu"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path
                    fillRule="evenodd"
                    d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
