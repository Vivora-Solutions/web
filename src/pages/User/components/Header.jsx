import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
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
   <header className="bg-gradient-to-r from-gray-800 via-gray-700 to-gray-600 shadow-md w-full z-50">

      <div className="px-4 sm:px-6 py-2 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="flex items-center">
          <img
            src="/weblogo-white.png"
            alt="Vivora Logo"
            className="h-15 w-auto sm:h-16 object-contain"
            style={{ maxWidth: '200px' }}
          />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex gap-6 items-center text-sm sm:text-base">
          <Link to="/" className="text-white hover:text-gray-300 font-medium">Home</Link>
          {user?.role === 'customer' && (
            <Link to="/my-bookings" className="text-white hover:text-gray-300 font-medium">My Bookings</Link>
          )}
          <Link to="/about" className="text-white hover:text-gray-300 font-medium">About</Link>
          <Link to="/salon-register" className="text-white hover:text-gray-300 font-medium">Register as a Salon</Link>
          {!loading && user === false && (
            <>
              <Link
                to="/login"
                className="px-3 py-1 border border-white text-white rounded hover:bg-gray-800 transition"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="px-3 py-1 bg-white text-gray-900 rounded hover:opacity-90 transition"
              >
                Sign Up
              </Link>
            </>
          )}
          {user?.email && (
            <div className="flex items-center space-x-4 text-sm">
              <div
                className="flex flex-col items-center cursor-pointer group"
                onClick={() => navigate('/profile')}
              >
                <img
                  src="https://www.w3schools.com/howto/img_avatar.png"
                  alt="profile"
                  className="w-9 h-9 rounded-full border-2 border-white group-hover:scale-105 transition"
                />
                <p className="text-gray-300 text-xs mt-1 group-hover:underline">{user.email}</p>
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

        {/* Mobile Hamburger */}
        <div className="md:hidden flex items-center gap-4">
          {/* Register as Salon Button */}
          <Link
            to="/salon-register"
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 
                      text-white font-semibold shadow-md hover:shadow-lg 
                      transition transform hover:-translate-y-0.5 
                      focus:outline-none focus:ring-2 focus:ring-pink-400 focus:ring-offset-2"
          >
            Register as a Salon
          </Link>

          {/* Toggle Menu Button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="text-white hover:text-gray-300 transition"
          >
            {menuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

      </div>

      {/* Mobile Dropdown Menu */}
      {menuOpen && (
        <div className="md:hidden px-4 pb-4 space-y-3 text-sm animate-slide-down bg-gray-900 text-white">
          <Link to="/" className="block font-medium hover:text-gray-300" onClick={() => setMenuOpen(false)}>Home</Link>
          {user?.role === 'customer' && (
            <Link to="/my-bookings" className="block font-medium hover:text-gray-300" onClick={() => setMenuOpen(false)}>My Bookings</Link>
          )}
          <Link to="/about" className="block font-medium hover:text-gray-300" onClick={() => setMenuOpen(false)}>About</Link>
          
          {!loading && user === false && (
            <>
              <Link
                to="/login"
                className="block px-3 py-2 border border-white text-white rounded hover:bg-gray-800 transition"
                onClick={() => setMenuOpen(false)}
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="block px-3 py-2 bg-white text-gray-900 rounded hover:opacity-90 transition"
                onClick={() => setMenuOpen(false)}
              >
                Sign Up
              </Link>
            </>
          )}
          {user?.email && (
            <>
              <div className="flex items-center gap-3">
                <img
                  src="https://www.w3schools.com/howto/img_avatar.png"
                  alt="profile"
                  className="w-9 h-9 rounded-full border-2 border-white"
                />
                <p className="text-gray-300 text-sm">{user.email}</p>
              </div>
              <button
                onClick={() => {
                  handleLogout();
                  setMenuOpen(false);
                }}
                className="block px-3 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
              >
                Logout
              </button>
            </>
          )}
        </div>
      )}

      {/* Fonts and animation */}
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Caveat:wght@400..700&family=Italiana&family=Outfit:wght@100..900&display=swap');
          @keyframes animate-gradient {
            to {
              background-position: 200%;
            }
          }
          .animate-slide-down {
            animation: slideDown 0.3s ease-out forwards;
          }
          @keyframes slideDown {
            from {
              opacity: 0;
              transform: translateY(-10px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}
      </style>
    </header>
  );
};

export default Header;
