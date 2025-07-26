import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiSearch, FiMenu, FiX, FiUser, FiHome, FiCalendar, FiInfo } from 'react-icons/fi';

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <>
      <header className="sticky top-0 z-50 w-full bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            
            {/* Logo */}
            <div className="flex-shrink-0">
              <Link 
                to="/" 
                className="text-2xl font-bold text-black hover:text-gray-700 transition-colors duration-200"
              >
                VIVORA
              </Link>
            </div>

            {/* Desktop Search Bar */}
            <div className="hidden md:flex flex-1 max-w-md mx-8">
              <div className={`relative w-full transition-all duration-200 ${
                isSearchFocused ? 'transform scale-105' : ''
              }`}>
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiSearch className={`h-4 w-4 transition-colors duration-200 ${
                    isSearchFocused ? 'text-black' : 'text-gray-400'
                  }`} />
                </div>
                <input
                  type="text"
                  placeholder="Search salons, services..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full bg-gray-50 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent focus:bg-white transition-all duration-200"
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setIsSearchFocused(false)}
                />
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <Link 
                to="/" 
                className="flex items-center space-x-1 text-gray-700 hover:text-black font-medium transition-colors duration-200 group"
              >
                <FiHome className="h-4 w-4 group-hover:scale-110 transition-transform duration-200" />
                <span>Home</span>
              </Link>
              <Link 
                to="/bookings" 
                className="flex items-center space-x-1 text-gray-700 hover:text-black font-medium transition-colors duration-200 group"
              >
                <FiCalendar className="h-4 w-4 group-hover:scale-110 transition-transform duration-200" />
                <span>My Bookings</span>
              </Link>
              <Link 
                to="/about" 
                className="flex items-center space-x-1 text-gray-700 hover:text-black font-medium transition-colors duration-200 group"
              >
                <FiInfo className="h-4 w-4 group-hover:scale-110 transition-transform duration-200" />
                <span>About</span>
              </Link>
            </nav>

            {/* Profile & Mobile Menu Button */}
            <div className="flex items-center space-x-4">
              {/* Profile */}
              <div className="hidden sm:flex items-center space-x-3 group cursor-pointer">
                <span className="text-gray-800 font-medium group-hover:text-black transition-colors duration-200">
                  John Doe
                </span>
                <div className="w-8 h-8 flex items-center justify-center bg-black text-white rounded-full group-hover:bg-gray-800 transition-all duration-200 group-hover:scale-105">
                  <FiUser className="h-4 w-4" />
                </div>
              </div>

              {/* Mobile Menu Button */}
              <button
                onClick={toggleMobileMenu}
                className="md:hidden p-2 rounded-md text-gray-700 hover:text-black hover:bg-gray-100 transition-all duration-200"
                aria-label="Toggle menu"
              >
                {isMobileMenuOpen ? (
                  <FiX className="h-6 w-6" />
                ) : (
                  <FiMenu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <div className={`md:hidden transition-all duration-300 ease-in-out ${
          isMobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        } overflow-hidden bg-white border-t border-gray-200`}>
          <div className="px-4 pt-2 pb-4 space-y-4">
            
            {/* Mobile Search */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiSearch className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search salons, services..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full bg-gray-50 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent focus:bg-white"
              />
            </div>

            {/* Mobile Navigation */}
            <nav className="space-y-2">
              <Link 
                to="/" 
                className="flex items-center space-x-3 px-3 py-2 rounded-md text-gray-700 hover:text-black hover:bg-gray-100 font-medium transition-all duration-200"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <FiHome className="h-5 w-5" />
                <span>Home</span>
              </Link>
              <Link 
                to="/bookings" 
                className="flex items-center space-x-3 px-3 py-2 rounded-md text-gray-700 hover:text-black hover:bg-gray-100 font-medium transition-all duration-200"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <FiCalendar className="h-5 w-5" />
                <span>My Bookings</span>
              </Link>
              <Link 
                to="/about" 
                className="flex items-center space-x-3 px-3 py-2 rounded-md text-gray-700 hover:text-black hover:bg-gray-100 font-medium transition-all duration-200"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <FiInfo className="h-5 w-5" />
                <span>About</span>
              </Link>
            </nav>

            {/* Mobile Profile */}
            <div className="sm:hidden flex items-center space-x-3 px-3 py-2 border-t border-gray-200 mt-4 pt-4">
              <div className="w-8 h-8 flex items-center justify-center bg-black text-white rounded-full">
                <FiUser className="h-4 w-4" />
              </div>
              <span className="text-gray-800 font-medium">John Doe</span>
            </div>
          </div>
        </div>
      </header>

      {/* Overlay for mobile menu */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-25 z-40 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </>
  );
};

export default Header;
