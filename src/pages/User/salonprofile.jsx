import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './components/header';
import LocationIndicator from './components/location';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import {
  FiMapPin,
  FiClock,
  FiStar,
  FiPhone,
  FiEye,
  FiRefreshCw,
} from 'react-icons/fi';
import './salonprofile.css';
import salonImage from '../../assets/images/salonimage.png';

// Fix Leaflet default markers
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Enhanced Modern Blue-Themed Custom Marker with Custom SVG
const createBlueMarker = (isOpen = true) => {
  const color = isOpen ? '#3b82f6' : '#94a3b8';
  const shadowColor = isOpen ? 'rgba(59, 130, 246, 0.4)' : 'rgba(148, 163, 184, 0.3)';
  
  // Custom SVG icon similar to the provided script but with blue theme
  const customSvgIcon = `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <defs>
        <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
          <feMerge> 
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
        <linearGradient id="pinGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:${color};stop-opacity:1" />
          <stop offset="100%" style="stop-color:${isOpen ? '#1d4ed8' : '#64748b'};stop-opacity:1" />
        </linearGradient>
      </defs>
      <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0" 
            fill="url(#pinGradient)" 
            stroke="white" 
            stroke-width="1.5"
            filter="url(#glow)"/>
      <circle cx="12" cy="10" r="3" fill="white" stroke="${color}" stroke-width="1"/>
      <circle cx="12" cy="10" r="1.5" fill="${color}"/>
      ${isOpen ? 
        `<circle cx="18" cy="6" r="3" fill="#10b981" stroke="white" stroke-width="1.5">
           <animate attributeName="r" values="2.5;3.5;2.5" dur="2s" repeatCount="indefinite"/>
         </circle>
         <path d="M16.5 6l0.5 0.5 1.5-1.5" stroke="white" stroke-width="1" fill="none" stroke-linecap="round" stroke-linejoin="round"/>` : 
        `<circle cx="18" cy="6" r="3" fill="#64748b" stroke="white" stroke-width="1.5"/>
         <line x1="16.5" y1="6" x2="19.5" y2="6" stroke="white" stroke-width="1" stroke-linecap="round"/>`
      }
    </svg>
  `)}`;

  return new L.Icon({
    iconUrl: customSvgIcon,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
    className: 'custom-blue-marker',
  });
};

const HomePage = () => {
  const navigate = useNavigate();

  const salonList = [
    {
      id: 1,
      name: 'Liyo Salon',
      city: 'Colombo',
      address: '123 Galle Road, Colombo 03',
      rating: 4.5,
      reviews: 128,
      openTime: '9:00 AM - 8:00 PM',
      phone: '+94 11 234 5678',
      specialties: ['Hair Cut', 'Beard Trim', 'Massage'],
      image: salonImage,
      position: [6.9271, 79.8612],
      isOpen: true,
    },
    {
      id: 2,
      name: 'Nivora Cuts',
      city: 'Kandy',
      address: '456 Peradeniya Road, Kandy',
      rating: 4.2,
      reviews: 95,
      openTime: '10:00 AM - 7:30 PM',
      phone: '+94 81 234 5678',
      specialties: ['Hair Color', 'Facial', 'Styling'],
      image: salonImage,
      position: [7.2906, 80.6337],
      isOpen: true,
    },
    {
      id: 3,
      name: 'Glow Studio',
      city: 'Galle',
      address: '789 Main Street, Galle Fort',
      rating: 4.8,
      reviews: 203,
      openTime: '8:30 AM - 6:00 PM',
      phone: '+94 91 234 5678',
      specialties: ['Bridal', 'Makeup', 'Spa'],
      image: salonImage,
      position: [6.032, 80.217],
      isOpen: false,
    },
  ];

  const [selectedSalon, setSelectedSalon] = useState(null);
  const [mapCenter, setMapCenter] = useState([6.9271, 79.8612]);
  const [selectedCity, setSelectedCity] = useState('Colombo');

  const handleSalonSelect = (salon) => {
    setSelectedSalon(salon);
    setMapCenter(salon.position);
  };

  const handleGetDirections = (salon) => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${salon.position[0]},${salon.position[1]}`;
    window.open(url, '_blank');
  };

  // City centers for map navigation (Sri Lankan cities)
  const cityLocations = {
    'Colombo': { coords: [6.9271, 79.8612], description: 'Commercial capital of Sri Lanka with premium salons.' },
    'Kandy': { coords: [7.2906, 80.6337], description: 'Cultural capital with traditional and modern beauty services.' },
    'Galle': { coords: [6.032, 80.217], description: 'Historic coastal city with boutique salon experiences.' }
  };

  const handleCityChange = (cityName) => {
    setSelectedCity(cityName);
    setMapCenter(cityLocations[cityName].coords);
  };

  // Enhanced city tab functionality similar to provided script
  useEffect(() => {
    const mapWrapper = document.querySelector('#hs-change-city-leaflet-wrapper');
    if (mapWrapper) {
      const tabs = mapWrapper.parentElement.parentElement.querySelectorAll('[role="tablist"] [data-hs-tab]');
      
      tabs.forEach((tab) => {
        tab.addEventListener('click', () => {
          const cityName = tab.getAttribute('data-hs-tab');
          
          // Remove active class from all tabs and add to clicked tab
          Array.from(tabs).forEach((t) => t.classList.remove('active'));
          tab.classList.add('active');
          
          // Change map center to selected city
          if (cityLocations[cityName]) {
            setSelectedCity(cityName);
            setMapCenter(cityLocations[cityName].coords);
          }
        });
      });
    }
  }, []);

  // Create popup content similar to the provided script
  const createPopupContent = (salon) => {
    return `
      <div class="bg-white rounded-2xl shadow-2xl border border-blue-100 p-6 min-w-[320px]">
        <div class="flex items-start justify-between mb-4">
          <div class="flex-1">
            <h3 class="text-xl font-bold text-gray-900 mb-1">${salon.name}</h3>
            <div class="flex items-center text-gray-600 mb-2">
              <span class="text-sm">${salon.city}</span>
            </div>
          </div>
          <div class="px-3 py-1 rounded-full text-xs font-bold ${
            salon.isOpen 
              ? 'bg-blue-100 text-blue-700 border border-blue-200'
              : 'bg-slate-100 text-slate-600 border border-slate-200'
          }">
            ${salon.isOpen ? 'OPEN' : 'CLOSED'}
          </div>
        </div>
        <div class="text-sm text-gray-500 mb-4">${salon.address}</div>
        <div class="text-sm text-blue-600 mb-4">${salon.openTime}</div>
      </div>
    `;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Modern Interactive Map Section */}
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden mb-8">
          {/* Modern Map Header with Blue Theme and City Tabs */}
          <div className="bg-gradient-to-r from-blue-50 via-sky-50 to-cyan-50 p-8 border-b border-blue-100">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
              <div className="mb-4 lg:mb-0">
                <h2 className="text-4xl font-bold text-gray-900 mb-3">
                  Find Nearby Salons
                </h2>
                <p className="text-gray-700 text-lg leading-relaxed">
                  Discover premium salons in your area with our interactive blue-themed map
                </p>
              </div>
              
              {/* Status Indicators with Blue Theme */}
              <div className="flex items-center space-x-4">
                <div className="flex items-center bg-blue-50 border border-blue-200 px-4 py-2 rounded-full shadow-sm">
                  <div className="w-3 h-3 bg-blue-500 rounded-full mr-3 animate-pulse shadow-lg"></div>
                  <span className="text-sm font-semibold text-blue-700">
                    {salonList.filter(s => s.isOpen).length} Open Now
                  </span>
                </div>
                <div className="flex items-center bg-slate-50 border border-slate-200 px-4 py-2 rounded-full shadow-sm">
                  <div className="w-3 h-3 bg-slate-400 rounded-full mr-3"></div>
                  <span className="text-sm font-semibold text-slate-600">
                    {salonList.filter(s => !s.isOpen).length} Closed
                  </span>
                </div>
              </div>
            </div>

            {/* City Selection Tabs */}
            <div className="flex flex-wrap gap-2" role="tablist">
              {Object.keys(cityLocations).map((city) => (
                <button
                  key={city}
                  onClick={() => handleCityChange(city)}
                  className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 ${
                    selectedCity === city
                      ? 'bg-blue-600 text-white shadow-lg border-2 border-blue-600'
                      : 'bg-white text-blue-600 border-2 border-blue-200 hover:border-blue-400 hover:bg-blue-50'
                  }`}
                  data-hs-tab={city}
                >
                  <div className="flex items-center space-x-2">
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      width="16" 
                      height="16" 
                      viewBox="0 0 24 24" 
                      fill="none" 
                      stroke="currentColor" 
                      strokeWidth="2" 
                      strokeLinecap="round" 
                      strokeLinejoin="round"
                      className="flex-shrink-0"
                    >
                      <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"/>
                      <circle cx="12" cy="10" r="3"/>
                    </svg>
                    <span>{city}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Modern Blue-Themed Map Container */}
          <div className="relative bg-gradient-to-br from-blue-50 to-sky-100">
            {/* Map Wrapper with Enhanced Blue Styling */}
            <div className="h-[720px] w-full relative overflow-hidden" id="hs-change-city-leaflet-wrapper">
              <MapContainer
                key={selectedCity}
                center={mapCenter}
                zoom={12}
                style={{ 
                  height: '100%', 
                  width: '100%',
                  borderRadius: '0',
                  filter: 'contrast(1.05) brightness(1.08) saturate(1.1)'
                }}
                maxBounds={[
                  [5.5, 79.0],
                  [8.0, 82.0],
                ]}
                maxBoundsViscosity={1.0}
                minZoom={8}
                maxZoom={19}
                zoomControl={false}
                attributionControl={false}
              >
                {/* Modern Light Blue Map Tiles - Enhanced */}
                <TileLayer
                  url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                  maxZoom={19}
                  minZoom={2}
                  attribution='© <a href="https://carto.com/attributions">CARTO</a>'
                  className="blue-map-filter"
                />

                {/* Salon Markers with Blue Theme */}
                {salonList.map((salon) => (
                  <Marker
                    key={salon.id}
                    position={salon.position}
                    icon={createBlueMarker(salon.isOpen)}
                  >
                    <Popup
                      className="modern-blue-popup"
                      maxWidth={350}
                      closeButton={false}
                      autoClose={false}
                      closeOnEscapeKey={true}
                    >
                      <div className="bg-white rounded-2xl shadow-2xl border border-blue-100 p-6 min-w-[320px]">
                        {/* Popup Header with Blue Accents */}
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <h3 className="text-xl font-bold text-gray-900 mb-1">{salon.name}</h3>
                            <div className="flex items-center text-gray-600 mb-2">
                              <FiMapPin className="w-4 h-4 mr-2 text-blue-400" />
                              <span className="text-sm">{salon.city}</span>
                            </div>
                          </div>
                          <div className={`px-3 py-1 rounded-full text-xs font-bold ${
                            salon.isOpen 
                              ? 'bg-blue-100 text-blue-700 border border-blue-200'
                              : 'bg-slate-100 text-slate-600 border border-slate-200'
                          }`}>
                            {salon.isOpen ? 'OPEN' : 'CLOSED'}
                          </div>
                        </div>

                        {/* Quick Info with Blue Theme */}
                        <div className="space-y-3 mb-5">
                          <div className="flex items-center text-gray-600 text-sm">
                            <FiMapPin className="w-4 h-4 mr-3 text-blue-400 flex-shrink-0" />
                            <span className="leading-relaxed">{salon.address}</span>
                          </div>
                          <div className="flex items-center text-gray-600 text-sm">
                            <FiClock className="w-4 h-4 mr-3 text-blue-400 flex-shrink-0" />
                            <span>{salon.openTime}</span>
                          </div>
                          <div className="flex items-center text-gray-600 text-sm">
                            <FiStar className="w-4 h-4 mr-3 text-yellow-500 flex-shrink-0" />
                            <span>
                              <span className="font-semibold text-gray-900">{salon.rating}</span>
                              <span className="text-gray-500"> ({salon.reviews} reviews)</span>
                            </span>
                          </div>
                          <div className="flex items-center text-gray-600 text-sm">
                            <FiPhone className="w-4 h-4 mr-3 text-blue-400 flex-shrink-0" />
                            <span>{salon.phone}</span>
                          </div>
                        </div>

                        {/* Specialties Preview with Blue Theme */}
                        <div className="mb-5">
                          <div className="flex flex-wrap gap-1">
                            {salon.specialties.slice(0, 3).map((specialty, idx) => (
                              <span 
                                key={idx}
                                className="px-2 py-1 bg-blue-50 text-blue-600 text-xs rounded-md border border-blue-200"
                              >
                                {specialty}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Action Buttons with Blue Theme */}
                        <div className="flex gap-2">
                          <button
                            onClick={() => navigate(`/appointment/${salon.id}`)}
                            className="flex-1 bg-blue-600 text-white px-4 py-3 rounded-xl font-semibold hover:bg-blue-700 active:bg-blue-800 transition-all duration-200 text-sm shadow-lg hover:shadow-xl"
                          >
                            Book Now
                          </button>
                          <button
                            onClick={() => handleGetDirections(salon)}
                            className="flex items-center justify-center px-4 py-3 bg-blue-50 text-blue-700 border border-blue-200 rounded-xl font-semibold hover:bg-blue-100 hover:border-blue-300 transition-all duration-200 text-sm"
                          >
                            <FiMapPin className="w-4 h-4 mr-1" />
                            Directions
                          </button>
                        </div>
                      </div>
                    </Popup>
                  </Marker>
                ))}
              </MapContainer>

              {/* Modern Blue-Themed Map Controls */}
              <div className="absolute top-6 right-6 z-[1000] flex flex-col space-y-3">
                {/* Reset Location Button with Blue Theme */}
                <button
                  onClick={() => {
                    setMapCenter(cityLocations[selectedCity].coords);
                  }}
                  className="bg-white/95 backdrop-blur-sm text-blue-600 p-3 rounded-xl shadow-lg border border-blue-200 hover:bg-blue-50 hover:shadow-xl hover:border-blue-300 transition-all duration-300 group"
                  title={`Reset to ${selectedCity} Center`}
                >
                  <FiRefreshCw className="w-5 h-5 group-hover:rotate-180 transition-transform duration-300" />
                </button>
                
                {/* Map Legend with Blue Theme */}
                <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-lg border border-blue-200 p-4 min-w-[150px]">
                  <h4 className="text-xs font-semibold text-blue-700 mb-3 uppercase tracking-wide">Map Legend</h4>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-blue-500 rounded-full mr-3 shadow-sm"></div>
                      <span className="text-xs text-gray-600">Open Salon</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-slate-400 rounded-full mr-3 shadow-sm"></div>
                      <span className="text-xs text-gray-600">Closed Salon</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Map Loading Overlay with Blue Theme */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-sky-100 flex items-center justify-center pointer-events-none opacity-0 transition-opacity duration-300" id="map-loading">
                <div className="flex items-center space-x-3">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                  <span className="text-blue-700 font-medium">Loading map...</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modern Salon Cards - Wide Bar Layout */}
        <div className="space-y-6 mb-10">
          {salonList.map((salon, index) => (
            <div
              key={salon.id}
              className="group bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer transform hover:-translate-y-1"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex flex-col lg:flex-row">
                {/* Image Section */}
                <div className="relative lg:w-80 h-48 lg:h-auto overflow-hidden">
                  <img
                    src={salon.image}
                    alt={salon.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {/* Status Badge */}
                  <div className="absolute top-4 left-4">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                      salon.isOpen 
                        ? 'bg-green-500 text-white shadow-lg' 
                        : 'bg-gray-600 text-white shadow-lg'
                    }`}>
                      <div className={`w-2 h-2 rounded-full mr-2 ${
                        salon.isOpen ? 'bg-green-200 animate-pulse' : 'bg-gray-300'
                      }`}></div>
                      {salon.isOpen ? 'OPEN NOW' : 'CLOSED'}
                    </span>
                  </div>
                  
                  {/* Rating Badge */}
                  <div className="absolute top-4 right-4">
                    <div className="bg-black bg-opacity-80 backdrop-blur-sm text-white px-3 py-1 rounded-full flex items-center shadow-lg">
                      <FiStar className="w-3 h-3 text-yellow-400 mr-1 fill-current" />
                      <span className="text-sm font-bold">{salon.rating}</span>
                    </div>
                  </div>
                </div>

                {/* Content Section */}
                <div className="flex-1 p-6 lg:p-8">
                  <div className="flex flex-col h-full">
                    {/* Header */}
                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between mb-4">
                      <div className="mb-4 lg:mb-0">
                        <h3 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2 group-hover:text-black transition-colors">
                          {salon.name}
                        </h3>
                        <div className="flex items-center text-gray-600 mb-2">
                          <FiMapPin className="w-4 h-4 mr-2 text-gray-400" />
                          <span className="font-medium">{salon.city}</span>
                          <span className="mx-2 text-gray-300">•</span>
                          <span className="text-sm">{salon.address}</span>
                        </div>
                        <div className="flex items-center text-gray-600">
                          <FiClock className="w-4 h-4 mr-2 text-gray-400" />
                          <span className="text-sm font-medium">{salon.openTime}</span>
                        </div>
                      </div>
                      
                      {/* Contact Info */}
                      <div className="flex flex-col items-start lg:items-end space-y-2">
                        <div className="flex items-center text-gray-600">
                          <FiPhone className="w-4 h-4 mr-2 text-gray-400" />
                          <span className="text-sm font-medium">{salon.phone}</span>
                        </div>
                        <div className="flex items-center text-gray-600">
                          <FiStar className="w-4 h-4 mr-2 text-yellow-500" />
                          <span className="text-sm">
                            <span className="font-bold text-gray-900">{salon.rating}</span>
                            <span className="text-gray-500"> ({salon.reviews} reviews)</span>
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Specialties */}
                    <div className="mb-6">
                      <h4 className="text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wide">Specialties</h4>
                      <div className="flex flex-wrap gap-2">
                        {salon.specialties.map((specialty, idx) => (
                          <span 
                            key={idx}
                            className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full font-medium hover:bg-gray-200 transition-colors"
                          >
                            {specialty}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-wrap gap-3 mt-auto">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/appointment/${salon.id}`);
                        }}
                        className="flex-1 lg:flex-none bg-black text-white px-6 py-3 rounded-xl font-semibold hover:bg-gray-800 active:bg-gray-900 transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl min-w-[140px]"
                      >
                        Book Now
                      </button>
                      
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleGetDirections(salon);
                        }}
                        className="flex items-center justify-center px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 active:bg-gray-300 transition-all duration-200 transform hover:scale-105 active:scale-95 min-w-[120px]"
                      >
                        <FiMapPin className="w-4 h-4 mr-2" />
                        Directions
                      </button>
                      
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedSalon(salon);
                          setMapCenter(salon.position);
                        }}
                        className="flex items-center justify-center px-6 py-3 border-2 border-gray-200 text-gray-600 rounded-xl font-semibold hover:border-gray-400 hover:text-gray-800 active:bg-gray-50 transition-all duration-200 transform hover:scale-105 active:scale-95 min-w-[120px]"
                      >
                        <FiEye className="w-4 h-4 mr-2" />
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Hover Effect Line */}
              <div className="h-1 bg-gradient-to-r from-black via-gray-400 to-gray-200 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
            </div>
          ))}
        </div>

        {/* Modern Selected Salon Details */}
        {selectedSalon && (
          <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden max-w-6xl mx-auto">
            {/* Header */}
            <div className="bg-gradient-to-r from-black to-gray-800 text-white p-6">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-3xl font-bold mb-2">{selectedSalon.name}</h2>
                  <div className="flex items-center text-gray-200">
                    <FiMapPin className="w-4 h-4 mr-2" />
                    <span>{selectedSalon.city}</span>
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedSalon(null)} 
                  className="p-2 hover:bg-white hover:bg-opacity-20 rounded-full transition-colors"
                  aria-label="Close details"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Image */}
                <div className="lg:col-span-1">
                  <div className="relative group overflow-hidden rounded-xl">
                    <img
                      src={selectedSalon.image}
                      alt={selectedSalon.name}
                      className="w-full h-80 object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-60 transition-opacity duration-300"></div>
                  </div>
                </div>

                {/* Details */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Info Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="flex items-start">
                        <FiMapPin className="w-5 h-5 text-gray-400 mr-3 mt-1 flex-shrink-0" />
                        <div>
                          <p className="font-semibold text-gray-900">Address</p>
                          <p className="text-gray-600">{selectedSalon.address}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start">
                        <FiPhone className="w-5 h-5 text-gray-400 mr-3 mt-1 flex-shrink-0" />
                        <div>
                          <p className="font-semibold text-gray-900">Phone</p>
                          <p className="text-gray-600">{selectedSalon.phone}</p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-start">
                        <FiClock className="w-5 h-5 text-gray-400 mr-3 mt-1 flex-shrink-0" />
                        <div>
                          <p className="font-semibold text-gray-900">Hours</p>
                          <p className="text-gray-600">{selectedSalon.openTime}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start">
                        <FiStar className="w-5 h-5 text-yellow-500 mr-3 mt-1 flex-shrink-0" />
                        <div>
                          <p className="font-semibold text-gray-900">Rating</p>
                          <p className="text-gray-600">
                            {selectedSalon.rating} stars ({selectedSalon.reviews} reviews)
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Specialties */}
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">Specialties</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedSalon.specialties.map((specialty, idx) => (
                        <span 
                          key={idx}
                          className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full font-medium border border-gray-200 hover:bg-gray-200 transition-colors"
                        >
                          {specialty}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-4 pt-4 border-t border-gray-200">
                    <button
                      onClick={() => navigate(`/appointment/${selectedSalon.id}`)}
                      className="flex-1 lg:flex-none bg-black text-white px-8 py-4 rounded-xl font-bold hover:bg-gray-800 active:bg-gray-900 transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl min-w-[200px]"
                    >
                      Book Appointment
                    </button>
                    
                    <button
                      onClick={() => handleGetDirections(selectedSalon)}
                      className="flex items-center justify-center px-6 py-4 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 active:bg-gray-300 transition-all duration-200 transform hover:scale-105 active:scale-95"
                    >
                      <FiMapPin className="w-4 h-4 mr-2" />
                      Get Directions
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <LocationIndicator />
    </div>
  );
};

export default HomePage;