import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../../../utils/api'; // Adjust path if needed

const Navbar = () => {
  const [user, setUser] = useState(null); // null = not checked, false = no user

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await API.get('/auth/me'); 
        setUser(res.data); 
      } catch (err) {
        setUser(false); 
        console.error('Failed to fetch user', err);
      }
    };

    const token = localStorage.getItem('access_token');
    if (token) {
      fetchUser();
    } else {
      setUser(false);
    }
  }, []);

  return (
    <nav className="bg-white shadow-md px-6 py-4 flex justify-between items-center">
      <div className="space-x-6">
        <Link to="/" className="text-gray-700 hover:text-blue-600">Home</Link>
        {user && user.role === 'customer' && (
          <Link to="/my-bookings" className="text-gray-700 hover:text-blue-600">My Bookings</Link>
        )}
        <Link to="/about" className="text-gray-700 hover:text-blue-600">About</Link>
        <Link to="/profile" className="text-gray-700 hover:text-blue-600">Profile</Link>
        <Link to="/salon-register" className="text-gray-700 hover:text-blue-600">Register as a Salon</Link>
      </div>

      {user && user.email && (
        <div className="text-sm text-right">
          <p className="text-gray-500">{user.email}</p>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
