import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../../../utils/supabaseClient';

const Header = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const getUser = async () => {
      try {
        // Get current session from Supabase
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error getting session:', error);
          setUser(null);
        } else if (session?.user) {
          setUser(session.user);
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error('Error in getUser:', error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    getUser();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT' || !session) {
        setUser(null);
        localStorage.removeItem('user_role');
      } else if (session?.user) {
        setUser(session.user);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      // Sign out from Supabase
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('Error signing out:', error);
      }
      
      // Clear localStorage
      localStorage.removeItem('user_role');
      
      // Reset user state
      setUser(null);
      
      // Navigate to home
      navigate('/');
    } catch (error) {
      console.error('Error in handleLogout:', error);
    }
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
        {loading ? (
          <div className="flex items-center space-x-2">
            <div className="animate-spin h-4 w-4 border-b-2 border-white rounded-full"></div>
            <span className="text-gray-300 text-xs">Loading...</span>
          </div>
        ) : user ? (
          <div className="flex items-center space-x-4 text-sm">
            <div className="flex flex-col items-center cursor-pointer group">
              <img
                src={user.user_metadata?.avatar_url || "https://www.w3schools.com/howto/img_avatar.png"}
                alt="profile"
                className="w-9 h-9 rounded-full border-2 border-white group-hover:scale-105 transition"
              />
              <p className="text-gray-300 text-xs mt-1 group-hover:underline">
                {user.email}
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition disabled:opacity-50"
              disabled={loading}
            >
              Logout
            </button>
          </div>
        ) : (
          <div className="flex items-center space-x-2">
            <Link
              to="/login"
              className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            >
              Login
            </Link>
          </div>
        )}
      </nav>

      {/* Mobile Navigation */}
      <nav className="flex md:hidden items-center gap-3">
        {loading ? (
          <div className="animate-spin h-4 w-4 border-b-2 border-white rounded-full"></div>
        ) : user ? (
          <div className="flex items-center space-x-3">
            {/* Profile + email */}
            <div className="flex flex-col items-center cursor-pointer">
              <img
                src={user.user_metadata?.avatar_url || "https://www.w3schools.com/howto/img_avatar.png"}
                alt="profile"
                className="w-8 h-8 rounded-full border border-white"
              />
              <p className="text-gray-300 text-[10px] mt-1">{user.email}</p>
            </div>
            {/* Logout button */}
            <button
              onClick={handleLogout}
              className="px-2 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700 disabled:opacity-50"
              disabled={loading}
            >
              Logout
            </button>
          </div>
        ) : (
          <Link
            to="/login"
            className="px-2 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700"
          >
            Login
          </Link>
        )}
      </nav>
    </div>
  </header>
  );
};

export default Header;
