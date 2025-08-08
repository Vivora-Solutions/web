import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ProtectedAPI } from '../../utils/api';

import Header from './components/Header';
import { CheckCircle, Clock, CalendarCheck2 } from 'lucide-react';

const MyBookingsPage = () => {
  const navigate = useNavigate();
  const [ongoingBookings, setOngoingBookings] = useState([]);
  const [bookingHistory, setBookingHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      navigate('/login');
      return;
    }

    const fetchBookings = async () => {
      setLoading(true);
      try {
        const ongoingRes = await ProtectedAPI.get('/bookings');
        const historyRes = await ProtectedAPI.get('/bookings/history');
        setOngoingBookings(ongoingRes.data || []);
        setBookingHistory(historyRes.data?.data || []);
      } catch (error) {
        console.error('Error fetching bookings:', error);
      }
      setLoading(false);
    };

    fetchBookings();
  }, [navigate]);

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) return;

    try {
      await ProtectedAPI.delete(`/bookings/${bookingId}`);
      // Refresh bookings after deletion
      setOngoingBookings((prev) =>
        prev.filter((booking) => booking.booking_id !== bookingId)
      );
      alert('Booking cancelled successfully!');
    } catch (error) {
      console.error('Error cancelling booking:', error);
      alert('Failed to cancel booking. Try again.');
    }
  };

  const formatDateTime = (datetime) => {
    const date = new Date(datetime);
    return `${date.toLocaleDateString()} - ${date.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    })}`;
  };

  const BookingCard = ({ booking, showCancelButton }) => (
    <div className="bg-white hover:shadow-lg transition-shadow duration-300 rounded-2xl p-5 mb-6 border border-gray-200">
      <div className="flex justify-between items-center mb-2">
        <div>
          <h2 className="text-xl font-bold text-gray-800">{booking.salon.salon_name}</h2>
          <p className="text-sm text-gray-500">{booking.salon.salon_address}</p>
        </div>
        <span
          className={`text-xs font-semibold px-3 py-1 rounded-full ${
            booking.status === 'completed'
              ? 'bg-green-100 text-green-700'
              : 'bg-yellow-100 text-yellow-700'
          }`}
        >
          {booking.status.toUpperCase()}
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-gray-700 mb-4">
        <p><strong>👤 Stylist:</strong> {booking.stylist.stylist_name}</p>
        <p><strong>🕒 Start:</strong> {formatDateTime(booking.booking_start_datetime)}</p>
        <p><strong>✅ End:</strong> {formatDateTime(booking.booking_end_datetime)}</p>
        <p><strong>⏳ Duration:</strong> {booking.total_duration_minutes} mins</p>
        <p><strong>💰 Total Price:</strong> Rs. {booking.total_price}</p>
        {booking.notes && <p><strong>📝 Notes:</strong> {booking.notes}</p>}
      </div>

      {showCancelButton && booking.status !== 'completed' && (
        <div className="text-right">
          <button
            onClick={() => handleCancelBooking(booking.booking_id)}
            className="bg-red-500 hover:bg-red-600 text-white text-sm font-semibold py-2 px-4 rounded-xl"
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-10">
          <CalendarCheck2 className="inline-block w-7 h-7 text-blue-600 mr-2" />
          My Bookings
        </h1>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500 mb-4"></div>
            <span className="text-gray-500 text-lg">Loading your bookings...</span>
          </div>
        ) : (
          <>
            <section className="mb-12">
              <div className="flex items-center mb-4">
                <Clock className="w-5 h-5 text-blue-500 mr-2" />
                <h2 className="text-2xl font-semibold text-blue-800">Ongoing Bookings</h2>
              </div>
              {ongoingBookings.length > 0 ? (
                ongoingBookings.map((booking) => (
                  <BookingCard
                    key={booking.booking_id}
                    booking={booking}
                    showCancelButton={true}
                  />
                ))
              ) : (
                <p className="text-gray-500">No ongoing bookings found.</p>
              )}
            </section>

            <section>
              <div className="flex items-center mb-4">
                <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                <h2 className="text-2xl font-semibold text-green-800">Booking History</h2>
              </div>
              {bookingHistory.length > 0 ? (
                bookingHistory.map((booking) => (
                  <BookingCard
                    key={booking.booking_id}
                    booking={booking}
                    showCancelButton={false}
                  />
                ))
              ) : (
                <p className="text-gray-500">No booking history available.</p>
              )}
            </section>
          </>
        )}
      </div>
    </div>
  );
};

export default MyBookingsPage;
