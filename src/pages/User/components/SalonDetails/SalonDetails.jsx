import React from 'react';
import { MapPin, Clock, Phone, Star, Globe, Calendar } from 'lucide-react';
import './SalonDetails.css';

const SalonDetails = ({ salon, onBookAppointment, onCallSalon, onViewWebsite }) => {
  // API INTEGRATION POINT: Fetch detailed salon information
  // Example API call: GET /api/salons/{salonId}/details
  // Expected response: { id, name, description, address, phone, website, hours, rating, specialties, amenities }

  const handleBookAppointment = () => {
    // API INTEGRATION POINT: Navigate to booking flow
    // Example API call: POST /api/bookings/initialize
    // Payload: { salonId: salon.id, userId }
    console.log('Booking appointment for salon:', salon.id);
    onBookAppointment?.(salon);
  };

  const handleCallSalon = () => {
    // API INTEGRATION POINT: Track call interactions
    // Example API call: POST /api/analytics/salon-call
    // Payload: { salonId: salon.id, userId, callInitiated: true }
    console.log('Calling salon:', salon.phone);
    onCallSalon?.(salon.phone);
    window.open(`tel:${salon.phone}`);
  };

  const handleWebsiteVisit = () => {
    // API INTEGRATION POINT: Track website visits
    // Example API call: POST /api/analytics/website-visit
    // Payload: { salonId: salon.id, userId, websiteUrl: salon.website }
    console.log('Visiting salon website:', salon.website);
    onViewWebsite?.(salon.website);
    window.open(salon.website, '_blank', 'noopener,noreferrer');
  };

  const formatHours = (hours) => {
    if (!hours) return 'Hours not available';
    
    const today = new Date().toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
    const todayHours = hours[today];
    
    if (todayHours) {
      return `Today: ${todayHours}`;
    }
    
    return 'See full hours below';
  };

  const isOpenNow = (hours) => {
    if (!hours) return false;
    
    const now = new Date();
    const today = now.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
    const currentTime = now.getHours() * 100 + now.getMinutes();
    
    const todayHours = hours[today];
    if (!todayHours || todayHours.toLowerCase().includes('closed')) return false;
    
    const [open, close] = todayHours.split(' - ').map(time => {
      const [hours, minutes] = time.split(':').map(Number);
      return hours * 100 + (minutes || 0);
    });
    
    return currentTime >= open && currentTime <= close;
  };

  if (!salon) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <MapPin className="w-16 h-16 mx-auto" />
          </div>
          <p className="text-gray-500 text-lg">Select a salon to view details</p>
          <p className="text-gray-400 text-sm mt-2">Choose a salon from the map or list to see information</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      {/* Header Image */}
      {salon.image && (
        <div className="h-48 bg-gray-200 overflow-hidden">
          <img
            src={salon.image}
            alt={salon.name}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      <div className="p-6">
        {/* Salon Title & Rating */}
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">{salon.name}</h2>
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <Star className="w-5 h-5 fill-yellow-400 text-yellow-400 mr-1" />
                <span className="font-semibold text-gray-900">{salon.rating || '4.5'}</span>
                <span className="text-gray-500 ml-1">({salon.reviewCount || '127'} reviews)</span>
              </div>
              <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                isOpenNow(salon.hours) 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {isOpenNow(salon.hours) ? 'Open Now' : 'Closed'}
              </div>
            </div>
          </div>
        </div>

        {/* Description */}
        {salon.description && (
          <p className="text-gray-600 mb-6 leading-relaxed">{salon.description}</p>
        )}

        {/* Quick Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {/* Address */}
          <div className="flex items-start space-x-3">
            <MapPin className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium text-gray-900">Address</p>
              <p className="text-gray-600 text-sm">{salon.address}</p>
            </div>
          </div>

          {/* Hours */}
          <div className="flex items-start space-x-3">
            <Clock className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium text-gray-900">Hours</p>
              <p className="text-gray-600 text-sm">{formatHours(salon.hours)}</p>
            </div>
          </div>

          {/* Phone */}
          {salon.phone && (
            <div className="flex items-start space-x-3">
              <Phone className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium text-gray-900">Phone</p>
                <p className="text-gray-600 text-sm">{salon.phone}</p>
              </div>
            </div>
          )}

          {/* Website */}
          {salon.website && (
            <div className="flex items-start space-x-3">
              <Globe className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium text-gray-900">Website</p>
                <p className="text-gray-600 text-sm truncate">{salon.website}</p>
              </div>
            </div>
          )}
        </div>

        {/* Specialties */}
        {salon.specialties && salon.specialties.length > 0 && (
          <div className="mb-6">
            <h3 className="font-medium text-gray-900 mb-3">Specialties</h3>
            <div className="flex flex-wrap gap-2">
              {salon.specialties.map((specialty, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full"
                >
                  {specialty}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Amenities */}
        {salon.amenities && salon.amenities.length > 0 && (
          <div className="mb-6">
            <h3 className="font-medium text-gray-900 mb-3">Amenities</h3>
            <div className="grid grid-cols-2 gap-2">
              {salon.amenities.map((amenity, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-gray-600 text-sm">{amenity}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Full Hours Schedule */}
        {salon.hours && (
          <div className="mb-6">
            <h3 className="font-medium text-gray-900 mb-3">Hours</h3>
            <div className="space-y-2">
              {Object.entries(salon.hours).map(([day, hours]) => (
                <div key={day} className="flex justify-between items-center">
                  <span className="text-gray-600 capitalize">{day}</span>
                  <span className="text-gray-900 font-medium">{hours}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200">
          <button
            onClick={handleBookAppointment}
            className="flex-1 bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors font-medium flex items-center justify-center space-x-2"
          >
            <Calendar className="w-5 h-5" />
            <span>Book Appointment</span>
          </button>
          
          {salon.phone && (
            <button
              onClick={handleCallSalon}
              className="flex-1 bg-gray-100 text-gray-900 px-6 py-3 rounded-lg hover:bg-gray-200 transition-colors font-medium flex items-center justify-center space-x-2"
            >
              <Phone className="w-5 h-5" />
              <span>Call</span>
            </button>
          )}
          
          {salon.website && (
            <button
              onClick={handleWebsiteVisit}
              className="flex-1 bg-gray-100 text-gray-900 px-6 py-3 rounded-lg hover:bg-gray-200 transition-colors font-medium flex items-center justify-center space-x-2"
            >
              <Globe className="w-5 h-5" />
              <span>Website</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default SalonDetails;
