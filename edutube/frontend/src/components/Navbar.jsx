import React, { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { applogo, logout, token } from '../Constants'
import { getAuthToken } from '../Api/journeys';
import { useTheme } from '../contexts/ThemeContext';

const Navbar = () => {
    const navigate  = useNavigate();
    const [navlinks,setNavlinks] = useState(false);
    const { isDark, toggleTheme } = useTheme();
    
    const handleLogout = ()=>{
        logout();
        navigate('/auth')
    }

    const togglenav = ()=>{
        setNavlinks(!navlinks)
    }

  return (
    <header>

    <nav className="bg-card border-border border-b px-4 lg:px-6 py-2.5 text-card-foreground">
        <div className="flex flex-wrap justify-between items-center mx-auto max-w-screen-xl">
            <Link  to="/" className="flex items-center">
                <img src={applogo} className="mr-3 h-6 sm:h-9" alt="EduTube Logo" />
                <span className="self-center text-xl font-semibold whitespace-nowrap text-foreground">EduTube</span>
            </Link>
            {/* Nav menu (Home, Explore, Profile, Logout): only when logged in */}
              {getAuthToken() && (
                <div className={`${navlinks ? '' : 'hidden'} justify-between items-center w-full lg:flex lg:w-auto lg:order-1`} id="mobile-menu-2">
                  <ul className="flex flex-col mt-4 font-medium lg:flex-row lg:space-x-8 lg:mt-0">
                    <li>
                      <Link to="/" className="block py-2 pr-4 pl-3 rounded bg-primary text-primary-foreground hover:bg-primary/90 lg:bg-transparent lg:text-foreground lg:p-0 lg:hover:text-primary" aria-current="page">Home</Link>
                    </li>
                    <li>
                      <Link to="/explore" className="block py-2 pr-4 pl-3 text-foreground border-b border-border hover:bg-accent hover:text-accent-foreground lg:hover:bg-transparent lg:border-0 lg:p-0">Explore</Link>
                    </li>
                    <li>
                      <Link to="/profile" className="block py-2 pr-4 pl-3 text-foreground border-b border-border hover:bg-accent hover:text-accent-foreground lg:hover:bg-transparent lg:border-0 lg:p-0">Profile</Link>
                    </li>
                    <li>
                      <button onClick={handleLogout} type="button" className="block py-1 pr-4 pl-3 text-destructive border-b border-border hover:bg-destructive/20 lg:hover:bg-transparent lg:border-0 lg:p-0 rounded-md font-medium">Logout</button>
                    </li>
                  </ul>
                </div>
              )}
            <div className="flex items-center lg:order-2">
              {/* Theme Toggle Button */}
              <button 
                onClick={toggleTheme}
                className="p-2 mr-2 text-sm text-muted-foreground rounded-lg hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                aria-label="Toggle theme"
              >
                {isDark ? (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                  </svg>
                )}
              </button>
              {/* Mobile menu button: only when logged in */}
              {getAuthToken() && (
                <button data-collapse-toggle="mobile-menu-2" onClick={togglenav} type="button" className="inline-flex items-center p-2 ml-1 text-sm text-muted-foreground rounded-lg lg:hidden hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-ring" aria-controls="mobile-menu-2" aria-expanded="false">
                  <span className="sr-only">Open main menu</span>
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd"></path></svg>
                  <svg className="hidden w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
                </button>
              )}
            </div>
        </div>
    </nav>
    </header>

  )
}

export default Navbar
