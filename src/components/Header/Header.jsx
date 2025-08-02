import React from 'react';
import './Header.css';

const Header = () => {
  return (
    <header className="header bg-white border-b border-gray-200 shadow-sm">
      <div className="flex justify-center items-center py-4">
        <h1
          className="text-center font-bold text-[2.5rem] bg-gradient-to-r from-[#0e12e2] via-[#19cef7] to-[#08c37e] bg-clip-text text-transparent animate-gradient font-italiana"
        >
          VIVORA
        </h1>
      </div>
    </header>
  )
}

export default Header
