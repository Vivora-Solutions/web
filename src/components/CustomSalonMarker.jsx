import React from 'react';

const CustomSalonMarker = ({ 
  salon, 
  zoom = 13,
  isHovered, 
  onMouseEnter, 
  onMouseLeave, 
  onClick 
}) => {
  const rating = salon.average_rating || salon.rating || 4.5;
  
  // Calculate scale based on zoom level
  // At zoom 13+, scale is 1.0
  // At zoom 10, scale is 0.7
  // At zoom 5, scale is 0.4
  const getZoomScale = (zoomLevel) => {
    if (zoomLevel >= 13) return 1.0;
    if (zoomLevel >= 10) return 0.7 + (zoomLevel - 10) * 0.1; // 0.7 to 1.0
    if (zoomLevel >= 7) return 0.5 + (zoomLevel - 7) * 0.067; // 0.5 to 0.7
    return Math.max(0.3, 0.3 + (zoomLevel - 1) * 0.033); // 0.3 to 0.5
  };
  
  const scale = getZoomScale(zoom);
  
  return (
    <div
      className="relative cursor-pointer select-none"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onClick={onClick}
      style={{
        zIndex: isHovered ? 1000 : 10,
      }}
    >
      {/* Default State: Small Black Dot */}
      {!isHovered && (
        <div 
          className="relative animate-marker-appear transition-all duration-300 ease-out transform hover:scale-110"
          style={{ transform: `scale(${scale})` }}
        >
          <div className="w-4 h-4 bg-black rounded-full border-2 border-white shadow-lg relative overflow-hidden">
            {/* Subtle inner glow */}
            <div className="absolute inset-0 bg-gradient-to-br from-gray-700 to-black rounded-full"></div>
          </div>
          {/* Subtle pulse ring */}
          <div className="absolute inset-0 w-4 h-4 bg-black rounded-full animate-ping opacity-20"></div>
        </div>
      )}

      {/* Hover State: Larger Black Location Bubble */}
      {isHovered && (
        <div className="absolute animate-bubble-bounce-in" style={{
          bottom: `${16 * scale}px`, // Position bubble above the dot (scaled)
          left: '50%',
          transform: `translateX(-50%) scale(${Math.max(0.8, scale)})`, // Center bubble horizontally and scale (min 0.8 for readability)
        }}>
          {/* Main Bubble */}
          <div className="bg-gradient-to-br from-gray-900 to-black text-white px-4 py-3 rounded-2xl shadow-2xl min-w-[180px] max-w-[200px] relative border border-gray-700">
            {/* Salon Name */}
            <div className="font-bold text-sm mb-2 truncate">
              {salon.salon_name}
            </div>
            
            {/* Rating */}
            <div className="flex items-center gap-1 mb-2">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className={`w-3.5 h-3.5 ${
                      i < Math.floor(rating)
                        ? 'text-yellow-400'
                        : 'text-gray-500'
                    }`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <span className="text-xs text-yellow-400 ml-1 font-medium">
                {rating.toFixed(1)}
              </span>
            </div>

            {/* Address */}
            {salon.salon_address && (
              <div className="text-xs text-gray-300 mb-2 line-clamp-2">
                📍 {salon.salon_address}
              </div>
            )}

            {/* Distance (if available) */}
            {salon.distance && (
              <div className="text-xs text-blue-300 font-medium">
                🚗 {salon.distance.toFixed(1)} km away
              </div>
            )}

            {/* Click to view hint */}
            <div className="text-xs text-gray-400 mt-2 italic">
              Click to view details
            </div>

            {/* Bubble Tail/Arrow pointing down to the dot */}
            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
              <div className="w-4 h-4 bg-gradient-to-br from-gray-900 to-black rotate-45 border-l border-b border-gray-700"></div>
            </div>
          </div>
        </div>
      )}

      {/* Always show the dot - it scales up slightly on hover but stays in place */}
      <div 
        className={`absolute top-0 left-0 transition-all duration-300 ease-out`}
        style={{ 
          transform: `scale(${scale * (isHovered ? 1.25 : 1)})` 
        }}
      >
        <div className="w-4 h-4 bg-black rounded-full border-2 border-white shadow-lg relative overflow-hidden">
          {/* Subtle inner glow */}
          <div className="absolute inset-0 bg-gradient-to-br from-gray-700 to-black rounded-full"></div>
        </div>
        {/* Subtle pulse ring */}
        <div className="absolute inset-0 w-4 h-4 bg-black rounded-full animate-ping opacity-20"></div>
      </div>
    </div>
  );
};

export default CustomSalonMarker;
