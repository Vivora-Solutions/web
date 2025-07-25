// src/components/BlackButton.js

import React from 'react';
import './blackbutton.css'

const BlackButton = ({ onClick, children, type = 'button', style = {}, disabled = false }) => {
  return (
    <button
      className="black-button"
      onClick={onClick}
      type={type}
      style={style}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default BlackButton;
