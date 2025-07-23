import React, { useState, useEffect } from 'react';
import Header from './componants/header';
import AppointmentCard from './componants/appointmentcard';
import ConfirmationModal from './componants/confirmation';
import './bookingspage.css';


const BookingsPage = () => {
  const [appointments, setAppointments] = useState([]);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [selectedAppointmentId, setSelectedAppointmentId] = useState(null);

  const handleCancelAppointment = (appointmentId) => {
    setSelectedAppointmentId(appointmentId);
    setShowConfirmation(true);
  };    

  const handleConfirmCancel = () => {
    // Logic to cancel the appointment
    console.log('Appointment cancelled:', selectedAppointmentId);
    setShowConfirmation(false);
  };    
  useEffect(() => {
    // Fetch data from backend API or use dummy data
    const fetchAppointments = async () => {
      try {
        const response = await fetch('/api/appointments/ongoing');
        const result = await response.json();
        setAppointments(result);
      } catch (error) {
        console.error('Error fetching appointments:', error);
      }
    };

    // Dummy data for testing
    const dummyAppointments = [
      {
        id: 1,
        salonName: "Liyo Salon",
        location: "Colombo",
        logoUrl: "https://via.placeholder.com/40",
        services: ["Hair Cutting and Shaving", "Oil Massage", "Beard Trimming"],
        date: "27 July 2025",
        time: "10:00 am - 10:45 am",
        price: 1700
      },
      {
        id: 2,
        salonName: "Viora Spa",
        location: "Kandy",
        logoUrl: "https://via.placeholder.com/40",
        services: ["Facial", "Manicure", "Pedicure"],
        date: "28 July 2025",
        time: "11:00 am - 12:00 pm",
        price: 2500},
      {
        id: 2,
        salonName: "Viora Spa",
        location: "Kandy",
        logoUrl: "https://via.placeholder.com/40",
        services: ["Facial", "Manicure", "Pedicure"],
        date: "28 July 2025",
        time: "11:00 am - 12:00 pm",
        price: 2500
      }
      
     
      
    ];

    // Use dummy data if API call fails or for initial load
    setAppointments(dummyAppointments);
    // Uncomment the line below to enable API call instead of dummy data
    // fetchAppointments();
  }, []);

  const handleViewHistory = () => {
    // Logic to navigate to booking history page
    console.log('View Booking History clicked');
  };

  return (
    <div className="bookings-page">
      <Header />
      <div className="content">
        <h2>Ongoing Bookings</h2>
        <div className="appointment-cards">
          {appointments.map((appointment, index) => (
            <AppointmentCard key={index} appointment={appointment} onCancel={handleCancelAppointment} />
          ))}
        </div>
        <button className="view-history-btn" onClick={handleViewHistory}>
          View Booking History
        </button>
      </div>
      {showConfirmation && (
        <ConfirmationModal
          message="Are you sure you want to cancel this appointment?"
          onConfirm={handleConfirmCancel}
          onCancel={() => setShowConfirmation(false)}
        />
      )}
    </div>
  );
};

export default BookingsPage;