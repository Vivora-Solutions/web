import React, { useState, useEffect } from 'react';
import { FiCalendar, FiClock, FiMapPin, FiX, FiHistory, FiEdit3, FiTrash2, FiCheckCircle, FiAlertCircle } from 'react-icons/fi';
import './bookingspage.css';

// Hardcoded dummy data
const dummyAppointments = [
  {
    id: 1,
    salonName: "Liyo Salon",
    location: "Colombo",
    logoUrl: "https://via.placeholder.com/60/f3f4f6/6b7280?text=LS",
    services: ["Hair Cutting and Shaving", "Oil Massage", "Beard Trimming"],
    date: "27 July 2025",
    time: "10:00 am - 10:45 am",
    price: 1700,
    status: "confirmed"
  },
  {
    id: 2,
    salonName: "Viora Spa",
    location: "Kandy",
    logoUrl: "https://via.placeholder.com/60/fef3c7/f59e0b?text=VS",
    services: ["Facial", "Manicure", "Pedicure"],
    date: "28 July 2025",
    time: "11:00 am - 12:00 pm",
    price: 2500,
    status: "confirmed"
  },
  {
    id: 3,
    salonName: "Glow Studio",
    location: "Galle",
    logoUrl: "https://via.placeholder.com/60/fce7f3/ec4899?text=GS",
    services: ["Bridal Makeup", "Hair Styling", "Nail Art"],
    date: "29 July 2025",
    time: "2:00 pm - 4:00 pm",
    price: 3200,
    status: "pending"
  }
];

const BookingsPage = () => {
  const [appointments, setAppointments] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    setAppointments(dummyAppointments);
  }, []);

  const handleCancelClick = (appointment) => {
    setSelectedBooking(appointment);
    setShowModal(true);
  };

  const confirmCancel = () => {
    const updated = appointments.filter(item => item.id !== selectedBooking.id);
    setAppointments(updated);
    setShowModal(false);
    setSelectedBooking(null);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Modern Header */}
      <div className="bg-white shadow-lg rounded-2xl mb-8 p-6 card-hover">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">My Bookings</h1>
            <p className="text-gray-600">Manage your upcoming appointments</p>
          </div>
          <button 
            onClick={() => setShowHistory(!showHistory)}
            className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-xl transition-all duration-300 button-hover"
          >
            <FiHistory className="text-lg" />
            <span className="font-medium">History</span>
          </button>
        </div>
      </div>

      {/* Appointments Grid */}
      <div className="grid gap-6">
        {appointments.map((apt, index) => (
          <div 
            key={apt.id} 
            className="bg-white shadow-lg rounded-2xl p-6 card-hover appointment-card"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className="flex flex-col md:flex-row gap-6">
              {/* Salon Info */}
              <div className="flex gap-4 flex-1">
                <div className="relative">
                  <img 
                    src={apt.logoUrl} 
                    alt={apt.salonName} 
                    className="rounded-2xl w-16 h-16 object-cover shadow-md image-hover" 
                  />
                  <div className={`absolute -top-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${
                    apt.status === 'confirmed' ? 'bg-green-500' : 'bg-yellow-500'
                  }`}></div>
                </div>
                
                <div className="flex-1">
                  <h2 className="text-xl font-bold text-gray-800 mb-1">{apt.salonName}</h2>
                  <div className="flex items-center text-gray-600 mb-3">
                    <FiMapPin className="text-red-500 mr-2" />
                    <span className="font-medium">{apt.location}</span>
                  </div>
                  
                  {/* Services */}
                  <div className="space-y-1">
                    {apt.services.map((service, idx) => (
                      <div key={idx} className="text-sm text-gray-700 bg-gray-50 px-3 py-1 rounded-lg inline-block mr-2 mb-1">
                        {service}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Appointment Details */}
              <div className="md:text-right space-y-3">
                <div className="flex md:justify-end items-center gap-2 text-gray-700">
                  <FiCalendar className="text-red-500" />
                  <span className="font-semibold">{apt.date}</span>
                </div>
                
                <div className="flex md:justify-end items-center gap-2 text-gray-700">
                  <FiClock className="text-red-500" />
                  <span className="font-medium">{apt.time}</span>
                </div>
                
                <div className="flex md:justify-end items-center gap-2">
                  <span className="text-2xl font-bold text-gray-800">Rs. {apt.price.toLocaleString()}</span>
                </div>
                
                {/* Status and Actions */}
                <div className="flex md:justify-end items-center gap-3 mt-4">
                  <span className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${
                    apt.status === 'confirmed' 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {apt.status === 'confirmed' ? <FiCheckCircle /> : <FiAlertCircle />}
                    {apt.status.charAt(0).toUpperCase() + apt.status.slice(1)}
                  </span>
                </div>
                
                {/* Action Buttons */}
                <div className="flex md:justify-end gap-2 mt-4">
                  <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl transition-all duration-300 button-hover">
                    <FiEdit3 />
                    <span>Reschedule</span>
                  </button>
                  <button 
                    onClick={() => handleCancelClick(apt)}
                    className="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-xl transition-all duration-300 button-hover shadow-md hover:shadow-lg"
                  >
                    <FiTrash2 />
                    <span>Cancel</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
        
        {appointments.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl text-gray-300 mb-4">📅</div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No appointments scheduled</h3>
            <p className="text-gray-500">Book your next appointment to see it here</p>
          </div>
        )}
      </div>

      {/* Cancel Confirmation Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md modal-enter">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                  <FiTrash2 className="text-red-600 text-xl" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-800">Cancel Booking</h3>
                  <p className="text-gray-600">This action cannot be undone</p>
                </div>
              </div>
              
              {selectedBooking && (
                <div className="bg-gray-50 rounded-xl p-4 mb-6">
                  <h4 className="font-semibold text-gray-800">{selectedBooking.salonName}</h4>
                  <p className="text-gray-600">{selectedBooking.date} at {selectedBooking.time}</p>
                  <p className="text-gray-700 font-medium">Rs. {selectedBooking.price.toLocaleString()}</p>
                </div>
              )}
              
              <div className="flex gap-3">
                <button
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium transition-all duration-300"
                >
                  Keep Booking
                </button>
                <button
                  onClick={confirmCancel}
                  className="flex-1 px-4 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl font-medium transition-all duration-300 shadow-md hover:shadow-lg"
                >
                  Cancel Booking
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingsPage;
