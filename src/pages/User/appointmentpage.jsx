import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiCalendar, FiClock, FiMapPin, FiPhone, FiUser, FiMail, FiCheck } from 'react-icons/fi';
import Header from './components/header';
import StarRating from './components/rating';
import LocationIndicator from './components/location';
import './appointmentpage.css';
import salonLogo from '../../assets/images/salonLogo.png';
import salonImage from '../../assets/images/salonImage.png';

const AppointmentPage = () => {
  const { salonId } = useParams();
  const navigate = useNavigate();

  // Hardcoded salon data for demonstration
  const mockSalons = {
    1: {
      id: 1,
      name: 'GlowUp Salon',
      type: 'Unisex Beauty Salon',
      rating: 4.5,
      location: 'Downtown',
      logo: salonLogo,
      phone: '123-456-7890',
      address: '123 Main St, City',
      images: [salonImage, salonImage],
      services: [
        { name: 'Haircut', price: 500, duration: '30 minutes', category: 'Male' },
        { name: 'Beard Trim', price: 300, duration: '15 minutes', category: 'Male' },
        { name: 'Facial', price: 1000, duration: '45 minutes', category: 'Female' },
        { name: 'Manicure', price: 700, duration: '40 minutes', category: 'Female' },
        { name: 'Kids Haircut', price: 400, duration: '20 minutes', category: 'Children' },
      ],
      providers: [
        { id: 1, name: 'Alice', avatar: '/avatars/alice.jpg', categories: ['Female', 'Unisex'], availableTimes: ['9:00 AM', '11:00 AM', '2:00 PM'] },
        { id: 2, name: 'Bob', avatar: '/avatars/bob.jpg', categories: ['Male', 'Unisex'], availableTimes: ['10:00 AM', '1:00 PM', '3:00 PM'] },
        { id: 3, name: 'Charlie', avatar: '/avatars/charlie.jpg', categories: ['Children'], availableTimes: ['9:30 AM', '12:00 PM', '4:00 PM'] },
      ],
    },
    2: {
      id: 2,
      name: 'Elite Styles',
      type: 'Hair Studio',
      rating: 4.7,
      location: 'Uptown',
      logo: salonLogo,
      phone: '987-654-3210',
      address: '456 Another Rd, City',
      images: [salonImage],
      services: [
        { name: 'Hair Color', price: 1500, duration: '1 hour', category: 'Unisex' },
        { name: 'Styling', price: 1200, duration: '45 minutes', category: 'Unisex' },
      ],
      providers: [
        { id: 4, name: 'Diana', avatar: '/avatars/diana.jpg', categories: ['Unisex'], availableTimes: ['9:00 AM', '11:30 AM', '3:30 PM'] },
        { id: 5, name: 'Evan', avatar: '/avatars/evan.jpg', categories: ['Unisex'], availableTimes: ['10:30 AM', '1:30 PM', '4:30 PM'] },
      ],
    },
  };

  const salonData = mockSalons[salonId] || {
    name: 'Unknown Salon',
    type: '',
    rating: 0,
    location: '',
    logo: salonLogo,
    phone: '',
    address: '',
    images: [salonImage],
    services: [],
    providers: [],
  };

  const [selectedCategory, setSelectedCategory] = useState('Male');
  const [selections, setSelections] = useState([]);
  const [customerInfo, setCustomerInfo] = useState({ name: '', email: '', phone: '' });
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const categoryOptions = ['Male', 'Female', 'Children', 'Unisex'];

  // Filter services by category
  const filteredServices = salonData.services.filter(s => s.category === selectedCategory);

  // Toggle service selection or update provider/time
  const toggleSelection = (service, field, value) => {
    setSelections(prev => {
      const existingIndex = prev.findIndex(s => s.service.name === service.name);
      if (existingIndex >= 0) {
        if (field === 'service') {
          return prev.filter((_, i) => i !== existingIndex);
        }
        const newSelections = [...prev];
        newSelections[existingIndex] = { ...newSelections[existingIndex], [field]: value };
        return newSelections;
      }
      return [...prev, { service, provider: null, time: '' }];
    });
  };

  const handleCustomerInfoChange = (field, value) => {
    setCustomerInfo(prev => ({ ...prev, [field]: value }));
  };

  const totalPrice = selections.reduce((sum, s) => sum + s.service.price, 0);

  const handleProceedToPay = () => {
    if (!customerInfo.name || !customerInfo.email || !customerInfo.phone) {
      alert('Please fill in all your contact details before proceeding.');
      return;
    }
    if (selections.length === 0) {
      alert('Please select at least one service.');
      return;
    }
    if (selections.some(s => !s.provider || !s.time)) {
      alert('Please select a provider and time slot for each service.');
      return;
    }
    setShowSuccessModal(true);
  };

  const goBack = () => navigate(-1);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex items-center mb-6">
          <button
            onClick={goBack}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <FiArrowLeft className="w-4 h-4" />
            <span>Back to Salon Profile</span>
          </button>
        </div>

        {/* Salon Info */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-6">
            <div className="flex-shrink-0">
              <div className="w-20 h-20 bg-gray-100 rounded-full overflow-hidden border-4 border-gray-200">
                <img src={salonData.logo} alt="Salon Logo" className="w-full h-full object-cover" />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-3xl font-bold text-black mb-2">{salonData.name}</h1>
              <p className="text-gray-600 text-lg mb-3">{salonData.type}</p>
              <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-6">
                <div className="flex items-center">
                  <StarRating rating={salonData.rating} />
                  <span className="ml-2 text-sm text-gray-600">(128 reviews)</span>
                </div>
                <LocationIndicator location={salonData.location} />
                <div className="flex items-center text-sm text-gray-600">
                  <FiPhone className="w-4 h-4 mr-2" />
                  {salonData.phone}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <FiMapPin className="w-4 h-4 mr-2" />
                  {salonData.address}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Gallery */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-2xl font-bold text-black mb-6">Gallery</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {salonData.images.map((img, i) => (
              <div
                key={i}
                className="group aspect-square bg-gray-100 rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300"
              >
                <img
                  src={img}
                  alt={`Salon ${i + 1}`}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300 cursor-pointer"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Services + Booking */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8 space-y-4 lg:space-y-0">
                <div>
                  <h2 className="text-2xl font-bold text-black mb-2">Select Services</h2>
                  <p className="text-gray-600 text-sm">You can select multiple services to create your perfect appointment package</p>
                </div>
                <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
                  <div className="flex flex-wrap gap-2">
                    {categoryOptions.map((category) => (
                      <button
                        key={category}
                        className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${
                          selectedCategory === category
                            ? 'bg-black text-white shadow-lg'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:text-black'
                        }`}
                        onClick={() => setSelectedCategory(category)}
                      >
                        {category}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-4 mb-8">
                {filteredServices.map((service, index) => {
                  const selection = selections.find(s => s.service.name === service.name);
                  const isSelected = !!selection;
                  const compatibleProviders = salonData.providers.filter(p => p.categories.includes(service.category));

                  return (
                    <div
                      key={index}
                      className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 mb-4"
                    >
                      <div
                        onClick={() => toggleSelection(service, 'service')}
                        className={`group flex items-center justify-between p-4 border-2 rounded-xl transition-all duration-300 cursor-pointer ${
                          isSelected
                            ? 'border-blue-400 bg-blue-50 hover:border-blue-500 hover:bg-blue-100'
                            : 'border-gray-200 hover:border-black hover:shadow-md'
                        }`}
                      >
                        <div className="flex items-center space-x-4 flex-1">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-3">
                              <h3 className={`text-lg font-semibold ${isSelected ? 'text-blue-700' : 'text-black'}`}>
                                {service.name}
                              </h3>
                              {isSelected && (
                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                  Selected
                                </span>
                              )}
                            </div>
                            <p className={`text-sm mt-1 ${isSelected ? 'text-blue-600' : 'text-gray-500'}`}>
                              ⏱️ {service.duration}
                            </p>
                          </div>
                          <div className="text-right">
                            <span className={`text-lg font-bold ${isSelected ? 'text-blue-700' : 'text-black'}`}>
                              Rs {service.price.toLocaleString()}
                            </span>
                            <div className="flex items-center justify-end mt-1">
                              <span className="text-sm text-gray-500">
                                {isSelected ? 'Click to deselect' : 'Click to select'}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {isSelected && (
                        <div className="mt-6 border-t border-gray-200 pt-6">
                          <h4 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
                            <FiUser className="w-6 h-6 mr-3 text-gray-600" />
                            Select Provider for {service.name}
                          </h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                            {compatibleProviders.map(provider => (
                              <div
                                key={provider.id}
                                onClick={() => toggleSelection(service, 'provider', provider)}
                                className={`group cursor-pointer p-6 border-2 rounded-2xl transition-all duration-300 ${
                                  selection?.provider?.id === provider.id
                                    ? 'border-black bg-gray-50 shadow-lg transform scale-105'
                                    : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-md hover:bg-gray-50'
                                }`}
                              >
                                <div className="flex items-center space-x-4">
                                  <div className="relative">
                                    <div className={`w-16 h-16 rounded-2xl overflow-hidden border-4 transition-all duration-300 ${
                                      selection?.provider?.id === provider.id ? 'border-black' : 'border-gray-200 group-hover:border-gray-300'
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
                                    {selection?.provider?.id === provider.id && (
                                      <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-black rounded-full flex items-center justify-center">
                                        <FiCheck className="w-4 h-4 text-white" />
                                      </div>
                                    )}
                                  </div>
                                  <div className="flex-1">
                                    <h4 className={`text-lg font-bold transition-colors ${
                                      selection?.provider?.id === provider.id ? 'text-black' : 'text-gray-900 group-hover:text-black'
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

                          {selection?.provider && (
                            <div className="border-t border-gray-200 pt-6">
                              <h4 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
                                <FiCalendar className="w-5 h-5 mr-3 text-gray-600" />
                                Available Time Slots for {selection.provider.name}
                              </h4>
                              {selection.provider.availableTimes.length === 0 ? (
                                <div className="text-center py-12">
                                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <FiClock className="w-8 h-8 text-gray-400" />
                                  </div>
                                  <p className="text-gray-500 text-lg">No available time slots for today</p>
                                  <p className="text-gray-400 text-sm mt-2">Please try selecting a different provider or date</p>
                                </div>
                              ) : (
                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                                  {selection.provider.availableTimes.map(time => (
                                    <button
                                      key={time}
                                      onClick={() => toggleSelection(service, 'time', time)}
                                      className={`group px-4 py-3 rounded-xl border-2 font-semibold transition-all duration-200 ${
                                        selection?.time === time
                                          ? 'bg-black text-white border-black shadow-lg transform scale-105'
                                          : 'bg-white text-gray-700 border-gray-200 hover:border-gray-400 hover:bg-gray-50 hover:shadow-md'
                                      }`}
                                    >
                                      <div className="flex items-center justify-center">
                                        <FiClock className={`w-4 h-4 mr-2 ${selection?.time === time ? 'text-white' : 'text-gray-400 group-hover:text-gray-600'}`} />
                                        {time}
                                      </div>
                                    </button>
                                  ))}
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 sticky top-6">
              <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                <FiCalendar className="w-5 h-5 mr-3 text-gray-600" />
                Booking Summary & Payment
              </h3>

              {selections.length > 0 ? (
                <div className="space-y-4 mb-6 max-h-80 overflow-y-auto">
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 mb-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <FiCalendar className="w-5 h-5 text-blue-600 mr-2" />
                        <span className="font-semibold text-blue-900">
                          {selections.length} Service{selections.length !== 1 ? 's' : ''} Selected
                        </span>
                      </div>
                      <div className="text-sm text-blue-700">
                        Total: Rs {totalPrice.toLocaleString()}
                      </div>
                    </div>
                  </div>

                  {selections.map(({ service, provider, time }, idx) => {
                    const bookingKey = `${service.name}-${provider?.id || 'no-provider'}-${time || 'no-time'}-${idx}`;
                    return (
                      <div
                        key={bookingKey}
                        className="booking-card group relative border-2 border-gray-200 rounded-2xl p-5 bg-gradient-to-br from-gray-50 to-white hover:border-gray-300 hover:shadow-md transition-all duration-300"
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-bold text-gray-900 text-lg">{service.name}</h4>
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                                #{idx + 1}
                              </span>
                            </div>
                            <div className="flex items-center text-sm text-gray-600 mb-2">
                              <FiClock className="w-4 h-4 mr-2" />
                              <span>{service.duration}</span>
                              <span className="mx-2">•</span>
                              <span className="text-xs bg-gray-100 px-2 py-1 rounded">{service.category}</span>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-xl font-bold text-gray-900">
                              Rs {service.price.toLocaleString()}
                            </div>
                          </div>
                        </div>

                        <div className="space-y-2">
                          {provider && (
                            <div className="flex items-center text-sm">
                              <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center mr-3">
                                <FiUser className="w-4 h-4 text-gray-600" />
                              </div>
                              <div>
                                <span className="text-gray-500">Provider: </span>
                                <span className="font-semibold text-gray-900">{provider.name}</span>
                              </div>
                            </div>
                          )}
                          {time && (
                            <div className="flex items-center text-sm">
                              <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center mr-3">
                                <FiClock className="w-4 h-4 text-gray-600" />
                              </div>
                              <div>
                                <span className="text-gray-500">Time: </span>
                                <span className="font-semibold text-gray-900">{time}</span>
                              </div>
                            </div>
                          )}
                        </div>

                        <button
                          onClick={() => toggleSelection(service, 'service')}
                          className="absolute top-3 right-3 w-6 h-6 bg-gray-200 hover:bg-red-100 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 hover:scale-110"
                          title="Remove booking"
                        >
                          <svg className="w-3 h-3 text-gray-600 hover:text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>

                        <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-12 bg-gradient-to-b from-blue-400 to-blue-600 rounded-r-full"></div>
                      </div>
                    );
                  })}

                  <div className="border-t-2 border-gray-200 pt-6 mt-6">
                    <div className="bg-gradient-to-r from-gray-100 to-gray-50 rounded-2xl p-6">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-lg font-semibold text-gray-700">Subtotal</span>
                        <span className="text-lg font-bold text-gray-900">Rs {totalPrice.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center justify-between mb-4 text-sm">
                        <span className="text-gray-600">Service charge</span>
                        <span className="text-gray-600">Rs 0</span>
                      </div>
                      <div className="border-t border-gray-300 pt-4">
                        <div className="flex items-center justify-between">
                          <span className="text-xl font-bold text-gray-900">Total Amount</span>
                          <span className="text-2xl font-bold text-gray-900">Rs {totalPrice.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 mb-6">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FiCalendar className="w-8 h-8 text-gray-400" />
                  </div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">No Services Selected</h4>
                  <p className="text-gray-500 text-sm mb-2">Choose multiple services to create your perfect appointment</p>
                  <p className="text-gray-400 text-xs">You can select haircut, beard trim, facial, and more!</p>
                </div>
              )}

              <div className="space-y-4 mb-6">
                <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                  <FiUser className="w-5 h-5 mr-3 text-gray-600" />
                  Contact Information
                </h4>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      <FiUser className="inline w-4 h-4 mr-2" />
                      Full Name *
                    </label>
                    <input
                      type="text"
                      value={customerInfo.name}
                      onChange={(e) => handleCustomerInfoChange('name', e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-gray-400 transition-all duration-200 bg-gray-50 focus:bg-white"
                      placeholder="Enter your full name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      <FiMail className="inline w-4 h-4 mr-2" />
                      Email Address *
                    </label>
                    <input
                      type="email"
                      value={customerInfo.email}
                      onChange={(e) => handleCustomerInfoChange('email', e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-gray-400 transition-all duration-200 bg-gray-50 focus:bg-white"
                      placeholder="Enter your email address"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      <FiPhone className="inline w-4 h-4 mr-2" />
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      value={customerInfo.phone}
                      onChange={(e) => handleCustomerInfoChange('phone', e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-gray-400 transition-all duration-200 bg-gray-50 focus:bg-white"
                      placeholder="Enter your phone number"
                    />
                  </div>
                </div>
              </div>

              <button
                onClick={handleProceedToPay}
                disabled={selections.length === 0 || selections.some(s => !s.provider || !s.time)}
                className="w-full bg-black text-white py-4 px-6 rounded-xl font-bold text-lg hover:bg-gray-800 active:bg-gray-900 transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                Proceed to Pay
              </button>
            </div>
          </div>
        </div>
      </div>

      {showSuccessModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-xl p-8 max-w-sm w-full text-center shadow-lg">
            <img
              src={salonData.logo}
              alt="Salon Logo"
              className="mx-auto mb-4 w-24 h-24 rounded-full object-cover"
            />
            <h2 className="text-2xl font-bold mb-2">Booking Successful!</h2>
            <p className="mb-6">Thank you for your booking. We look forward to seeing you!</p>
            <button
              onClick={() => {
                setShowSuccessModal(false);
                setSelections([]);
                setCustomerInfo({ name: '', email: '', phone: '' });
              }}
              className="px-6 py-3 bg-black text-white rounded-lg font-semibold hover:bg-gray-800 transition"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AppointmentPage;