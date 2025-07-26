import React from 'react';
import { FiMapPin, FiClock, FiStar, FiPhone, FiNavigation } from 'react-icons/fi';
import './SalonCard.css';

const SalonCard = ({ 
  salon, 
  isSelected = false, 
  onSalonSelect, 
  onGetDirections 
}) => {
  
  const handleCardClick = () => {
    // 🔗 BACKEND API CONNECTION POINT:
    // Log salon card click for analytics
    // Example: await logUserAction('salon_card_clicked', { salonId: salon.id, userId: currentUser.id });
    
    onSalonSelect && onSalonSelect(salon);
  };

  const handleGetDirections = (e) => {
    e.stopPropagation();
    
    // 🔗 BACKEND API CONNECTION POINT:
    // Log directions click for analytics
    // Example: await logUserAction('directions_clicked_from_card', { salonId: salon.id, userId: currentUser.id });
    
    onGetDirections && onGetDirections(salon);
  };

  const handlePhoneCall = (e) => {
    e.stopPropagation();
    
    // 🔗 BACKEND API CONNECTION POINT:
    // Log phone call action for analytics
    // Example: await logUserAction('phone_call_clicked', { salonId: salon.id, phone: salon.phone, userId: currentUser.id });
    
    window.open(`tel:${salon.phone}`, '_self');
  };

  return (
    <div
      className={`group bg-white border-2 rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer transform hover:-translate-y-1 ${
        isSelected 
          ? 'border-black shadow-lg' 
          : 'border-gray-200 hover:border-gray-300'
      }`}
      onClick={handleCardClick}
    >
      {/* Image Section */}
      <div className="relative overflow-hidden">
        <img
          src={salon.image}
          alt={salon.name}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
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
          <div className="flex-1 min-w-0">
            <h3 className="text-xl font-bold text-gray-900 group-hover:text-black transition-colors truncate">
              {salon.name}
            </h3>
            <div className="flex items-center text-gray-600 text-sm mt-1">
              <FiMapPin className="w-4 h-4 mr-1 flex-shrink-0" />
              <span className="truncate">{salon.city}</span>
            </div>
          </div>
        </div>

        {/* Address */}
        <div className="text-gray-600 text-sm mb-3 line-clamp-2">
          {salon.address}
        </div>

        {/* Specialties */}
        <div className="flex flex-wrap gap-1 mb-4">
          {salon.specialties?.slice(0, 3).map((specialty, index) => (
            <span 
              key={index}
              className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
            >
              {specialty}
            </span>
          ))}
          {salon.specialties?.length > 3 && (
            <span className="px-2 py-1 bg-gray-100 text-gray-500 text-xs rounded-full">
              +{salon.specialties.length - 3}
            </span>
          )}
        </div>

        {/* Time and Reviews */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center text-gray-600 text-sm">
            <FiClock className="w-4 h-4 mr-2 text-gray-400 flex-shrink-0" />
            <span className="truncate">{salon.openTime}</span>
          </div>
          <div className="flex items-center text-gray-600 text-sm">
            <FiStar className="w-4 h-4 mr-2 text-yellow-500 flex-shrink-0" />
            <span>{salon.reviews} reviews</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-2">
          <button 
            onClick={handleGetDirections}
            className="flex-1 flex items-center justify-center px-4 py-2 bg-gray-100 text-gray-700 text-sm rounded-lg hover:bg-gray-200 transition-colors"
            title="Get directions to this salon"
          >
            <FiNavigation className="w-4 h-4 mr-2" />
            Directions
          </button>
          <button 
            onClick={handlePhoneCall}
            className="flex items-center justify-center px-4 py-2 bg-black text-white text-sm rounded-lg hover:bg-gray-800 transition-colors"
            title="Call this salon"
          >
            <FiPhone className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default SalonCard;
