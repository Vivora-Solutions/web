// src/components/BookingHistoryCard.js

import React, { useState, useEffect } from 'react';
import './bookinghistorycard.css'; // make sure you create/update this CSS file

const BookingHistoryCard = ({ appointment }) => {
  const [data, setData] = useState(appointment || {});

  useEffect(() => {
    const fetchAppointment = async () => {
      try {
        const response = await fetch(`/api/appointments/${appointment.id}`);
        const result = await response.json();
        setData(result);
      } catch (error) {
        console.error('Error fetching appointment:', error);
      }
    };

    if (appointment?.id) {
      fetchAppointment();
    }
  }, [appointment]);

  return (
    <div className="booking-history-card">
      <div className="booking-header">
        <span className="salon-name">
          {data.salonName} • {data.location}
        </span>
        <div className="salon-logo">
          <img src={data.logoUrl} alt="Salon Logo" />
        </div>
      </div>

      <div className="services">
        <span>{data.services?.join(' • ')}</span>
      </div>

      <div className="appointment-details">
        <span className="date-time">{data.date} {data.time}</span>
        <span className="price">Rs {data.price}</span>
      </div>

      <div className="history-actions">
        <button className="rebook-btn">Rebook</button>
      </div>
    </div>
  );
};

export default BookingHistoryCard;
