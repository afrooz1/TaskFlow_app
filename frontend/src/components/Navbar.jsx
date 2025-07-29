import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Profile from './Profile';

const Navbar = () => {
  const [user, setUser] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

useEffect(() => {
  const syncUser = () => {
    setUser(JSON.parse(localStorage.getItem('user')));
  };

  // Set initial user
  syncUser();

  // Listen for both storage change (other tabs) and custom event (same tab)
  window.addEventListener('storage', syncUser);
  window.addEventListener('userChanged', syncUser); // 👈 custom event

  return () => {
    window.removeEventListener('storage', syncUser);
    window.removeEventListener('userChanged', syncUser);
  };
}, []);


  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="bg-cyber-blue-600 text-white px-4 sm:px-6 py-3 shadow-md flex justify-between items-center fixed top-0 left-0 right-0 z-50">
      {/* App name/logo */}
      <div
        onClick={() => navigate('/')}
        className="text-xl font-bold tracking-wide cursor-pointer flex items-center gap-1"
      >
        <span className="text-2xl">🧠</span>
        <span className="hidden sm:inline">TaskFlow</span>
        <span className="hidden xs:inline text-sm bg-white text-cyber-blue-600 px-2 py-0.5 rounded-full ml-2">
          Smart Tasks
        </span>
      </div>

      {/* Mobile menu button */}
      <div className="md:hidden flex items-center">
        <button
          onClick={toggleMenu}
          className="text-white focus:outline-none"
          aria-label="Toggle menu"
        >
          {isMenuOpen ? (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {/* Desktop Navigation links */}
      <div className="hidden md:flex items-center gap-6">
        {user ? (
          <>
            <Link 
              to="/" 
              className="text-gray-200 hover:text-white transition-colors duration-200 hover:scale-105"
            >
              Home
            </Link>
            <Link 
              to="/dashboard" 
              className="text-gray-200 hover:text-white transition-colors duration-200 hover:scale-105"
            >
              Dashboard
            </Link>
            <Link 
              to="/tasks" 
              className="text-gray-200 hover:text-white transition-colors duration-200 hover:scale-105"
            >
              Tasks
            </Link>
            <Profile />
          </>
        ) : (
          <>
            <Link 
              to="/login" 
              className="text-gray-200 hover:text-white transition-colors duration-200 hover:scale-105"
            >
              Login
            </Link>
            <Link 
              to="/register" 
              className="bg-cyber-blue-500 hover:bg-cyber-blue-700 text-white px-4 py-2 rounded-lg transition-colors duration-200 hover:scale-105 shadow-md"
            >
              Register
            </Link>
          </>
        )}
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-16 left-0 right-0 bg-cyber-blue-700 shadow-lg py-4 px-6 flex flex-col items-center space-y-4 animate-fadeIn">
          {user ? (
            <>
              <Link 
                to="/" 
                className="w-full text-center py-2 text-gray-200 hover:text-white transition-colors duration-200 border-b border-cyber-blue-500"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link 
                to="/dashboard" 
                className="w-full text-center py-2 text-gray-200 hover:text-white transition-colors duration-200 border-b border-cyber-blue-500"
                onClick={() => setIsMenuOpen(false)}
              >
                Dashboard
              </Link>
              <Link 
                to="/tasks" 
                className="w-full text-center py-2 text-gray-200 hover:text-white transition-colors duration-200 border-b border-cyber-blue-500"
                onClick={() => setIsMenuOpen(false)}
              >
                Tasks
              </Link>
              <div className="w-full pt-2 border-t border-cyber-blue-500">
                <Profile mobileView={true} onCloseMenu={() => setIsMenuOpen(false)} />
              </div>
            </>
          ) : (
            <>
              <Link 
                to="/login" 
                className="w-full text-center py-2 text-gray-200 hover:text-white transition-colors duration-200 border-b border-cyber-blue-500"
                onClick={() => setIsMenuOpen(false)}
              >
                Login
              </Link>
              <Link 
                to="/register" 
                className="w-full text-center bg-cyber-blue-500 hover:bg-cyber-blue-600 text-white py-2 rounded-lg transition-colors duration-200 shadow-md"
                onClick={() => setIsMenuOpen(false)}
              >
                Register
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;