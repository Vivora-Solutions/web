import React, { useState } from "react";
import Header from './components/header';

const BookingsPage = () => {
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showRescheduleModal, setShowRescheduleModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showHistory, setShowHistory] = useState(false);

  const bookings = [
    {
      id: 1,
      salon: "Liyo Salon",
      location: "Colombo",
      services: ["Hair Cutting and Shaving", "Oil Massage", "Beard Trimming"],
      date: "27 July 2025",
      time: "10.00 am - 10.45 am",
      price: 1700,
      image: "https://i.ibb.co/5RxP6fd/example-salon.png",
    },
  ];

  const bookingHistory = [
    {
      id: 2,
      salon: "Classic Cuts",
      location: "Kandy",
      services: ["Hair Cut", "Facial"],
      date: "10 July 2025",
      time: "2.00 pm - 2.30 pm",
      price: 1500,
    },
  ];

  const handleCancelClick = (bookingId) => {
    setSelectedBooking(bookingId);
    setShowCancelModal(true);
  };

  const handleRescheduleClick = (bookingId) => {
    setSelectedBooking(bookingId);
    setShowRescheduleModal(true);
  };

  const confirmCancel = () => {
    // 🔁 Call API to cancel booking
    console.log("Booking canceled:", selectedBooking);
    setShowCancelModal(false);
    setSelectedBooking(null);
  };

  const confirmReschedule = () => {
    // 🔁 Call API to reschedule booking
    console.log("Booking rescheduled:", selectedBooking);
    setShowRescheduleModal(false);
    setSelectedBooking(null);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />

      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-semibold mb-6 text-gray-800">My Bookings</h1>

        {bookings.map((booking) => (
          <div
            key={booking.id}
            className="bg-white rounded-lg border border-gray-300 p-6 mb-6 relative"
          >
            {/* Image */}
            <img
              src={booking.image}
              alt="Salon"
              className="w-16 h-16 object-cover absolute top-6 right-6 rounded"
            />

            {/* Salon + Location */}
            <div className="text-lg font-medium text-gray-900">
              {booking.salon}
              <span className="text-sm text-gray-500 ml-2">• {booking.location}</span>
            </div>

            {/* Services */}
            <ul className="text-sm text-gray-600 mt-1 mb-3">
              {booking.services.map((service, index) => (
                <li key={index}>{service}</li>
              ))}
            </ul>

            {/* Date, Time & Price */}
            <div className="flex justify-between items-center text-gray-800 mb-5">
              <div>
                <div className="font-semibold">{booking.date}</div>
                <div className="text-sm">{booking.time}</div>
              </div>
              <div className="text-lg font-semibold">Rs {booking.price}</div>
            </div>

            {/* Buttons */}
            <div className="flex justify-center gap-4">
              <button
                onClick={() => handleRescheduleClick(booking.id)}
                className="border border-gray-700 text-gray-800 px-6 py-2 rounded hover:bg-gray-100"
              >
                Reschedule
              </button>
              <button
                onClick={() => handleCancelClick(booking.id)}
                className="bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700"
              >
                Cancel
              </button>
            </div>
          </div>
        ))}

        {/* Show History Button */}
        <div className="text-center my-10">
          <button
            onClick={() => setShowHistory(!showHistory)}
            className="w-full max-w-md bg-gray-300 text-gray-800 py-3 rounded-lg font-medium hover:bg-gray-400 transition"
          >
            {showHistory ? "Hide Booking History" : "Show Booking History"}
          </button>
        </div>

        {/* Booking History Section */}
        {showHistory && (
          <>
            <h2 className="text-xl font-semibold mb-4 text-gray-700">Booking History</h2>
            {bookingHistory.map((history) => (
              <div
                key={history.id}
                className="bg-white rounded-lg border border-gray-200 p-6 mb-4"
              >
                <div className="text-base font-medium text-gray-800">
                  {history.salon}
                  <span className="text-sm text-gray-500 ml-2">• {history.location}</span>
                </div>
                <ul className="text-sm text-gray-600 mt-1">
                  {history.services.map((s, idx) => (
                    <li key={idx}>{s}</li>
                  ))}
                </ul>
                <div className="text-sm text-gray-700 mt-2">
                  {history.date} | {history.time}
                </div>
                <div className="text-sm font-medium text-gray-800 mt-1">
                  Rs {history.price}
                </div>
              </div>
            ))}
          </>
        )}
      </div>

      {/* Cancel Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-30 backdrop-blur-sm flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-[90%] max-w-sm">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Cancel Booking</h3>
            <p className="text-sm text-gray-600 mb-6">
              Are you sure you want to cancel this booking?
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowCancelModal(false)}
                className="px-4 py-2 text-sm border border-gray-500 rounded hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={confirmCancel}
                className="px-4 py-2 text-sm bg-red-600 text-white rounded hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reschedule Modal */}
      {showRescheduleModal && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-30 backdrop-blur-sm flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-[90%] max-w-sm">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Reschedule Booking</h3>
            <p className="text-sm text-gray-600 mb-6">
              This feature will allow you to select a new time and date.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowRescheduleModal(false)}
                className="px-4 py-2 text-sm border border-gray-500 rounded hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={confirmReschedule}
                className="px-4 py-2 text-sm bg-red-600 text-white rounded hover:bg-red-700"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingsPage;
