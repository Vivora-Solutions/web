import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiUser, FiClock, FiCheck, FiCalendar } from 'react-icons/fi';
import Header from './components/header';
import './appointmentpage.css';

const SelectProviderPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { salonId, servicesWithProviders, category } = location.state || {};

  if (!servicesWithProviders || !Array.isArray(servicesWithProviders) || servicesWithProviders.length === 0) {
    navigate(-1);
    return null;
  }

  const [selections, setSelections] = useState(
    servicesWithProviders.map(({ service }) => ({
      service,
      selectedProvider: null,
      selectedTime: '',
    }))
  );

  const updateSelection = (index, field, value) => {
    setSelections(prev => {
      const newSelections = [...prev];
      newSelections[index] = { ...newSelections[index], [field]: value };
      return newSelections;
    });
  };

  const onConfirm = () => {
    const incompleteSelections = selections.some(
      selection => !selection.selectedProvider || !selection.selectedTime
    );
    if (incompleteSelections) {
      alert('Please select a provider and a time slot for each service.');
      return;
    }

    const newBookings = selections.map(({ service, selectedProvider, selectedTime }) => ({
      service: {
        name: service.name,
        price: service.price,
        duration: service.duration,
        category: service.category,
      },
      provider: {
        id: selectedProvider.id,
        name: selectedProvider.name,
        categories: selectedProvider.categories,
      },
      time: selectedTime,
    }));

    navigate(`/appointment/${salonId}`, {
      state: {
        newBookings,
      },
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-3 px-6 py-3 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 shadow-sm hover:shadow-md group"
          >
            <FiArrowLeft className="w-5 h-5 text-gray-600 group-hover:text-gray-800 transition-colors" />
            <span className="font-medium text-gray-700 group-hover:text-gray-900">Back to Services</span>
          </button>
          
          <div className="text-right">
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Select Providers</h1>
            <p className="text-gray-600 mt-1">Choose your preferred service providers and time slots</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {servicesWithProviders.map(({ service, providers }, index) => (
              <div key={service.name} className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 mb-8">
                <div className="flex items-center space-x-4 mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center">
                    <FiUser className="w-8 h-8 text-gray-600" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-1">{service.name}</h2>
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <div className="flex items-center">
                        <FiClock className="w-4 h-4 mr-2" />
                        <span>{service.duration}</span>
                      </div>
                      <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                      <span className="font-semibold text-gray-900">Rs {service.price.toLocaleString()}</span>
                      <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                      <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">{category}</span>
                    </div>
                  </div>
                </div>

                <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                  <FiUser className="w-6 h-6 mr-3 text-gray-600" />
                  Available Providers
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                  {providers.map(provider => (
                    <div
                      key={provider.id}
                      onClick={() => updateSelection(index, 'selectedProvider', provider)}
                      className={`group cursor-pointer p-6 border-2 rounded-2xl transition-all duration-300 ${
                        selections[index].selectedProvider?.id === provider.id
                          ? 'border-black bg-gray-50 shadow-lg transform scale-105'
                          : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-md hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center space-x-4">
                        <div className="relative">
                          <div className={`w-16 h-16 rounded-2xl overflow-hidden border-4 transition-all duration-300 ${
                            selections[index].selectedProvider?.id === provider.id ? 'border-black' : 'border-gray-200 group-hover:border-gray-300'
                          }`}>
                            <img
                              src={provider.avatar}
                              alt={provider.name}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjY0IiBoZWlnaHQ9IjY0IiByeD0iMzIiIGZpbGw9IiNGM0Y0RjYiLz4KPHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4PSIyMCIgeT0iMjAiPgo8cGF0aCBkPSJNMjAgMjFWMTlBNCA0IDAgMCAwIDE2IDE1SDhBNCA0IDAgMCAwIDQgMTlWMjEiIHN0cm9rZT0iIzlDQTNBRiIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz4KPGNpcmNsZSBjeD0iMTIiIGN5PSI3IiByPSI0IiBzdHJva2U9IiM5Q0EzQUYiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+Cjwvc3ZnPgo8L3N2Zz4K';
                              }}
                            />
                          </div>
                          {selections[index].selectedProvider?.id === provider.id && (
                            <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-black rounded-full flex items-center justify-center">
                              <FiCheck className="w-4 h-4 text-white" />
                            </div>
                          )}
                        </div>
                        
                        <div className="flex-1">
                          <h4 className={`text-lg font-bold transition-colors ${
                            selections[index].selectedProvider?.id === provider.id ? 'text-black' : 'text-gray-900 group-hover:text-black'
                          }`}>
                            {provider.name}
                          </h4>
                          <p className="text-sm text-gray-600 mt-1">
                            Specializes in: {provider.categories.join(', ')}
                          </p>
                          <div className="flex items-center mt-2">
                            <div className="flex text-yellow-400">
                              {'★'.repeat(5)}
                            </div>
                            <span className="text-sm text-gray-500 ml-2">4.8 (127)</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {selections[index].selectedProvider && (
                  <div className="border-t border-gray-200 pt-8">
                    <h4 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
                      <FiCalendar className="w-5 h-5 mr-3 text-gray-600" />
                      Available Time Slots for {selections[index].selectedProvider.name}
                    </h4>
                    
                    {selections[index].selectedProvider.availableTimes.length === 0 ? (
                      <div className="text-center py-12">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                          <FiClock className="w-8 h-8 text-gray-400" />
                        </div>
                        <p className="text-gray-500 text-lg">No available time slots for today</p>
                        <p className="text-gray-400 text-sm mt-2">Please try selecting a different provider or date</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                        {selections[index].selectedProvider.availableTimes.map(time => (
                          <button
                            key={time}
                            onClick={() => updateSelection(index, 'selectedTime', time)}
                            className={`group px-4 py-3 rounded-xl border-2 font-semibold transition-all duration-200 ${
                              selections[index].selectedTime === time 
                                ? 'bg-black text-white border-black shadow-lg transform scale-105' 
                                : 'bg-white text-gray-700 border-gray-200 hover:border-gray-400 hover:bg-gray-50 hover:shadow-md'
                            }`}
                          >
                            <div className="flex items-center justify-center">
                              <FiClock className={`w-4 h-4 mr-2 ${selections[index].selectedTime === time ? 'text-white' : 'text-gray-400 group-hover:text-gray-600'}`} />
                              {time}
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 sticky top-6">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Booking Summary</h3>
              
              <div className="space-y-4 mb-6">
                {selections.map(({ service, selectedProvider, selectedTime }, index) => (
                  <div key={service.name} className="space-y-2">
                    <div className="flex justify-between items-start">
                      <span className="text-gray-600">Service</span>
                      <span className="font-semibold text-gray-900 text-right">{service.name}</span>
                    </div>
                    <div className="flex justify-between items-start">
                      <span className="text-gray-600">Duration</span>
                      <span className="font-semibold text-gray-900">{service.duration}</span>
                    </div>
                    {selectedProvider && (
                      <div className="flex justify-between items-start">
                        <span className="text-gray-600">Provider</span>
                        <span className="font-semibold text-gray-900">{selectedProvider.name}</span>
                      </div>
                    )}
                    {selectedTime && (
                      <div className="flex justify-between items-start">
                        <span className="text-gray-600">Time</span>
                        <span className="font-semibold text-gray-900">{selectedTime}</span>
                      </div>
                    )}
                    <div className="border-t border-gray-200 pt-2 mt-2">
                      <div className="flex justify-between items-center">
                        <span className="text-lg font-bold text-gray-900">Subtotal</span>
                        <span className="text-lg font-bold text-gray-900">Rs {service.price.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                ))}
                
                <div className="border-t border-gray-200 pt-4 mt-6">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-gray-900">Total</span>
                    <span className="text-2xl font-bold text-gray-900">
                      Rs {selections.reduce((sum, s) => sum + s.service.price, 0).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={onConfirm}
                disabled={selections.some(s => !s.selectedProvider || !s.selectedTime)}
                className="w-full bg-black text-white py-4 px-6 rounded-xl font-bold text-lg hover:bg-gray-800 active:bg-gray-900 transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
              >
                {selections.every(s => s.selectedProvider && s.selectedTime)
                  ? 'Confirm All Selections'
                  : selections.some(s => s.selectedProvider)
                  ? 'Select Remaining Times'
                  : 'Select Providers'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SelectProviderPage;