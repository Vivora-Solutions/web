import React, { useState, useEffect, useRef } from 'react';
import Header from './components/header';
import StarRating from './components/rating';
import LocationIndicator from './components/location';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { FiMapPin, FiClock, FiStar, FiPhone, FiNavigation, FiEye, FiChevronLeft, FiChevronRight, FiChevronUp, FiChevronDown, FiRefreshCw } from 'react-icons/fi';
import './salonprofile.css';
import salonLogo from '../../assets/images/salonLogo.png';
import salonImage from '../../assets/images/salonimage.png';

// Fix Leaflet default markers
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Create custom red marker icon
const createRedMarker = (isOpen = true) => {
  const color = isOpen ? '#ef4444' : '#6b7280';
  
  return new L.Icon({
    iconUrl: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
      <svg width="32" height="42" viewBox="0 0 32 42" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M16 0C7.163 0 0 7.163 0 16c0 16 16 26 16 26s16-10 16-26C32 7.163 24.837 0 16 0z" fill="${color}"/>
        <circle cx="16" cy="16" r="8" fill="white"/>
        <circle cx="16" cy="16" r="4" fill="${color}"/>
      </svg>
    `)}`,
    iconSize: [32, 42],
    iconAnchor: [16, 42],
    popupAnchor: [0, -42],
    className: 'custom-red-marker'
  });
};

const HomePage = () => {
  const salonData = {
    name: 'Liyo Salon',
    type: 'Hair and Beauty',
    rating: 4,
    location: 'Colombo',
    logo: 'salonLogo',
    images: [salonImage, salonImage, salonImage],
    services: [
      { name: 'Hair Cutting and Shaving', price: 1400, duration: '45 minutes', category: 'Male' },
      { name: 'Oil Massage', price: 300, category: 'Unisex' },
      { name: 'Beard Trimming', price: 300, category: 'Male' },
      { name: 'Hair Coloring', price: 1500, category: 'Female' },
      { name: 'Kids Haircut', price: 800, category: 'Children' },
      { name: 'Facial', price: 1200, category: 'Female' },
      { name: 'Full Body Massage', price: 2500, category: 'Unisex' },
    ],
  };

  const salonList = [
    {
      id: 1,
      name: "Liyo Salon",
      city: "Colombo",
      address: "123 Galle Road, Colombo 03",
      rating: 4.5,
      reviews: 128,
      openTime: "9:00 AM - 8:00 PM",
      phone: "+94 11 234 5678",
      specialties: ["Hair Cut", "Beard Trim", "Massage"],
      image: salonImage,
      position: [6.9271, 79.8612],
      isOpen: true,
    },
    {
      id: 2,
      name: "Nivora Cuts",
      city: "Kandy",
      address: "456 Peradeniya Road, Kandy",
      rating: 4.2,
      reviews: 95,
      openTime: "10:00 AM - 7:30 PM",
      phone: "+94 81 234 5678",
      specialties: ["Hair Color", "Facial", "Styling"],
      image: salonImage,
      position: [7.2906, 80.6337],
      isOpen: true,
    },
    {
      id: 3,
      name: "Glow Studio",
      city: "Galle",
      address: "789 Main Street, Galle Fort",
      rating: 4.8,
      reviews: 203,
      openTime: "8:30 AM - 6:00 PM",
      phone: "+94 91 234 5678",
      specialties: ["Bridal", "Makeup", "Spa"],
      image: salonImage,
      position: [6.0320, 80.2170],
      isOpen: false,
    },
  ];

  const [selectedCategory, setSelectedCategory] = useState('Male');
  const [selectedServices, setSelectedServices] = useState([]);
  const [selectedSalon, setSelectedSalon] = useState(null);
  const [mapCenter, setMapCenter] = useState([6.9271, 79.8612]);

  const toggleService = (service) => {
    const exists = selectedServices.find((s) => s.name === service.name);
    if (exists) {
      setSelectedServices(selectedServices.filter((s) => s.name !== service.name));
    } else {
      setSelectedServices([...selectedServices, service]);
    }
  };

  const handleSalonSelect = (salon) => {
    setSelectedSalon(salon);
    setMapCenter(salon.position);
  };

  const handleGetDirections = (salon) => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${salon.position[0]},${salon.position[1]}`;
    window.open(url, '_blank');
  };

  const total = selectedServices.reduce((sum, service) => sum + service.price, 0);
  const duration = selectedServices.length > 0 ? selectedServices[0].duration || 'Varies' : '0 minutes';
  const filteredServices = salonData.services.filter((s) => s.category === selectedCategory);
  const categoryOptions = ['Male', 'Female', 'Children', 'Unisex'];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* === Ultra-Modern Responsive Map Section === */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden mb-8">
          {/* Map Header */}
          <div className="bg-gradient-to-r from-gray-50 to-white p-6 border-b border-gray-100">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Find Nearby Salons</h2>
                <p className="text-gray-600 text-lg">Discover the best salons in your area with our interactive map</p>
              </div>
              <div className="mt-4 sm:mt-0 flex items-center space-x-4">
                <div className="flex items-center bg-green-50 px-3 py-2 rounded-full">
                  <div className="w-3 h-3 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                  <span className="text-sm font-semibold text-green-700">Open Now ({salonList.filter(s => s.isOpen).length})</span>
                </div>
                <div className="flex items-center bg-red-50 px-3 py-2 rounded-full">
                  <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                  <span className="text-sm font-semibold text-red-700">Closed ({salonList.filter(s => !s.isOpen).length})</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Ash-White Theme Map Container */}
          <div className="bg-gray-50 rounded-3xl shadow-lg border-2 border-gray-200 overflow-hidden">
            {/* Map Header */}
            <div className="bg-gradient-to-r from-gray-100 to-white text-gray-900 p-6 relative overflow-hidden border-b border-gray-200">
              <div className="relative z-10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="bg-gray-200 p-3 rounded-2xl">
                      <FiMapPin className="w-6 h-6 text-gray-700" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold mb-1 text-gray-900">Interactive Salon Map</h2>
                      <p className="text-gray-600 text-sm">Clear ash-white theme with detailed directions</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="bg-green-100 px-3 py-1 rounded-full border border-green-200">
                      <span className="text-green-700 text-sm font-bold">{salonList.filter(s => s.isOpen).length} Open</span>
                    </div>
                    <div className="bg-gray-100 px-3 py-1 rounded-full border border-gray-200">
                      <span className="text-gray-700 text-sm font-bold">{salonList.filter(s => !s.isOpen).length} Closed</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Interactive Map - Ash White Theme */}
            <div className="h-[500px] w-full relative overflow-hidden bg-gray-50">
              <MapContainer 
                center={mapCenter} 
                zoom={12} 
                className="w-full h-full ash-white-map"
                zoomControl={true}
                attributionControl={false}
                style={{ height: '100%', width: '100%' }}
                maxBounds={[
                  [5.5, 79.0], // Southwest coordinates
                  [8.0, 82.0]  // Northeast coordinates
                ]}
                minZoom={8}
                maxZoom={18}
              >
                <TileLayer
                  url="https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png"
                  attribution=""
                  className="ash-white-tiles"
                />
                
                {/* Custom Labels Layer */}
                <TileLayer
                  url="https://{s}.basemaps.cartocdn.com/light_only_labels/{z}/{x}/{y}{r}.png"
                  attribution=""
                  className="ash-labels"
                />
                
                {salonList.map((salon, index) => (
                  <Marker 
                    key={salon.id} 
                    position={salon.position}
                    icon={createRedMarker(salon.isOpen)}
                  >
                    <Popup 
                      className="ash-white-popup"
                      maxWidth={320}
                      closeButton={true}
                      autoClose={false}
                      closeOnEscapeKey={true}
                    >
                      <div className="bg-white rounded-xl shadow-2xl border border-gray-200 p-5 min-w-80">
                        {/* Salon Header */}
                        <div className="flex items-start space-x-4 mb-4 pb-4 border-b border-gray-100">
                          <img 
                            src={salon.image} 
                            alt={salon.name}
                            className="w-20 h-20 object-cover rounded-xl shadow-md border-2 border-gray-100"
                          />
                          <div className="flex-1">
                            <h3 className="font-bold text-gray-900 text-xl mb-1">{salon.name}</h3>
                            <p className="text-gray-600 text-sm mb-2 flex items-center">
                              <FiMapPin className="w-4 h-4 mr-1 text-gray-400" />
                              {salon.city}
                            </p>
                            <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${
                              salon.isOpen 
                                ? 'bg-green-50 text-green-700 border border-green-200' 
                                : 'bg-gray-50 text-gray-700 border border-gray-200'
                            }`}>
                              <div className={`w-2 h-2 rounded-full mr-2 ${
                                salon.isOpen ? 'bg-green-500 animate-pulse' : 'bg-gray-400'
                              }`}></div>
                              {salon.isOpen ? 'Open Now' : 'Closed'}
                            </div>
                          </div>
                        </div>
                        
                        {/* Salon Details */}
                        <div className="space-y-3 mb-5">
                          <div className="flex items-start">
                            <FiMapPin className="w-4 h-4 mr-3 text-gray-400 mt-0.5 flex-shrink-0" />
                            <span className="text-gray-700 text-sm leading-relaxed">{salon.address}</span>
                          </div>
                          <div className="flex items-center">
                            <FiClock className="w-4 h-4 mr-3 text-gray-400 flex-shrink-0" />
                            <span className="text-gray-700 text-sm">{salon.openTime}</span>
                          </div>
                          <div className="flex items-center">
                            <FiStar className="w-4 h-4 mr-3 text-yellow-500 flex-shrink-0" />
                            <span className="text-gray-700 text-sm">
                              <span className="font-semibold text-gray-900">{salon.rating}</span> 
                              <span className="text-gray-500"> ({salon.reviews} reviews)</span>
                            </span>
                          </div>
                          <div className="flex items-center">
                            <FiPhone className="w-4 h-4 mr-3 text-gray-400 flex-shrink-0" />
                            <span className="text-gray-700 text-sm">{salon.phone}</span>
                          </div>
                        </div>

                        {/* Specialties */}
                        <div className="mb-5">
                          <h4 className="text-gray-900 font-semibold text-sm mb-2">Specialties:</h4>
                          <div className="flex flex-wrap gap-1">
                            {salon.specialties.map((specialty, idx) => (
                              <span 
                                key={idx}
                                className="px-2 py-1 bg-gray-50 text-gray-700 text-xs rounded-md border border-gray-200"
                              >
                                {specialty}
                              </span>
                            ))}
                          </div>
                        </div>
                        
                        {/* Action Buttons */}
                        <div className="flex space-x-2">
                          <button 
                            onClick={() => handleGetDirections(salon)}
                            className="flex-1 flex items-center justify-center px-4 py-3 bg-white text-gray-700 text-sm font-semibold rounded-lg border-2 border-gray-200 hover:border-gray-400 hover:bg-gray-50 transition-all duration-300"
                          >
                            <FiNavigation className="w-4 h-4 mr-2" />
                            Get Directions
                          </button>
                          <button 
                            onClick={() => handleSalonSelect(salon)}
                            className="flex items-center justify-center px-4 py-3 bg-black text-white text-sm font-semibold rounded-lg hover:bg-gray-800 transition-all duration-300"
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

              {/* Map Controls Overlay */}
              <div className="absolute top-4 right-4 z-[1000] flex flex-col space-y-2">
                <button 
                  onClick={() => setMapCenter([6.9271, 79.8612])}
                  className="bg-white/90 backdrop-blur-sm text-gray-700 p-2 rounded-lg shadow-lg border border-gray-200 hover:bg-white hover:shadow-xl transition-all duration-300"
                  title="Reset to Default Location"
                >
                  <FiRefreshCw className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* === Modern Salon Cards with Enhanced Details === */}
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 mb-10">
          {salonList.map((salon) => (
            <div
              key={salon.id}
              className={`group bg-white border-2 rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer transform hover:-translate-y-1 ${
                selectedSalon?.id === salon.id 
                  ? 'border-black shadow-lg' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => handleSalonSelect(salon)}
            >
              {/* Image Section */}
              <div className="relative overflow-hidden">
                <img
                  src={salon.image}
                  alt={salon.name}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {/* Status Badge */}
                <div className="absolute top-4 right-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    salon.isOpen 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {salon.isOpen ? 'Open Now' : 'Closed'}
                  </span>
                </div>
                {/* Rating Badge */}
                <div className="absolute top-4 left-4 bg-black bg-opacity-80 text-white px-2 py-1 rounded-lg flex items-center">
                  <FiStar className="w-3 h-3 text-yellow-400 mr-1" />
                  <span className="text-sm font-medium">{salon.rating}</span>
                </div>
              </div>

              {/* Content Section */}
              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-black transition-colors">
                      {salon.name}
                    </h3>
                    <div className="flex items-center text-gray-600 text-sm mt-1">
                      <FiMapPin className="w-4 h-4 mr-1" />
                      {salon.city}
                    </div>
                  </div>
                </div>

                {/* Address */}
                <div className="text-gray-600 text-sm mb-3 line-clamp-2">
                  {salon.address}
                </div>

                {/* Specialties */}
                <div className="flex flex-wrap gap-1 mb-4">
                  {salon.specialties.slice(0, 3).map((specialty, index) => (
                    <span 
                      key={index}
                      className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                    >
                      {specialty}
                    </span>
                  ))}
                </div>

                {/* Time and Reviews */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-gray-600 text-sm">
                    <FiClock className="w-4 h-4 mr-2 text-gray-400" />
                    {salon.openTime}
                  </div>
                  <div className="flex items-center text-gray-600 text-sm">
                    <FiStar className="w-4 h-4 mr-2 text-yellow-500" />
                    {salon.reviews} reviews
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-2">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleGetDirections(salon);
                    }}
                    className="flex-1 flex items-center justify-center px-4 py-2 bg-gray-100 text-gray-700 text-sm rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    <FiNavigation className="w-4 h-4 mr-2" />
                    Directions
                  </button>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      window.open(`tel:${salon.phone}`, '_self');
                    }}
                    className="flex items-center justify-center px-4 py-2 bg-black text-white text-sm rounded-lg hover:bg-gray-800 transition-colors"
                  >
                    <FiPhone className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* === Selected Salon Details === */}
        {selectedSalon && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-8">
            <div className="flex flex-col lg:flex-row lg:items-start lg:space-x-8">
              {/* Salon Logo & Info */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-6 mb-6 lg:mb-0">
                <div className="flex-shrink-0">
                  <div className="w-24 h-24 bg-gray-100 rounded-full overflow-hidden border-4 border-gray-200">
                    <img 
                      src={salonLogo} 
                      alt="Salon Logo" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <h1 className="text-3xl font-bold text-black mb-2">{selectedSalon.name}</h1>
                  <p className="text-gray-600 text-lg mb-3">{salonData.type}</p>
                  <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-6">
                    <div className="flex items-center">
                      <StarRating rating={selectedSalon.rating} />
                      <span className="ml-2 text-sm text-gray-600">({selectedSalon.reviews} reviews)</span>
                    </div>
                    <LocationIndicator location={selectedSalon.city} />
                    <div className="flex items-center text-sm text-gray-600">
                      <FiPhone className="w-4 h-4 mr-2" />
                      {selectedSalon.phone}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* === Salon Images Gallery === */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-2xl font-bold text-black mb-6">Gallery</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {salonData.images.map((img, i) => (
              <div key={i} className="group aspect-square bg-gray-100 rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300">
                <img 
                  src={img} 
                  alt={`Salon ${i + 1}`} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300 cursor-pointer"
                />
              </div>
            ))}
          </div>
        </div>

        {/* === Services Section === */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          
          {/* Services Header & Filters */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8 space-y-4 lg:space-y-0">
            <h2 className="text-2xl font-bold text-black">Our Services</h2>
            
            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
              {/* Category Filter */}
              <div className="flex flex-wrap gap-2">
                {categoryOptions.map((category) => (
                  <button
                    key={category}
                    className={`px-6 py-3 rounded-full text-sm font-semibold transition-all duration-300 ${
                      selectedCategory === category
                        ? 'bg-black text-white shadow-lg transform scale-105'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:text-black hover:scale-105'
                    }`}
                    onClick={() => setSelectedCategory(category)}
                  >
                    {category}
                  </button>
                ))}
              </div>
              
              {/* Search Services */}
              <div className="relative flex-1 min-w-0 sm:max-w-xs">
                <input 
                  type="text" 
                  placeholder="Search Services" 
                  className="w-full px-4 py-3 border border-gray-300 rounded-full bg-gray-50 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent focus:bg-white transition-all duration-200"
                />
              </div>
            </div>
          </div>

          {/* Services List */}
          <div className="space-y-4 mb-8">
            {filteredServices.map((service, index) => (
              <div key={index} className="group flex items-center justify-between p-6 border-2 border-gray-200 rounded-xl hover:border-black hover:shadow-md transition-all duration-300">
                <div className="flex items-center space-x-4 flex-1">
                  <input
                    type="checkbox"
                    onChange={() => toggleService(service)}
                    checked={selectedServices.some((s) => s.name === service.name)}
                    className="h-5 w-5 text-black border-gray-300 rounded focus:ring-black focus:ring-2 transition-all duration-200"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-black group-hover:text-gray-800 transition-colors">
                      {service.name}
                    </h3>
                    {service.duration && (
                      <p className="text-sm text-gray-500 mt-1">⏱️ {service.duration}</p>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xl font-bold text-black">Rs {service.price.toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Payment Summary */}
          {selectedServices.length > 0 && (
            <div className="border-t-2 border-gray-200 pt-8">
              <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-6 space-y-6">
                
                {/* Payment Method */}
                <button className="w-full flex items-center justify-center space-x-3 px-6 py-4 border-2 border-gray-300 rounded-xl text-gray-700 hover:bg-white hover:border-black hover:shadow-md transition-all duration-300 group">
                  <span className="text-2xl group-hover:scale-110 transition-transform duration-200">💳</span>
                  <span className="font-semibold text-lg">Pay at Venue</span>
                </button>
                
                {/* Summary Details */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center py-2">
                    <span className="text-gray-700 font-semibold text-lg">Duration</span>
                    <span className="text-black font-bold text-lg">{duration}</span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-t border-gray-300">
                    <span className="text-gray-900 font-bold text-xl">Total</span>
                    <span className="text-black font-bold text-2xl">Rs {total.toLocaleString()}</span>
                  </div>
                </div>
                
                {/* Proceed Button */}
                <button className="w-full bg-black text-white py-4 px-8 rounded-xl font-bold text-lg hover:bg-gray-800 active:bg-gray-900 transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl">
                  Proceed to Booking →
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
