import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ProtectedAPI } from '../../utils/api';

const SalonDetailsPage = () => {
  const { salonid } = useParams();
  const [bookings, setBookings] = useState([]);
  const [salonInfo, setSalonInfo] = useState(null);
  const [selectedGender, setSelectedGender] = useState('Male');

  useEffect(() => {
    const fetchSalonInfo = async () => {
      try {
        const res = await ProtectedAPI.get(`/super-admin/salons/${salonid}`);
        setSalonInfo(res.data);
      } catch (err) {
        console.error('Error fetching salon info:', err);
      }
    };

    const fetchBookings = async () => {
      try {
        const res = await ProtectedAPI.get(`/super-admin/booking/${salonid}`);
        setBookings(res.data || []);
      } catch (err) {
        console.error('Error fetching bookings:', err);
      }
    };

    fetchSalonInfo();
    fetchBookings();
  }, [salonid]);

  const filterByGender = (gender) => {
    setSelectedGender(gender);
  };

  const filteredBookings = bookings.filter(b => b.gender === selectedGender);


  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <header className="bg-white p-6 rounded-xl shadow-md mb-8">
        <div className="flex gap-6 items-center">
          <img
            src={salonInfo?.salon_logo_link || '/default-logo.png'}
            alt="salon logo"
            className="w-24 h-24 object-cover rounded-lg border"
          />
          <div>
            <h2 className="text-2xl font-semibold text-gray-800">
              {salonInfo?.salon_name || 'Salon Name'}
            </h2>
            <p className="text-gray-600">{salonInfo?.salon_description || 'Description not provided'}</p>
            <p className="text-sm text-gray-500">📍 {salonInfo?.salon_address}</p>
            <p className="text-sm text-gray-500">📞 {salonInfo?.salon_contact_number}</p>
          </div>
        </div>
      </header>

      {/* Filter Section */}
      <section className="mb-6 flex flex-wrap gap-4 items-center justify-between">
        {/* Gender Filter */}
        <div className="flex gap-2">
          {['Male', 'Female', 'Children', 'Unisex'].map((gender) => (
            <button
              key={gender}
              onClick={() => filterByGender(gender)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                selectedGender === gender
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {gender}
            </button>
          ))}
        </div>

        {/* Time Range Filter (inactive logic but styled) */}
        <div className="flex gap-2">
          {['1 Day', '3 Days', '1 Week', '1 Month'].map((range) => (
            <button
              key={range}
              className="px-4 py-2 rounded-full text-sm bg-gray-100 text-gray-600 hover:bg-gray-200"
            >
              {range}
            </button>
          ))}
        </div>
      </section>

      <section className="booking-table">
  <table>
    <thead>
      <tr>
        <th>Date</th>
        <th>Service</th>
        <th>Stylist</th>
        <th>Duration</th>
        <th>Time</th>
        <th>Price</th>
        <th>Mode</th>
      </tr>
    </thead>
    <tbody>
      {bookings.length > 0 ? (
        bookings.map((booking) => {
          const start = new Date(booking.booking_start_datetime);
          const end = new Date(booking.booking_end_datetime);
          const formattedDate = start.toLocaleDateString();
          const formattedTime = `${start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - ${end.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
          const serviceName = booking.booking_services?.[0]?.service?.service_name || 'N/A';
          const stylistName = booking.stylist?.stylist_name || 'N/A';

          return (
            <tr key={booking.booking_id}>
              <td>{formattedDate}</td>
              <td>{serviceName}</td>
              <td>{stylistName}</td>
              <td>{booking.total_duration_minutes} mins</td>
              <td>{formattedTime}</td>
              <td>Rs. {booking.total_price}</td>
              <td>{booking.booked_mode}</td>
                    </tr>
                    );
                    })
                ) : (
                    <tr>
                    <td colSpan="7" style={{ textAlign: 'center' }}>
                        No bookings found.
                    </td>
                    </tr>
                )}
                </tbody>
            </table>
        </section>
    </div>
  );
};

export default SalonDetailsPage;
