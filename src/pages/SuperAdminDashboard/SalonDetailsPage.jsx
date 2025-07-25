import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import API from '../../utils/api';
import './SalonDetailsPage.css';

const SalonDetailsPage = () => {
  const { salonid } = useParams();
  const [bookings, setBookings] = useState([]);
  const [salonInfo, setSalonInfo] = useState(null);
  const [selectedGender, setSelectedGender] = useState('Male');

  useEffect(() => {
    const fetchSalonInfo = async () => {
      try {
        const res = await API.get(`/super-admin/salons/${salonid}`);
        setSalonInfo(res.data); // 🎯 Salon details
      } catch (err) {
        console.error('Error fetching salon info:', err);
      }
    };

    const fetchBookings = async () => {
      try {
        const res = await API.get(`/super-admin/booking/${salonid}`);
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
    <div className="salon-details-container">
      <header className="salon-header">
        <div className="salon-info">
          <img
            src={salonInfo?.salon_logo_link || '/default-logo.png'}
            alt="salon logo"
            className="salon-logo"
          />
          <div>
            <h2>{salonInfo?.salon_name || 'Salon Name'}</h2>
            <p>{salonInfo?.salon_description || 'Description not provided'}</p>
            <p>📍 {salonInfo?.salon_address || 'Address not provided'}</p>
            <p>📞 {salonInfo?.salon_contact_number || 'Contact number not provided'}</p>
          </div>
        </div>
      </header>

      <section className="filter-section">
        <div className="gender-filter">
          <button onClick={() => filterByGender('Male')} className={selectedGender === 'Male' ? 'active' : ''}>Male</button>
          <button onClick={() => filterByGender('Female')} className={selectedGender === 'Female' ? 'active' : ''}>Female</button>
          <button onClick={() => filterByGender('Children')} className={selectedGender === 'Children' ? 'active' : ''}>Children</button>
          <button onClick={() => filterByGender('Unisex')} className={selectedGender === 'Unisex' ? 'active' : ''}>Unisex</button>
        </div>

        <div className="range-filter">
          <button>1 Day</button>
          <button>3 Days</button>
          <button>1 Week</button>
          <button>1 Month</button>
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
