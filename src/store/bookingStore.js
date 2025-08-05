import { create } from 'zustand';

const useBookingStore = create((set) => ({
  bookingDetails: null,
  hydrated: false, 
  setBookingDetails: (details) => {
    set({ bookingDetails: details });
    localStorage.setItem("pendingBooking", JSON.stringify(details));
  },
  restoreBookingDetails: () => {
    const stored = localStorage.getItem("pendingBooking");
    if (stored) {
      set({ bookingDetails: JSON.parse(stored), hydrated: true });
    } else {
      set({ hydrated: true }); // no data, but hydration completed
    }
  },
  clearBookingDetails: () => {
    localStorage.removeItem("pendingBooking");
    set({ bookingDetails: null });
  },
}));

export default useBookingStore;
