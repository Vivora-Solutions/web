import { create } from 'zustand';

const useBookingStore = create((set) => ({
  bookingDetails: null,
  setBookingDetails: (details) => {
    set({ bookingDetails: details });
    localStorage.setItem("pendingBooking", JSON.stringify(details)); // persist
  },
  restoreBookingDetails: () => {
    const stored = localStorage.getItem("pendingBooking");
    if (stored) {
      set({ bookingDetails: JSON.parse(stored) });
    }
  },
  clearBookingDetails: () => {
    localStorage.removeItem("pendingBooking");
    set({ bookingDetails: null });
  },
}));

export default useBookingStore;
