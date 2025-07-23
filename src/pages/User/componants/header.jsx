import React from 'react';
import './header.css';

const Header = () => {
  return (
    <header className="header">
      <div className="logo">
        <h1>VIVORA</h1>
      </div>

      <div className="search-wrapper">
        <input type="text" placeholder="Search..." className="search-bar" />
      </div>

      <div className="right-section">
        <nav className="menu">
          <a href="#" className="menu-item">Home</a>
          <a href="#" className="menu-item">My Bookings</a>
          <a href="#" className="menu-item">About</a>
        </nav>
        <div className="profile-section">
          <span className="profile-name">John Doe</span>
          <div className="profile-icon">👤</div>
        </div>
      </div>
    </header>
  );
};

export default Header;
