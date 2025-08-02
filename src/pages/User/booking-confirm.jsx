import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useBookingStore from "../../store/bookingStore";
import API from "../../utils/api";
import Header from "../../components/Header/Header";


const BookingConfirm = () => {
  const navigate = useNavigate();

  const {
    bookingDetails,
    restoreBookingDetails,
    clearBookingDetails,
    hydrated,
  } = useBookingStore();

  const [salonDetails, setSalonDetails] = useState(null);
  const [services, setServices] = useState([]);
  const [confirmed, setConfirmed] = useState(false);
  const [loading, setLoading] = useState(false);

  // Restore from localStorage on mount
  useEffect(() => {
    restoreBookingDetails();
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    if (
      !confirmed &&
      (!bookingDetails ||
        !bookingDetails.serviceIds?.length ||
        !bookingDetails.stylistId ||
        !bookingDetails.date ||
        !bookingDetails.timeSlot)
    ) {
      navigate("/");
      return;
    }


    const fetchSalonAndServices = async () => {
      try {
        const serviceDetailsPromises = bookingDetails.serviceIds.map((id) =>
          API.get(`/salons/service-details?id=${id}`)
        );
        const responses = await Promise.all(serviceDetailsPromises);
        const serviceData = responses.map((res) => res.data);
        setServices(serviceData);
        if (serviceData.length > 0) {
          setSalonDetails(serviceData[0].salon);
        }
      } catch (error) {
        console.error("Failed to load service details:", error);
      }
    };

    fetchSalonAndServices();
  }, [hydrated, bookingDetails, navigate]);

  const handleConfirmBooking = async () => {
    if (!bookingDetails) {
      alert("No booking details found.");
      return;
    }
    setLoading(true);
    const { stylistId, serviceIds, timeSlot } = bookingDetails;
    const payload = {
      stylist_id: stylistId,
      service_ids: serviceIds,
      booking_start_datetime: timeSlot.start,
      notes: "Fasterrrrrrrrrrrr",
    };

    try {
      const response = await API.post("/bookings", payload);
      if (response.data.booking_id) {
        clearBookingDetails();
        setConfirmed(true);
        setTimeout(() => {
          navigate("/my-bookings");
        }, 2500); // wait 2.5 seconds before redirecting
      } else {
        alert("Booking failed. Please try again.");
      }
    } catch (error) {
      console.error("Booking error:", error);
      alert("An error occurred. Please try again.");
    }
    setLoading(false);
  };

  if (!bookingDetails || !salonDetails) return null;

  const { date, timeSlot } = bookingDetails;

  const formatTime = (isoString) => {
    const d = new Date(isoString);
    return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const formatDate = (isoString) => {
    const d = new Date(isoString);
    return d.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  const total = services.reduce((sum, s) => sum + s.price, 0);

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col">
      <Header />
      <div className="flex-1 flex flex-col items-center justify-center py-10 px-2 md:px-8">
        <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl border border-gray-100 p-8 flex flex-col items-center space-y-6">
          {!confirmed ? (
            <>
              <div className="flex flex-col items-center">
                <h1 className="text-2xl font-bold text-gray-900 mb-1">
                  Confirm Your Booking
                </h1>
                <p className="text-gray-500">
                  Please review your appointment details before confirming.
                </p>
              </div>
              <img
                src={salonDetails.salon_logo_link}
                alt="Salon Logo"
                className="w-24 h-24 rounded-full object-cover border-2 border-gray-200 shadow"
              />
              <div className="text-center">
                <h2 className="text-xl font-semibold text-gray-800">
                  {salonDetails.salon_name}
                </h2>
                <p className="text-gray-500">
                  {salonDetails.salon_location || "Colombo"}
                </p>
              </div>
              <div className="w-full border-t pt-4 space-y-2 text-gray-700">
                <div className="flex justify-between">
                  <span className="font-medium">Date</span>
                  <span>{formatDate(date)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Time Slot</span>
                  <span>
                    {formatTime(timeSlot.start)} -{" "}
                    {formatTime(timeSlot.end)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Duration</span>
                  <span>{services[0]?.duration_minutes || 45} min</span>
                </div>
                <div className="flex flex-col gap-1 pt-2">
                  {services.map((service, idx) => (
                    <div key={idx} className="flex justify-between text-sm">
                      <span>{service.service_name}</span>
                      <span>Rs {service.price}</span>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between text-lg font-bold pt-2 border-t mt-2">
                  <span>Total</span>
                  <span>Rs {total}</span>
                </div>
              </div>
              <button
                onClick={handleConfirmBooking}
                className="w-full py-3 text-base bg-indigo-600 text-white rounded-lg shadow hover:bg-indigo-700 transition disabled:opacity-50"
                disabled={loading}
              >
                {loading ? "Confirming..." : "Confirm Booking"}
              </button>
              <button
                onClick={() => navigate("/")}
                className="w-full py-3 text-base bg-gray-100 text-gray-500 border rounded-lg shadow"
              >
                Cancel
              </button>
            </>
          ) : (
            <>
              <div className="flex flex-col items-center">
                <div className="bg-green-100 rounded-full p-3 mb-2">
                  <svg
                    className="w-10 h-10 text-green-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <h1 className="text-2xl font-bold text-gray-900 mb-1">
                  Booking Confirmed!
                </h1>
                <p className="text-gray-500">
                  Your appointment has been successfully booked.
                </p>
              </div>
              <button
                onClick={() => navigate("/")}
                className="w-full py-3 text-base bg-indigo-600 text-white rounded-lg shadow hover:bg-indigo-700 transition"
              >
                Back to Home
              </button>
            </>
          )}
        </div>
      </div>
      <footer className="w-full bg-white border-t mt-auto py-4 px-4 text-center text-gray-500 text-sm shadow-inner">
        © {new Date().getFullYear()} Vivora. All rights reserved.
      </footer>
    </div>
  );
};

export default BookingConfirm;
