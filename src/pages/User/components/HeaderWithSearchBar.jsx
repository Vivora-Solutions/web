import React from "react";

const HeaderWithSearchBar = ({ searchTerm, setSearchTerm }) => {
  return (
    <div className="bg-gray-100 py-4 px-6 shadow-sm">
      <input
        type="text"
        placeholder="Search by salon name or address..."
        className="w-full px-4 py-2 border border-gray-300 rounded-lg"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
    </div>
  );
};

export default HeaderWithSearchBar;
