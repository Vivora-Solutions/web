// components/Navbar.jsx
import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="bg-white shadow-md px-6 py-4 flex justify-between items-center">

      <div className="space-x-6">
        <Link to="/" className="text-gray-700 hover:text-blue-600">Home</Link>
        <Link to="/my-bookings" className="text-gray-700 hover:text-blue-600">My Bookings</Link>
        <Link to="/about" className="text-gray-700 hover:text-blue-600">About</Link>
        <Link to="/profile" className="text-gray-700 hover:text-blue-600">Profile</Link>
      </div>
    </nav>
  );
};

export default Navbar;
