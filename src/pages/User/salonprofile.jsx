import React, { useState } from 'react';
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

// Custom Marker
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
    className: 'custom-red-marker',
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

  const handleSalonSelect = (salon) => {
    setSelectedSalon(salon);
    setMapCenter(salon.position);
  };

  const handleGetDirections = (salon) => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${salon.position[0]},${salon.position[1]}`;
    window.open(url, '_blank');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Map Section */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden mb-8">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-3xl font-bold text-gray-900 mb-1">
              Find Nearby Salons
            </h2>
            <p className="text-gray-600 text-lg">
              Discover the best salons in your area with our interactive map
            </p>
          </div>

          <div className="h-[500px] w-full relative overflow-hidden bg-gray-50">
            <MapContainer
              center={mapCenter}
              zoom={12}
              style={{ height: '100%', width: '100%' }}
              maxBounds={[
                [5.5, 79.0],
                [8.0, 82.0],
              ]}
              minZoom={8}
              maxZoom={18}
            >
              <TileLayer
                url="https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png"
              />
              <TileLayer
                url="https://{s}.basemaps.cartocdn.com/light_only_labels/{z}/{x}/{y}{r}.png"
              />

              {salonList.map((salon) => (
                <Marker
                  key={salon.id}
                  position={salon.position}
                  icon={createRedMarker(salon.isOpen)}
                >
                  <Popup>
                    <div>
                      <h3 className="font-bold">{salon.name}</h3>
                      <p>{salon.address}</p>
                      <p>📞 {salon.phone}</p>
                      <p>🕒 {salon.openTime}</p>
                      <p>⭐ {salon.rating} ({salon.reviews} reviews)</p>
                      <div className="flex gap-2 mt-2">
                        <button
                          onClick={() => navigate(`/appointment/${salon.id}`)}
                          className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 text-sm"
                        >
                          Book Now
                        </button>
                        <button
                          onClick={() => handleGetDirections(salon)}
                          className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 text-sm"
                        >
                          Directions
                        </button>
                      </div>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>

            <div className="absolute top-4 right-4 z-[1000]">
              <button
                onClick={() => setMapCenter([6.9271, 79.8612])}
                className="bg-white/90 p-2 rounded-lg shadow-lg border border-gray-200"
                title="Reset Location"
              >
                <FiRefreshCw className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Salon Cards */}
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 mb-10">
          {salonList.map((salon) => (
            <div
              key={salon.id}
              onClick={() => handleSalonSelect(salon)}
              className="bg-white border rounded-xl p-4 shadow hover:shadow-lg cursor-pointer"
            >
              <img
                src={salon.image}
                alt={salon.name}
                className="w-full h-40 object-cover rounded mb-3"
              />
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-xl font-bold">{salon.name}</h3>
                <span className={`text-sm ${salon.isOpen ? 'text-green-600' : 'text-red-600'}`}>
                  {salon.isOpen ? 'Open' : 'Closed'}
                </span>
              </div>
              <p className="text-sm text-gray-600">{salon.city}</p>
              <p className="text-sm text-gray-500">{salon.address}</p>
              <p className="text-sm text-gray-600 mt-2">
                <strong>Specialties:</strong> {salon.specialties.join(', ')}
              </p>
              <div className="flex gap-2 mt-3">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/appointment/${salon.id}`);
                  }}
                  className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 text-sm"
                >
                  Book Now
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleGetDirections(salon);
                  }}
                  className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 text-sm"
                >
                  Directions
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedSalon(salon);
                    setMapCenter(salon.position);
                  }}
                  className="bg-gray-200 text-gray-800 px-3 py-1 rounded text-sm"
                >
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Selected Salon Details */}
        {selectedSalon && (
          <div className="bg-white rounded-2xl shadow p-6 max-w-4xl mx-auto">
            <div className="flex justify-between mb-4">
              <h2 className="text-2xl font-bold">{selectedSalon.name}</h2>
              <button onClick={() => setSelectedSalon(null)} className="text-gray-500 hover:text-gray-700">
                Close
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <img
                src={selectedSalon.image}
                alt={selectedSalon.name}
                className="w-full h-64 object-cover rounded"
              />
              <div className="sm:col-span-2 space-y-2">
                <p><strong>Address:</strong> {selectedSalon.address}</p>
                <p><strong>City:</strong> {selectedSalon.city}</p>
                <p><strong>Phone:</strong> {selectedSalon.phone}</p>
                <p><strong>Hours:</strong> {selectedSalon.openTime}</p>
                <p><strong>Specialties:</strong> {selectedSalon.specialties.join(', ')}</p>
                <button
                  onClick={() => navigate(`/appointment/${selectedSalon.id}`)}
                  className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  Book Appointment
                </button>
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
