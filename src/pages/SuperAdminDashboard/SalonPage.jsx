import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import Heading from '../../components/Header/Header'; // Adjust the path as needed
import './SalonPage.css';
import salonLogo from '../../assets/images/salonLogo.png';

const SalonBooking = () => {
  const { salonName: paramSalonName } = useParams(); // Get salon name from URL parameter
  const location = useLocation();
  const [salonName, setSalonName] = useState(paramSalonName ? decodeURIComponent(paramSalonName) : "Liyo Salon");
  const [locationState, setLocationState] = useState(location.state?.address || "Colombo");
  const [filter, setFilter] = useState('1 Month');
  const [serviceFilter, setServiceFilter] = useState('All'); 
  const [bookings] = useState(() => {
    // Simulate bookings based on salon name
    const baseBookings = [
      { date: '2025-07-20', bill: '$50', duration: '1h', time: '10:00 AM', mode: 'Online', service: 'Male' },
      { date: '2025-07-19', bill: '$30', duration: '45m', time: '2:00 PM', mode: 'In-Person', service: 'Female' },
      { date: '2025-07-18', bill: '$70', duration: '1h 30m', time: '11:00 AM', mode: 'Online', service: 'Children' },
      { date: '2025-07-17', bill: '$40', duration: '1h', time: '3:00 PM', mode: 'In-Person', service: 'Male' },
      { date: '2025-07-16', bill: '$60', duration: '1h 15m', time: '9:00 AM', mode: 'Online', service: 'Female' },
    ];
    // Filter bookings based on salon name (simplified logic)
    return baseBookings.filter(booking => 
      Math.random() > 0.3 || salonName === "Liyo Salon" // Randomly assign bookings, bias towards Liyo Salon
    );
  });

  useEffect(() => {
    if (paramSalonName) {
      setSalonName(decodeURIComponent(paramSalonName));
    }
    if (location.state?.address) {
      setLocationState(location.state.address);
    }
  }, [paramSalonName, location.state?.address]);

  const currentDate = new Date();
  const filterBookings = (bookingDate, service) => {
    const booking = new Date(bookingDate);
    const diffTime = Math.abs(currentDate - booking);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const timeFilter = {
      '1 Day': diffDays <= 1,
      '1 Week': diffDays <= 7,
      '1 Month': diffDays <= 30,
      '1 Year': diffDays <= 365,
    }[filter] || true;

    const serviceFilterMatch = serviceFilter === 'All' || service === serviceFilter;
    return timeFilter && serviceFilterMatch;
  };

  const filteredBookings = bookings.filter(booking => 
    filterBookings(booking.date, booking.service)
  );

  return (
    <div className="salon-booking-page">
      <Heading />
      <div className="salon-info">
        <img src={salonLogo} alt={`${salonName} Logo`} className="salon-logo" />
        <div className="salon-details">
          <h2>{salonName}</h2>
          <p>{locationState}</p>
        </div>
      </div>
      <div className="services">
        <h3>Services</h3>
        <div className="service-buttons">
          <button onClick={() => setServiceFilter('All')} className={serviceFilter === 'All' ? 'active' : ''}>All</button>
          <button onClick={() => setServiceFilter('Male')} className={serviceFilter === 'Male' ? 'active' : ''}>Male</button>
          <button onClick={() => setServiceFilter('Female')} className={serviceFilter === 'Female' ? 'active' : ''}>Female</button>
          <button onClick={() => setServiceFilter('Children')} className={serviceFilter === 'Children' ? 'active' : ''}>Children</button>
        </div>
      </div>
      <div className="bookings-section">
        <h3>All the list of bookings</h3>
        <div className="filter-buttons">
          <button onClick={() => setFilter('1 Day')} className={filter === '1 Day' ? 'active' : ''}>1 Day</button>
          <button onClick={() => setFilter('1 Week')} className={filter === '1 Week' ? 'active' : ''}>1 Week</button>
          <button onClick={() => setFilter('1 Month')} className={filter === '1 Month' ? 'active' : ''}>1 Month</button>
          <button onClick={() => setFilter('1 Year')} className={filter === '1 Year' ? 'active' : ''}>1 Year</button>
        </div>
        <table className="bookings-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Bill</th>
              <th>Duration</th>
              <th>Time</th>
              <th>Mode of Booking</th>
            </tr>
          </thead>
          <tbody>
            {filteredBookings.map((booking, index) => (
              <tr key={index}>
                <td>{booking.date}</td>
                <td>{booking.bill}</td>
                <td>{booking.duration}</td>
                <td>{booking.time}</td>
                <td>{booking.mode}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SalonBooking;