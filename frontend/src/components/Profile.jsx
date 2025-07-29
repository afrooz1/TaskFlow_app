import React, { useState, useRef, useEffect } from 'react';

const getInitials = (name) => {
  return name
    ?.split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase();
};

const Profile = ({ mobileView = false, onCloseMenu = () => {} }) => {
  const [showMenu, setShowMenu] = useState(false);
  const user = JSON.parse(localStorage.getItem("user"));
  const initials = getInitials(user?.name);
  const dropdownRef = useRef(null);

  // Truncate long names and emails for mobile
  const displayName = user?.name ? 
    mobileView && user.name.length > 12 ? `${user.name.substring(0, 10)}...` : user.name
    : '';

  const displayEmail = user?.email ? 
    mobileView && user.email.length > 20 ? `${user.email.substring(0, 18)}...` : user.email
    : '';

  const handleLogout = () => {
    localStorage.removeItem("user");
    onCloseMenu();
    window.location.href = "/login";
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleMenu = () => {
    setShowMenu(prev => !prev);
  };

  return (
    <div className={`relative ${mobileView ? 'w-full' : ''}`} ref={dropdownRef}>
      {mobileView ? (
        // Mobile View
        <div className="w-full">
          <button
            className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-cyber-blue-500 transition-colors"
            onClick={toggleMenu}
            aria-expanded={showMenu}
          >
            <div className="w-10 h-10 bg-white text-cyber-blue-600 rounded-full flex items-center justify-center text-lg font-bold shadow">
              {initials}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-white truncate capitalize" title={user?.name}>
                {displayName}
              </p>
              <p className="text-xs text-gray-200 truncate" title={user?.email}>
                {displayEmail}
              </p>
            </div>
            <svg
              className={`w-4 h-4 text-white transform transition-transform ${showMenu ? "rotate-180" : ""}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {showMenu && (
            <div className="w-full bg-cyber-blue-700 animate-fade-in">
              <div className="px-4 py-3 border-t border-cyber-blue-500">
                <p className="text-xs text-gray-300">Logged in as:</p>
                <p className="text-sm font-medium text-white truncate" title={user?.email}>
  {displayEmail}
</p>
              </div>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2 px-4 py-3 text-white hover:bg-cyber-blue-600 transition-colors text-left"
              >
                <span>🚪</span>
                <span>Log Out</span>
              </button>
            </div>
          )}
        </div>
      ) : (
        // Desktop View
        <>
          <div
            className="flex items-center gap-3 bg-white text-cyber-blue-600 rounded-full px-4 py-2 cursor-pointer shadow hover:shadow-lg transition-all duration-200"
            onClick={toggleMenu}
            aria-expanded={showMenu}
          >
            <div className="w-10 h-10 bg-cyber-blue-600 text-white rounded-full flex items-center justify-center text-lg font-bold shadow">
              {initials}
            </div>
            <div className="hidden md:flex flex-col min-w-0">
              <span className="font-medium capitalize truncate" title={user?.name}>
                {user?.name}
              </span>
              {/* <span className="text-xs text-gray-500 truncate" title={user?.email}>
                {displayEmail}
              </span> */}
            </div>
            <svg
              className={`w-4 h-4 transform transition-transform ${showMenu ? "rotate-180" : ""}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>

          {showMenu && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl overflow-hidden z-50 animate-fade-in border border-gray-100">
              <div className="px-4 py-3 border-b border-gray-100">
                <p className="text-sm text-gray-500">Logged in as</p>
                <p className="font-medium text-gray-800 truncate" title={user?.email}>
                  {user?.email}
                </p>
              </div>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2 px-4 py-3 text-left text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <span>🔓</span>
                <span>LogOut</span>
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Profile;