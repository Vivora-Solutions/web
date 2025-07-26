import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { FiMapPin, FiClock, FiStar, FiPhone, FiNavigation, FiEye, FiZoomIn, FiZoomOut, FiMaximize2 } from 'react-icons/fi';
import 'leaflet/dist/leaflet.css';
import './SalonMap.css';

// Fix Leaflet default marker icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Modern custom marker with better styling
const createModernIcon = (color = '#000000', isSelected = false) => {
  const size = isSelected ? 36 : 28;
  
  return new L.DivIcon({
    html: `
      <div style="
        width: ${size}px; 
        height: ${size}px; 
        background: ${color}; 
        border: 3px solid white; 
        border-radius: 50%; 
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;
        transform: translate(-50%, -50%);
      ">
        <div style="
          width: 8px; 
          height: 8px; 
          background: white; 
          border-radius: 50%;
        "></div>
        <div style="
          position: absolute;
          top: ${size}px;
          left: 50%;
          transform: translateX(-50%);
          width: 0;
          height: 0;
          border-left: 6px solid transparent;
          border-right: 6px solid transparent;
          border-top: 8px solid ${color};
        "></div>
      </div>
    `,
    className: 'modern-marker',
    iconSize: [size, size + 8],
    iconAnchor: [size/2, size + 8],
    popupAnchor: [0, -(size + 5)]
  });
};

// Map control component to handle zoom changes
const MapController = ({ center, zoom, setCurrentZoom }) => {
  const map = useMap();
  
  useEffect(() => {
    map.setView(center, zoom);
  }, [map, center, zoom]);

  useEffect(() => {
    const handleZoom = () => {
      setCurrentZoom(map.getZoom());
    };
    
    map.on('zoomend', handleZoom);
    return () => map.off('zoomend', handleZoom);
  }, [map, setCurrentZoom]);

  return null;
};

const SalonMap = ({ 
  salons = [], 
  selectedSalon, 
  onSalonSelect, 
  onGetDirections,
  mapCenter = [7.8731, 80.7718],
  mapZoom = 8
}) => {
  const [currentZoom, setCurrentZoom] = useState(mapZoom);
  const [isMapFullscreen, setIsMapFullscreen] = useState(false);
  const [zoom, setZoom] = useState(mapZoom);
  const [center, setCenter] = useState(mapCenter);

  // Update map state when props change
  useEffect(() => {
    setCenter(mapCenter);
    setZoom(mapZoom);
  }, [mapCenter, mapZoom]);

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 1, 18));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 1, 3));
  };

  const toggleFullscreen = () => {
    setIsMapFullscreen(!isMapFullscreen);
  };

  const resetMapView = () => {
    setCenter([7.8731, 80.7718]);
    setZoom(8);
    onSalonSelect && onSalonSelect(null);
  };

  const handleGetDirections = (salon) => {
    // 🔗 BACKEND API CONNECTION POINT:
    // Before opening directions, you might want to log user interaction
    // Example: await logUserAction('directions_clicked', { salonId: salon.id, userId: currentUser.id });
    
    onGetDirections && onGetDirections(salon);
  };

  const handleSalonSelect = (salon) => {
    // 🔗 BACKEND API CONNECTION POINT:
    // Log salon selection for analytics
    // Example: await logUserAction('salon_selected', { salonId: salon.id, userId: currentUser.id });
    
    onSalonSelect && onSalonSelect(salon);
  };

  return (
    <div className={`bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden mb-8 transition-all duration-300 ${
      isMapFullscreen ? 'fixed inset-4 z-50 rounded-2xl' : ''
    }`}>
      {/* Map Header */}
      <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-bold text-black mb-2 flex items-center">
              <FiMapPin className="mr-3 text-blue-600" />
              Find Nearby Salons
            </h2>
            <p className="text-gray-600">Discover the best salons in your area with interactive map</p>
          </div>
          <div className="mt-4 sm:mt-0 flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <span className="flex items-center text-sm text-gray-600 bg-green-50 px-3 py-1 rounded-full">
                <div className="w-3 h-3 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                Open Now
              </span>
              <span className="flex items-center text-sm text-gray-600 bg-red-50 px-3 py-1 rounded-full">
                <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                Closed
              </span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="relative bg-gray-100">
        {/* Map Controls */}
        <div className="absolute top-4 right-4 z-20 flex flex-col space-y-2">
          <div className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
            <button
              onClick={handleZoomIn}
              className="flex items-center justify-center w-10 h-10 text-gray-700 hover:bg-gray-50 hover:text-black transition-colors border-b border-gray-200"
              title="Zoom In"
            >
              <FiZoomIn className="w-4 h-4" />
            </button>
            <button
              onClick={handleZoomOut}
              className="flex items-center justify-center w-10 h-10 text-gray-700 hover:bg-gray-50 hover:text-black transition-colors border-b border-gray-200"
              title="Zoom Out"
            >
              <FiZoomOut className="w-4 h-4" />
            </button>
            <button
              onClick={toggleFullscreen}
              className="flex items-center justify-center w-10 h-10 text-gray-700 hover:bg-gray-50 hover:text-black transition-colors"
              title={isMapFullscreen ? "Exit Fullscreen" : "Fullscreen"}
            >
              <FiMaximize2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Reset View Button */}
        <div className="absolute top-4 left-4 z-20">
          <button
            onClick={resetMapView}
            className="bg-white text-gray-700 px-4 py-2 rounded-lg shadow-lg border border-gray-200 hover:bg-gray-50 hover:text-black transition-all duration-200 text-sm font-medium"
          >
            Reset View
          </button>
        </div>

        {/* Map Status Bar */}
        <div className="absolute bottom-4 left-4 z-20">
          <div className="bg-black bg-opacity-80 text-white px-3 py-1 rounded-lg text-sm font-medium backdrop-blur-sm">
            Zoom: {currentZoom} | Salons: {salons.length}
          </div>
        </div>

        <MapContainer
          center={center}
          zoom={zoom}
          scrollWheelZoom={true}
          zoomControl={false}
          style={{ 
            height: isMapFullscreen ? "calc(100vh - 200px)" : "600px", 
            width: "100%",
            borderRadius: isMapFullscreen ? "0" : "0 0 12px 12px"
          }}
          className="leaflet-modern-map"
        >
          <MapController 
            center={center} 
            zoom={zoom} 
            setCurrentZoom={setCurrentZoom}
          />
          
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            className="map-tiles"
          />
          
          {salons.map((salon) => (
            <Marker 
              key={salon.id} 
              position={salon.position} 
              icon={createModernIcon(
                salon.isOpen ? '#10B981' : '#EF4444',
                selectedSalon?.id === salon.id
              )}
            >
              <Popup 
                className="modern-popup"
                closeButton={true}
                maxWidth={300}
                minWidth={280}
              >
                <div className="p-4">
                  <div className="flex items-start space-x-4 mb-4">
                    <div className="flex-shrink-0">
                      <img 
                        src={salon.image} 
                        alt={salon.name}
                        className="w-16 h-16 object-cover rounded-xl shadow-md"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-gray-900 text-lg mb-1">{salon.name}</h3>
                      <p className="text-gray-600 text-sm mb-2">{salon.city}</p>
                      <div className="flex items-center">
                        <div className="flex items-center bg-yellow-50 px-2 py-1 rounded-full">
                          <FiStar className="w-3 h-3 text-yellow-500 mr-1" />
                          <span className="text-xs font-semibold text-yellow-700">
                            {salon.rating}
                          </span>
                        </div>
                        <span className="text-xs text-gray-500 ml-2">
                          ({salon.reviews} reviews)
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-3 mb-4">
                    <div className="flex items-start text-sm text-gray-600">
                      <FiMapPin className="w-4 h-4 mr-2 mt-0.5 text-gray-400" />
                      <span className="flex-1">{salon.address}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <FiClock className="w-4 h-4 mr-2 text-gray-400" />
                      <span>{salon.openTime}</span>
                      <span className={`ml-2 px-2 py-0.5 rounded-full text-xs font-medium ${
                        salon.isOpen ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {salon.isOpen ? 'Open' : 'Closed'}
                      </span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <FiPhone className="w-4 h-4 mr-2 text-gray-400" />
                      <a href={`tel:${salon.phone}`} className="hover:text-blue-600 transition-colors">
                        {salon.phone}
                      </a>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1 mb-4">
                    {salon.specialties?.map((specialty, index) => (
                      <span 
                        key={index}
                        className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full font-medium"
                      >
                        {specialty}
                      </span>
                    ))}
                  </div>
                  
                  <div className="flex space-x-2">
                    <button 
                      onClick={() => handleGetDirections(salon)}
                      className="flex items-center px-4 py-2 bg-black text-white text-sm rounded-lg hover:bg-gray-800 transition-all duration-200 font-medium shadow-md hover:shadow-lg"
                    >
                      <FiNavigation className="w-4 h-4 mr-2" />
                      Directions
                    </button>
                    <button 
                      onClick={() => handleSalonSelect(salon)}
                      className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 text-sm rounded-lg hover:bg-gray-200 transition-all duration-200 font-medium"
                    >
                      <FiEye className="w-4 h-4 mr-2" />
                      View Details
                    </button>
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      {/* Map Legend */}
      <div className="p-4 bg-gray-50 border-t border-gray-200">
        <div className="flex items-center justify-between text-sm text-gray-600">
          <div className="flex items-center space-x-4">
            <span>Click markers for details</span>
            <span>•</span>
            <span>Scroll to zoom</span>
            <span>•</span>
            <span>Drag to pan</span>
          </div>
          <div className="text-xs text-gray-500">
            Last updated: {new Date().toLocaleTimeString()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalonMap;
