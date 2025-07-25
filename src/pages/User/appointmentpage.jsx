import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiCalendar, FiClock, FiMapPin, FiPhone, FiUser, FiMail } from 'react-icons/fi';
import Header from './components/header';
import StarRating from './components/rating';
import LocationIndicator from './components/location';
import './appointmentpage.css';
import salonLogo from '../../assets/images/salonLogo.png';
import salonImage from '../../assets/images/salonimage.png';

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
    },
  };

  // Select salon data by salonId or fallback
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
  };

  const [selectedCategory, setSelectedCategory] = useState('Male');
  const [selectedServices, setSelectedServices] = useState([]);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [customerInfo, setCustomerInfo] = useState({ name: '', email: '', phone: '' });

  const categoryOptions = ['Male', 'Female', 'Children', 'Unisex'];
  const timeSlots = [
    '9:00 AM', '9:30 AM', '10:00 AM', '10:30 AM',
    '11:00 AM', '11:30 AM', '12:00 PM', '12:30 PM',
    '1:00 PM', '1:30 PM', '2:00 PM', '2:30 PM',
    '3:00 PM', '3:30 PM', '4:00 PM', '4:30 PM',
    '5:00 PM', '5:30 PM', '6:00 PM', '6:30 PM'
  ];

  const toggleService = (service) => {
    const exists = selectedServices.find((s) => s.name === service.name);
    if (exists) {
      setSelectedServices(selectedServices.filter((s) => s.name !== service.name));
    } else {
      setSelectedServices([...selectedServices, service]);
    }
  };

  const handleCustomerInfoChange = (field, value) => {
    setCustomerInfo(prev => ({ ...prev, [field]: value }));
  };

  const handleBooking = () => {
    if (!selectedDate || !selectedTime || selectedServices.length === 0 || !customerInfo.name || !customerInfo.email || !customerInfo.phone) {
      alert('Please fill in all required fields');
      return;
    }
    console.log('Booking Details:', {
      salon: salonData.name,
      services: selectedServices,
      date: selectedDate,
      time: selectedTime,
      customer: customerInfo,
      total: total,
    });
    alert('Booking confirmed! You will receive a confirmation shortly.');
  };

  const goBack = () => navigate(-1);

  const total = selectedServices.reduce((sum, service) => sum + service.price, 0);
  const duration = selectedServices.length > 0 ? selectedServices[0].duration || 'Varies' : '0 minutes';
  const filteredServices = salonData.services.filter((s) => s.category === selectedCategory);

  const generateAvailableDates = () => {
    const dates = [];
    const today = new Date();
    for (let i = 1; i <= 30; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dates.push(date.toISOString().split('T')[0]);
    }
    return dates;
  };

  const availableDates = generateAvailableDates();

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
                <h2 className="text-2xl font-bold text-black">Select Services</h2>
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
                {filteredServices.map((service, index) => (
                  <div
                    key={index}
                    className="group flex items-center justify-between p-4 border-2 border-gray-200 rounded-xl hover:border-black hover:shadow-md transition-all duration-300"
                  >
                    <div className="flex items-center space-x-4 flex-1">
                      <input
                        type="checkbox"
                        onChange={() => toggleService(service)}
                        checked={selectedServices.some((s) => s.name === service.name)}
                        className="h-5 w-5 text-black border-gray-300 rounded focus:ring-black focus:ring-2"
                      />
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-semibold text-black">{service.name}</h3>
                        {service.duration && <p className="text-sm text-gray-500 mt-1">⏱️ {service.duration}</p>}
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-lg font-bold text-black">Rs {service.price.toLocaleString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-6">
              <h3 className="text-xl font-bold text-black mb-6">Book Appointment</h3>

              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <FiCalendar className="inline w-4 h-4 mr-2" />
                  Select Date
                </label>
                <select
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                >
                  <option value="">Choose a date</option>
                  {availableDates.map((date) => (
                    <option key={date} value={date}>
                      {new Date(date).toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <FiClock className="inline w-4 h-4 mr-2" />
                  Select Time
                </label>
                <div className="grid grid-cols-3 gap-2 max-h-48 overflow-y-auto">
                  {timeSlots.map((time) => (
                    <button
                      key={time}
                      onClick={() => setSelectedTime(time)}
                      className={`px-3 py-2 text-sm rounded-lg border transition-all ${
                        selectedTime === time
                          ? 'bg-black text-white border-black'
                          : 'bg-gray-50 text-gray-700 border-gray-300 hover:bg-gray-100'
                      }`}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-6 space-y-4">
                <h4 className="text-lg font-semibold text-black">Your Information</h4>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <FiUser className="inline w-4 h-4 mr-2" />
                    Full Name *
                  </label>
                  <input
                    type="text"
                    value={customerInfo.name}
                    onChange={(e) => handleCustomerInfoChange('name', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
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
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                    placeholder="Enter your email"
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
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                    placeholder="Enter your phone number"
                  />
                </div>
              </div>

              {selectedServices.length > 0 && (
                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                  <h4 className="font-semibold text-black mb-3">Booking Summary</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Services:</span>
                      <span>{selectedServices.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Duration:</span>
                      <span>{duration}</span>
                    </div>
                    <div className="flex justify-between font-bold text-lg border-t pt-2">
                      <span>Total:</span>
                      <span>Rs {total.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              )}

              <button
                onClick={handleBooking}
                disabled={selectedServices.length === 0}
                className="w-full bg-black text-white py-4 px-6 rounded-lg font-bold text-lg hover:bg-gray-800 active:bg-gray-900 transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                Confirm Booking
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppointmentPage;
