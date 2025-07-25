// src/pages/BookingConfirm.js

import React from 'react';
import BlackButton from './components/blackbutton';
import './bookingconfirm.css';
import salonLogo from '../../assets/images/salonLogo.png'; // Replace with your actual path

const BookingConfirm = () => {
  // Example data (you can pass real props or state later)
  const booking = {
    salonName: 'Vivora Salon',
    location: '123 Main Street, Colombo',
    services: ['Haircut', 'Hair Color'],
    date: '2025-07-30',
    timeSlot: '2:00 PM - 3:30 PM',
    duration: '1.5 Hours',
    cost: 'Rs. 3500',
    paymentMethod: 'Pay at Venue'
  };

  return (
    <div className="confirm-container">
      <div className="confirm-box">
        <h2 className="confirm-title">Booking Confirmed ✅</h2>

        <div className="salon-info">
          <img src={salonLogo} alt="Salon Logo" className="salon-logo" />
          <h3>{booking.salonName}</h3>
          <p>{booking.location}</p>
        </div>

        <div className="booking-details">
          <h4>Selected Services</h4>
          <ul>
            {booking.services.map((service, index) => (
              <li key={index}>{service}</li>
            ))}
          </ul>

          <div className="info-line"><strong>Date:</strong> {booking.date}</div>
          <div className="info-line"><strong>Time Slot:</strong> {booking.timeSlot}</div>
          <div className="info-line"><strong>Duration:</strong> {booking.duration}</div>
          <div className="info-line"><strong>Cost:</strong> {booking.cost}</div>

          {booking.paymentMethod === 'Pay at Venue' && (
            <div className="pay-icon">💰 Pay at the Venue</div>
          )}
        </div>

        <BlackButton onClick={() => window.location.href = '/'}>Back to Home</BlackButton>
      </div>
    </div>
  );
};

export default BookingConfirm;
