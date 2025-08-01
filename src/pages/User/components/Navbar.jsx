import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../../../utils/api"; // Adjust path if needed

const Navbar = () => {
  const [user, setUser] = useState(null); // null = not checked, false = no user

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await API.get("/auth/me");
        setUser(res.data);
      } catch (err) {
        setUser(false);
        console.error("Failed to fetch user", err);
      }
    };

    const token = localStorage.getItem("access_token");
    if (token) {
      fetchUser();
    } else {
      setUser(false);
    }
  }, []);

  return (
    <nav className="bg-white shadow-md px-6 py-4 flex justify-between items-center">
      <div className="space-x-6">
        <Link to="/" className="text-gray-700 hover:text-blue-600 font-medium">
          Home
        </Link>
        {user && user.role === "customer" && (
          <Link
            to="/my-bookings"
            className="text-gray-700 hover:text-blue-600 font-medium"
          >
            My Bookings
          </Link>
        )}
        <Link
          to="/about"
          className="text-gray-700 hover:text-blue-600 font-medium"
        >
          About
        </Link>
        <Link
          to="/profile"
          className="text-gray-700 hover:text-blue-600 font-medium"
        >
          Profile
        </Link>
        <Link
          to="/salon-register"
          className="text-gray-700 hover:text-blue-600 font-medium"
        >
          Register as a Salon
        </Link>
      </div>

      <div className="flex items-center space-x-4">
        {user === false ? (
          <div className="flex items-center space-x-2">
            <Link
              to="/login"
              className="px-4 py-2 text-blue-600 hover:text-blue-800 font-medium"
            >
              Login
            </Link>
            <Link
              to="/signup"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition font-medium"
            >
              Sign Up
            </Link>
          </div>
        ) : user && user.email ? (
          <div className="text-sm text-right flex items-center space-x-3">
            <p className="text-gray-600 font-medium">{user.email}</p>
            <button
              onClick={() => {
                localStorage.removeItem("access_token");
                localStorage.removeItem("refresh_token");
                setUser(false);
              }}
              className="text-sm text-red-500 hover:text-red-700"
            >
              Logout
            </button>
          </div>
        ) : (
          <div className="w-6 h-6 bg-gray-200 rounded-full animate-pulse"></div> // Loading state
        )}
      </div>
    </nav>
  );
};

export default Navbar;
