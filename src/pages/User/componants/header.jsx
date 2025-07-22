import React from 'react';
import './header.css';

const Header = () => {
  return (
    <header className="header">
      <div className="logo">
        <h1>VIVORA</h1>
      </div>
      <nav className="menu">
        <a href="#" className="menu-item">Home</a>
        <a href="#" className="menu-item">My Bookings</a>
        <a href="#" className="menu-item">About</a>
      </nav>
      <div className="profile-section">
        <input type="text" placeholder="Search..." className="search-bar" />
        <span className="profile-name">John Doe</span>
        <div className="profile-icon">👤</div>
      </div>
    </header>
  );
};

export default Header;