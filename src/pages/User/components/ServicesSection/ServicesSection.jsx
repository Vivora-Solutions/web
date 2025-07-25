import React, { useState } from 'react';
import { Star } from 'lucide-react';
import './ServicesSection.css';

const ServicesSection = ({ services = [], selectedServices, onServiceSelect, selectedSalon }) => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  
  // API INTEGRATION POINT: Fetch services from backend based on salon
  // Example API call: GET /api/salons/{salonId}/services
  // Expected response format: { id, name, price, duration, category, description, isAvailable }
  
  // Group services by category
  const categories = ['All', ...new Set(services.map(service => service.category))];
  
  const filteredServices = selectedCategory === 'All' 
    ? services 
    : services.filter(service => service.category === selectedCategory);

  const handleServiceToggle = (service) => {
    // API INTEGRATION POINT: Update selected services on backend
    // Example API call: POST /api/bookings/services
    // Payload: { salonId, serviceIds: [...selectedServices, serviceId] }
    console.log('Service selection changed:', service.id);
    onServiceSelect?.(service);
  };

  const handleBookNow = () => {
    // API INTEGRATION POINT: Navigate to booking page with selected services
    // Example: POST /api/bookings/initialize
    // Payload: { salonId: selectedSalon.id, services: selectedServices }
    console.log('Booking initiated with services:', selectedServices);
    console.log('For salon:', selectedSalon?.id);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Services</h2>
        <div className="text-sm text-gray-500">
          {selectedServices?.length || 0} selected
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2 mb-6">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              selectedCategory === category
                ? 'bg-black text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {filteredServices.map((service) => {
          const isSelected = selectedServices?.some(s => s.id === service.id);
          
          return (
            <div
              key={service.id}
              className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                isSelected
                  ? 'border-black bg-gray-50'
                  : 'border-gray-200 hover:border-gray-300'
              } ${!service.isAvailable ? 'opacity-50 cursor-not-allowed' : ''}`}
              onClick={() => service.isAvailable && handleServiceToggle(service)}
            >
              <div className="flex justify-between items-start mb-2">
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900">{service.name}</h3>
                  <p className="text-sm text-gray-600 mt-1">{service.description}</p>
                </div>
                <div className="ml-4 text-right">
                  <div className="font-semibold text-gray-900">${service.price}</div>
                  <div className="text-sm text-gray-500">{service.duration} min</div>
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                <div className="flex items-center text-sm text-gray-500">
                  <Star className="w-4 h-4 mr-1 fill-yellow-400 text-yellow-400" />
                  <span>{service.rating || '4.5'}</span>
                  <span className="ml-1">({service.reviews || '42'} reviews)</span>
                </div>
                
                {!service.isAvailable && (
                  <span className="text-xs text-red-500 font-medium">
                    Unavailable
                  </span>
                )}
                
                {isSelected && (
                  <div className="w-5 h-5 bg-black rounded-full flex items-center justify-center">
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Action Buttons */}
      {selectedServices?.length > 0 && (
        <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200">
          <div className="flex-1">
            <div className="text-sm text-gray-600 mb-1">Total estimated time:</div>
            <div className="font-semibold text-gray-900">
              {selectedServices.reduce((total, service) => total + service.duration, 0)} minutes
            </div>
          </div>
          <div className="flex-1">
            <div className="text-sm text-gray-600 mb-1">Total price:</div>
            <div className="font-semibold text-gray-900">
              ${selectedServices.reduce((total, service) => total + service.price, 0)}
            </div>
          </div>
          <button
            onClick={handleBookNow}
            className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors font-medium"
          >
            Book Selected Services
          </button>
        </div>
      )}

      {/* Empty State */}
      {filteredServices.length === 0 && (
        <div className="text-center py-8">
          <div className="text-gray-400 mb-2">
            <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <p className="text-gray-500">No services available in this category</p>
        </div>
      )}
    </div>
  );
};

export default ServicesSection;
