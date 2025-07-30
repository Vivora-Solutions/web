import useBookingStore from "../../store/bookingStore";
import { useEffect } from "react";
const BookingConfirm = () => {
  const { salonId, serviceIds, stylistId, date, timeSlot } = useBookingStore();
    const { clearBookingDetails } = useBookingStore();

const handleConfirmBooking = async () => {
  // confirm booking API call
  clearBookingDetails();
};

  useEffect(() => {
    if (!salonId || !serviceIds.length || !stylistId || !date || !timeSlot) {
      // optional: redirect back or show error
      console.warn("Missing booking details.");
    }
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Confirm Your Booking</h1>
      <p><strong>Salon:</strong> {salonId}</p>
      <p><strong>Stylist:</strong> {stylistId}</p>
      <p><strong>Date:</strong> {date}</p>
      <p><strong>Time:</strong> {new Date(timeSlot.start).toLocaleTimeString()} - {new Date(timeSlot.end).toLocaleTimeString()}</p>
    </div>
  );
};

export default BookingConfirm;
