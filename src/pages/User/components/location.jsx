import React from 'react';

const LocationIndicator = () => {
  return (
    <div className="location-indicator">
      <svg
        className="location-icon"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="10" r="3" />
        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
      </svg>
      <span className="location-text">Colombo</span>
    </div>
  );
};

export default LocationIndicator;