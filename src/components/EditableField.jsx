

import React, { useState } from 'react';
import { FaRegEdit, FaCheck, FaTimes } from "react-icons/fa";

const EditableField = ({ value, onSave, isTextarea = false, className = "", placeholder = "" }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [tempValue, setTempValue] = useState(value);

  const handleEdit = () => {
    setTempValue(value);
    setIsEditing(true);
  };

  const handleSave = () => {
    onSave(tempValue);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setTempValue(value);
    setIsEditing(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !isTextarea) handleSave();
    else if (e.key === 'Escape') handleCancel();
  };

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      {isEditing ? (
        <div className="flex flex-wrap items-start gap-2">
          {isTextarea ? (
            <textarea
              value={tempValue}
              onChange={(e) => setTempValue(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder={placeholder}
              className="w-full max-w-[600px] min-h-[100px] p-2 border border-gray-300 rounded-md resize-y focus:outline-none focus:border-blue-500"
              autoFocus
            />
          ) : (
            <input
              type="text"
              value={tempValue}
              onChange={(e) => setTempValue(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder={placeholder}
              className="w-full max-w-[600px] p-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
              autoFocus
            />
          )}

          <button onClick={handleSave} className="text-green-600 p-1 hover:scale-110 transition-transform">
            <FaCheck />
          </button>
          <button onClick={handleCancel} className="text-red-600 p-1 hover:scale-110 transition-transform">
            <FaTimes />
          </button>
        </div>
      ) : (
        <div className="flex items-center gap-2">
          {isTextarea ? <p>{value}</p> : <h1>{value}</h1>}
          <button onClick={handleEdit} className="text-gray-600 p-1 hover:scale-110 transition-transform">
            <FaRegEdit />
          </button>
        </div>
      )}
    </div>
  );
};

export default EditableField;
