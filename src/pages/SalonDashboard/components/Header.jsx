import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ProtectedAPI } from '../../../utils/api';

const Header = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
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
    navigate('/login');
  };

  return (
    <header className="fixed top-[4px] left-0 right-0 z-50 bg-white shadow-md px-6 py-4 flex justify-between items-center h-[60px]">
      
      {/* Logo */}
      <Link to="/" className="flex items-center">
        <h1
          className="font-bold text-[2.5rem] leading-none select-none"
          style={{
            fontFamily: '"Italiana", sans-serif',
            background: 'linear-gradient(to right, #0e12e2, #19cef7, #487bff, #654dad, #08c37e)',
            backgroundSize: '200%',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            color: 'transparent',
            WebkitTextFillColor: 'transparent',
            animation: 'animate-gradient 2.5s linear infinite'
          }}
        >
          VIVORA
        </h1>
      </Link>

      {/* Navigation */}
      <nav className="flex-1 flex justify-end items-center">
        

        {/* Right section: Auth and Profile */}
        <div className="flex items-center space-x-4 ml-6">
          {loading ? (
            <div className="w-6 h-6 bg-gray-200 rounded-full animate-pulse"></div>
          ) : user === false ? (
            <div className="flex items-center space-x-2">
              <Link to="/login" className="px-4 py-2 text-blue-600 hover:text-blue-800 font-medium">Login</Link>
              <Link to="/salon-register" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition font-medium">Sign Up</Link>
            </div>
          ) : user && user.email ? (
            <div className="text-sm text-right flex items-center space-x-4">
              {/* Profile Section */}
              <div className="flex flex-col items-center cursor-pointer group" onClick={() => navigate('/profile')}>
                <img
                  src="https://www.w3schools.com/howto/img_avatar.png"
                  alt="profile"
                  className="w-10 h-10 rounded-full border-2 border-blue-500 group-hover:scale-105 transition"
                />
                <p className="text-gray-600 text-xs mt-1 group-hover:underline">{user.email}</p>
              </div>

              {/* Logout */}
              <button
                onClick={handleLogout}
                className="text-sm text-red-500 hover:text-red-700"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="w-6 h-6 bg-gray-200 rounded-full animate-pulse"></div>
          )}
        </div>
      </nav>

      {/* Styles */}
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Caveat:wght@400..700&family=Italiana&family=Outfit:wght@100..900&display=swap');
          @keyframes animate-gradient {
            to {
              background-position: 200%;
            }
          }
        `}
      </style>
    </header>
  );
};

export default Header;
