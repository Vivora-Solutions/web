import React from 'react';
import BookingHistoryCard from './components/bookinghistorycard';
import Header from './components/header';
import './bookinghistorypage.css'; // optional page-specific styles

const dummyBookings = [
  {
    id: 1,
    salonName: 'Vivora Salon',
    location: 'Colombo',
    logoUrl: 'https://via.placeholder.com/40',
    services: ['Haircut', 'Shaving'],
    date: '2025-07-10',
    time: '3:00 PM',
    price: 2500,
  },
  {
    id: 2,
    salonName: 'GlowUp Studio',
    location: 'Kandy',
    logoUrl: 'https://via.placeholder.com/40',
    services: ['Facial', 'Hair Wash'],
    date: '2025-07-15',
    time: '11:00 AM',
    price: 4000,
  },
  {
    id: 3,
    salonName: 'Luxury Cuts',
    location: 'Galle',
    logoUrl: 'https://via.placeholder.com/40',
    services: ['Beard Trim'],
    date: '2025-07-20',
    time: '2:30 PM',
    price: 1200,
  },
];

const BookingHistoryPage = () => {
  return (
    <div className="booking-history-page">
      <Header />
      <h2 className="booking-heading">Booking History</h2>
      <div className="booking-list">
        {dummyBookings.map((booking) => (
          <BookingHistoryCard key={booking.id} appointment={booking} />
        ))}
      </div>
    </div>
  );
};

export default BookingHistoryPage;
