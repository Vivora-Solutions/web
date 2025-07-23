// src/componants/AppointmentCard.js

import React, { useState, useEffect } from 'react';
import './appointmentcard.css';
import ConfirmationModal from './confirmation';


// The component now accepts an `onCancel` prop.
const AppointmentCard = ({ appointment, onCancel }) => {
  const [data, setData] = useState(appointment || {});

  useEffect(() => {
    // This useEffect hook is fine, it handles fetching data if needed.
    const fetchAppointment = async () => {
      try {
        const response = await fetch(`/api/appointments/${appointment.id}`);
        const result = await response.json();
        setData(result);
      } catch (error) {
        console.error('Error fetching appointment:', error);
      }
    };
    if (appointment?.id) fetchAppointment();
  }, [appointment]);

  return (
    <div className="appointment-card">
      <div className="appointment-header">
        <span className="salon-name">{data.salonName} • {data.location}</span>
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
      <div className="actions">
        <button className="reschedule-btn">Reschedule</button>
        {/* The onClick event handler now calls the onCancel prop with the appointment's ID. */}
        <button className="cancel-btn" onClick={() => onCancel(data.id)}>Cancel</button>
      </div>
    </div>
  );
};

export default AppointmentCard;