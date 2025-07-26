import React, { useState } from "react";
import Header from './components/header';

const BookingsPage = () => {
  const [bookings, setBookings] = useState([
    {
      id: 1,
      salon: "Liyo Salon",
      location: "Colombo",
      services: ["Hair Cutting and Shaving", "Oil Massage", "Beard Trimming"],
      date: "2025-07-27",
      time: "10:00",
      displayDate: "27 July 2025",
      displayTime: "10.00 am - 10.45 am",
      price: 1700,
      image: "https://i.ibb.co/5RxP6fd/example-salon.png",
    },
  ]);

  const [bookingHistory] = useState([
    {
      id: 2,
      salon: "Classic Cuts",
      location: "Kandy",
      services: ["Hair Cut", "Facial"],
      date: "10 July 2025",
      time: "2.00 pm - 2.30 pm",
      price: 1500,
    },
  ]);

  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showRescheduleModal, setShowRescheduleModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showHistory, setShowHistory] = useState(false);
  const [newDate, setNewDate] = useState('');
  const [newTime, setNewTime] = useState('');

  const handleCancelClick = (bookingId) => {
    setSelectedBooking(bookingId);
    setShowCancelModal(true);
  };

  const handleRescheduleClick = (bookingId) => {
    const booking = bookings.find(b => b.id === bookingId);
    setSelectedBooking(bookingId);
    setNewDate(booking?.date || '');
    setNewTime(booking?.time || '');
    setShowRescheduleModal(true);
  };

  const confirmCancel = () => {
    setBookings(prev => prev.filter(b => b.id !== selectedBooking));
    setShowCancelModal(false);
    setSelectedBooking(null);
  };

  const confirmReschedule = () => {
    setBookings(prev =>
      prev.map(b =>
        b.id === selectedBooking ? {
          ...b,
          date: newDate,
          time: newTime,
          displayDate: formatDate(newDate),
          displayTime: formatTimeRange(newTime),
        } : b
      )
    );
    setShowRescheduleModal(false);
    setSelectedBooking(null);
    setNewDate('');
    setNewTime('');
  };

  // Helper to format date string yyyy-mm-dd to readable "27 July 2025"
  function formatDate(dateStr) {
    if (!dateStr) return '';
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateStr).toLocaleDateString(undefined, options);
  }

  // Helper to format time (HH:mm) to a range like "10.00 am - 10.45 am"
  // For simplicity, adds 45 minutes to selected time
  function formatTimeRange(startTime) {
    if (!startTime) return '';
    const [h, m] = startTime.split(':').map(Number);
    let endH = h;
    let endM = m + 45;
    if (endM >= 60) {
      endH += 1;
      endM -= 60;
    }
    function format(tH, tM) {
      const ampm = tH >= 12 ? 'pm' : 'am';
      const hour12 = tH % 12 === 0 ? 12 : tH % 12;
      return `${hour12}.${tM.toString().padStart(2, '0')} ${ampm}`;
    }
    return `${format(h, m)} - ${format(endH, endM)}`;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />

      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-semibold mb-6 text-gray-800">My Bookings</h1>

        {bookings.length === 0 ? (
          <p className="text-center text-gray-600">No active bookings.</p>
        ) : (
          bookings.map((booking) => (
            <div
              key={booking.id}
              className="bg-white rounded-lg border border-gray-300 p-6 mb-6 relative"
            >
              <img
                src={booking.image}
                alt="Salon"
                className="w-16 h-16 object-cover absolute top-6 right-6 rounded"
              />

              <div className="text-lg font-medium text-gray-900">
                {booking.salon}
                <span className="text-sm text-gray-500 ml-2">• {booking.location}</span>
              </div>

              <ul className="text-sm text-gray-600 mt-1 mb-3">
                {booking.services.map((service, index) => (
                  <li key={index}>{service}</li>
                ))}
              </ul>

              <div className="flex justify-between items-center text-gray-800 mb-5">
                <div>
                  <div className="font-semibold">{booking.displayDate || booking.date}</div>
                  <div className="text-sm">{booking.displayTime || booking.time}</div>
                </div>
                <div className="text-lg font-semibold">Rs {booking.price}</div>
              </div>

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
          ))
        )}

        <div className="text-center my-10">
          <button
            onClick={() => setShowHistory(!showHistory)}
            className="w-full max-w-md bg-gray-300 text-gray-800 py-3 rounded-lg font-medium hover:bg-gray-400 transition"
          >
            {showHistory ? "Hide Booking History" : "Show Booking History"}
          </button>
        </div>

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
        <div className="fixed inset-0 z-50 bg-white/30 backdrop-blur-sm flex items-center justify-center">

          <div className="bg-gray-50 p-6 rounded-lg shadow-2xl max-w-sm w-[90%] mx-4">
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
        <div className="fixed inset-0 z-50 bg-white/30 backdrop-blur-sm flex items-center justify-center">

          <div className="bg-gray-50 p-6 rounded-lg shadow-2xl max-w-sm w-[90%] mx-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Reschedule Booking</h3>

            <div className="mb-4">
              <label className="block text-sm text-gray-700 mb-1">New Date</label>
              <input
                type="date"
                className="w-full px-3 py-2 border border-gray-300 rounded"
                value={newDate}
                onChange={(e) => setNewDate(e.target.value)}
              />
            </div>
            <div className="mb-6">
              <label className="block text-sm text-gray-700 mb-1">New Time</label>
              <input
                type="time"
                className="w-full px-3 py-2 border border-gray-300 rounded"
                value={newTime}
                onChange={(e) => setNewTime(e.target.value)}
              />
            </div>

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
