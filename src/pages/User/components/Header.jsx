import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { ProtectedAPI } from '../../../utils/api';

const Header = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Function to check if current path matches the link
  const isActiveLink = (path) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

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
        <nav className="hidden md:flex gap-2 items-center text-sm sm:text-base">
          <Link 
            to="/" 
            className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 relative overflow-hidden group ${
              isActiveLink('/') 
                ? 'text-white bg-white/20 shadow-lg backdrop-blur-sm border border-white/30' 
                : 'text-white hover:text-white hover:bg-white/10'
            }`}
          >
            <span className="relative z-10">Home</span>
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-purple-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </Link>
          {user?.role === 'customer' && (
            <Link 
              to="/my-bookings" 
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 relative overflow-hidden group ${
                isActiveLink('/my-bookings') 
                  ? 'text-white bg-white/20 shadow-lg backdrop-blur-sm border border-white/30' 
                  : 'text-white hover:text-white hover:bg-white/10'
              }`}
            >
              <span className="relative z-10">My Bookings</span>
              <div className="absolute inset-0 bg-gradient-to-r from-green-400/20 to-blue-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </Link>
          )}
          <Link 
            to="/about" 
            className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 relative overflow-hidden group ${
              isActiveLink('/about') 
                ? 'text-white bg-white/20 shadow-lg backdrop-blur-sm border border-white/30' 
                : 'text-white hover:text-white hover:bg-white/10'
            }`}
          >
            <span className="relative z-10">About</span>
            <div className="absolute inset-0 bg-gradient-to-r from-purple-400/20 to-pink-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </Link>
          <Link 
            to="/salon-register" 
            className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 relative overflow-hidden group ${
              isActiveLink('/salon-register') 
                ? 'text-white bg-white/20 shadow-lg backdrop-blur-sm border border-white/30' 
                : 'text-white hover:text-white hover:bg-white/10'
            }`}
          >
            <span className="relative z-10">Register as a Salon</span>
            <div className="absolute inset-0 bg-gradient-to-r from-pink-400/20 to-purple-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </Link>
          {!loading && user === false && (
            <>
              <Link
                to="/login"
                className="px-4 py-2 border border-white text-white rounded-lg hover:bg-white hover:text-gray-800 transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="px-4 py-2 bg-white text-gray-900 rounded-lg hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
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
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
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
        <div className="md:hidden px-4 pb-4 space-y-2 text-sm animate-slide-down bg-gray-900 text-white">
          <Link 
            to="/" 
            className={`block px-4 py-3 rounded-lg font-medium transition-all duration-300 relative overflow-hidden group ${
              isActiveLink('/') 
                ? 'text-white bg-white/20 shadow-lg backdrop-blur-sm border border-white/30' 
                : 'text-white hover:text-white hover:bg-white/10'
            }`}
            onClick={() => setMenuOpen(false)}
          >
            <span className="relative z-10">Home</span>
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-purple-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </Link>
          {user?.role === 'customer' && (
            <Link 
              to="/my-bookings" 
              className={`block px-4 py-3 rounded-lg font-medium transition-all duration-300 relative overflow-hidden group ${
                isActiveLink('/my-bookings') 
                  ? 'text-white bg-white/20 shadow-lg backdrop-blur-sm border border-white/30' 
                  : 'text-white hover:text-white hover:bg-white/10'
              }`}
              onClick={() => setMenuOpen(false)}
            >
              <span className="relative z-10">My Bookings</span>
              <div className="absolute inset-0 bg-gradient-to-r from-green-400/20 to-blue-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </Link>
          )}
          <Link 
            to="/about" 
            className={`block px-4 py-3 rounded-lg font-medium transition-all duration-300 relative overflow-hidden group ${
              isActiveLink('/about') 
                ? 'text-white bg-white/20 shadow-lg backdrop-blur-sm border border-white/30' 
                : 'text-white hover:text-white hover:bg-white/10'
            }`}
            onClick={() => setMenuOpen(false)}
          >
            <span className="relative z-10">About</span>
            <div className="absolute inset-0 bg-gradient-to-r from-purple-400/20 to-pink-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </Link>
          
          {!loading && user === false && (
            <>
              <Link
                to="/login"
                className="block px-4 py-3 border border-white text-white rounded-lg hover:bg-white hover:text-gray-800 transition-all duration-300 transform hover:scale-105 hover:shadow-lg text-center"
                onClick={() => setMenuOpen(false)}
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="block px-4 py-3 bg-white text-gray-900 rounded-lg hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 hover:shadow-lg text-center"
                onClick={() => setMenuOpen(false)}
              >
                Sign Up
              </Link>
            </>
          )}
          {user?.email && (
            <>
              <div 
                className="flex items-center gap-3 cursor-pointer hover:bg-white/10 px-4 py-3 rounded-lg transition-all duration-300 group"
                onClick={() => {
                  navigate('/profile');
                  setMenuOpen(false);
                }}
              >
                <img
                  src="https://www.w3schools.com/howto/img_avatar.png"
                  alt="profile"
                  className="w-9 h-9 rounded-full border-2 border-white group-hover:scale-105 transition-transform duration-300"
                />
                <div className="flex flex-col">
                  <p className="text-white text-sm font-medium group-hover:text-blue-200 transition-colors">👤 My Profile</p>
                  <p className="text-gray-300 text-xs group-hover:text-gray-200 transition-colors">{user.email}</p>
                </div>
              </div>
              <button
                onClick={() => {
                  handleLogout();
                  setMenuOpen(false);
                }}
                className="block w-full px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all duration-300 transform hover:scale-105 hover:shadow-lg text-center"
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
