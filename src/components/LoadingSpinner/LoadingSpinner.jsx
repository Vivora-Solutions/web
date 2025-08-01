// LoadingSpinner.jsx
import React from "react";

const LoadingSpinner = ({ message }) => {
  return (
    <div className="fixed inset-0 bg-transparent flex items-center justify-center z-50">
      <div className="flex flex-col items-center gap-4">
        <div className="w-16 h-16 border-4 border-t-transparent border-blue-600 rounded-full animate-spin"></div>
        <p className="text-blue-600 font-medium text-lg animate-pulse">
          {message || "Loading, please wait..."}
        </p>
      </div>
    </div>
  );
};

export default LoadingSpinner;
