import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ProtectedAPI } from '../../../utils/api';

const Header = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await ProtectedAPI.get('/auth/me');
        setUser(res.data);
      } catch (err) {
        setUser(false);
        console.error('Failed to fetch user', err);
      }
      setLoading(false);
    };

    const token = localStorage.getItem('access_token');
    if (token) {
      fetchUser();
    } else {
      setUser(false);
      setLoading(false);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user_role');
    setUser(false);
    navigate('/');
  };

  return (
   <header className="fixed top-0 left-0 bg-gradient-to-r from-gray-800 via-gray-700 to-gray-600 shadow-md w-full z-50 animate-slide-down">
    <div className="px-4 sm:px-6 py-2 flex justify-between items-center">
      {/* Logo */}
      <Link
        to="/"
        className="flex items-center ml-12 md:ml-0" // 👈 pushes logo right in mobile, resets in desktop
      >
        <img
          src="/weblogo-white.png"
          alt="Vivora Logo"
          className="h-12 w-auto sm:h-16 object-contain"
          style={{ maxWidth: "200px" }}
        />
      </Link>


      {/* Desktop Navigation */}
      <nav className="hidden md:flex gap-6 items-center text-sm sm:text-base">
        {user?.email && (
          <div className="flex items-center space-x-4 text-sm">
            <div className="flex flex-col items-center cursor-pointer group">
              <img
                src="https://www.w3schools.com/howto/img_avatar.png"
                alt="profile"
                className="w-9 h-9 rounded-full border-2 border-white group-hover:scale-105 transition"
              />
              <p className="text-gray-300 text-xs mt-1 group-hover:underline">
                {user.email}
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition"
            >
              Logout
            </button>
          </div>
        )}
      </nav>

      {/* Mobile Navigation */}
      <nav className="flex md:hidden items-center gap-3">
        {user?.email && (
          <div className="flex items-center space-x-3">
            {/* Profile + email */}
            <div className="flex flex-col items-center cursor-pointer">
              <img
                src="https://www.w3schools.com/howto/img_avatar.png"
                alt="profile"
                className="w-8 h-8 rounded-full border border-white"
              />
              <p className="text-gray-300 text-[10px] mt-1">{user.email}</p>
            </div>
            {/* Logout button */}
            <button
              onClick={handleLogout}
              className="px-2 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700"
            >
              Logout
            </button>
          </div>
        )}
      </nav>
    </div>
  </header>
  );
};

export default Header;
