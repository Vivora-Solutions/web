import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useBookingStore from "../store/bookingStore"; // adjust path

const Signup = () => {
  const navigate = useNavigate();
  const restoreBookingDetails = useBookingStore((state) => state.restoreBookingDetails);
  const bookingDetails = useBookingStore((state) => state.bookingDetails);

  useEffect(() => {
    restoreBookingDetails();
  }, []);

  const handleSignupSuccess = () => {
    // After successful signup/login
    if (bookingDetails) {
      navigate("/booking-confirm");
    } else {
      navigate("/"); // or customer dashboard
    }
  };

  // Call `handleSignupSuccess()` after signup or login is completed
};
