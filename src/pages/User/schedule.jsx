import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import useBookingStore from '../../store/bookingStore';
import Header from "../../components/Header/Header";
import API from '../../utils/api';

const defaultProfilePic =
  "https://ui-avatars.com/api/?name=No+Image&background=ccc&color=555&size=100";

function getDateNDaysFromToday(n) {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return d;
}

function formatDayCircle(date) {
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
  });
}

function formatDayLabel(date) {
  return date.toLocaleDateString("en-GB", {
    weekday: "short",
  });
}

const Schedule = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { 
    salonId, 
    serviceIds, 
    serviceNames,
    servicePrices,
    serviceDurations,
    salon_logo_link, 
    salon_name, 
    salon_average_rating, 
    salon_address 
  } = location.state || {};

   console.log("Selec Prices: ", servicePrices.map(s=> s.price))

  const [stylists, setStylists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedStylistId, setSelectedStylistId] = useState(null);
  const [timeSlots, setTimeSlots] = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(false);

  // For 7-day calendar
  const [calendarOffset, setCalendarOffset] = useState(0);

  const setBookingDetails = useBookingStore((state) => state.setBookingDetails);

  useEffect(() => {
    if (!salonId || !serviceIds) return;

    const fetchStylists = async () => {
      try {
        const response = await axios.post("http://localhost:3000/api/bookings/eligible-stylists", {
          salonId,
          serviceIds,
        });

        if (response.data.success) {
          setStylists(response.data.data);
        } else {
          console.error("API responded with success: false");
        }
      } catch (error) {
        console.error("Failed to fetch stylists:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStylists();
  }, [salonId, serviceIds]);

  const handleStylistClick = async (stylistId) => {
    if (!selectedDate) {
      alert("Please select a date first.");
      return;
    }

    setSelectedStylistId(stylistId);
    setTimeSlots([]);
    setLoadingSlots(true); // Start loading

    try {
      const response = await axios.post("http://localhost:3000/api/salons/available-time-slots", {
        service_ids: serviceIds,
        stylist_id: stylistId,
        salon_id: salonId,
        date: selectedDate,
      });

      if (response.data.success) {
        setTimeSlots(response.data.data);
      } else {
        console.error("Failed to fetch time slots.");
      }
    } catch (err) {
      console.error("Error fetching time slots:", err);
    } finally {
      setLoadingSlots(false);
    }
  };

  const handleTimeSlotClick = async (slot) => {
    const details = {
      salonId,
      serviceIds,
      stylistId: selectedStylistId,
      date: selectedDate,
      timeSlot: slot,
    };

    setBookingDetails(details);

    try {
      const response = await API.get("/auth/me");
      if (response.data && response.data.email) {
        navigate("/booking-confirm");
      } else {
        localStorage.setItem("redirectAfterLogin", "booking-confirm");
        navigate("/login");
      }
    } catch (err) {
      localStorage.setItem("redirectAfterLogin", "booking-confirm");
      navigate("/login");
    }
  };

  const formatTime = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (!salonId || !serviceIds) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="bg-white p-6 rounded-xl shadow text-red-500 text-center">
          Missing salon or service information.<br />Please go back and select services again.
        </div>
      </div>
    );
  }

  // Generate 7 days for the calendar, allow going back up to 4 days before today
  const minOffset = -4;
  const days = Array.from({ length: 7 }, (_, i) => getDateNDaysFromToday(i + calendarOffset));
  const todayISO = new Date().toISOString().slice(0, 10);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <Header />
      <div className="py-8 px-2 md:px-8 flex flex-col lg:flex-row gap-8">
        {/* Main content left */}
        <div className="flex-1">
          <h1 className="text-2xl md:text-3xl font-bold mb-6 text-gray-900">Choose a Stylist</h1>

          {/* Custom 7-day calendar */}
          <div className="mb-8 flex flex-col md:flex-row md:items-center gap-4">
            <label className="font-medium text-gray-700 mb-2 md:mb-0">Select a date:</label>
            <div className="flex items-center gap-2">
              <button
                type="button"
                className="rounded-full bg-gray-200 hover:bg-gray-300 text-gray-600 px-3 py-2 transition"
                onClick={() => setCalendarOffset((prev) => Math.max(prev - 7, minOffset))}
                disabled={calendarOffset <= minOffset}
                title="Previous 7 days"
              >
                &lt;
              </button>
              <div className="flex gap-2">
                {days.map((date, idx) => {
                  const iso = date.toISOString().slice(0, 10);
                  const isSelected = selectedDate === iso;
                  return (
                    <button
                      key={iso}
                      type="button"
                      onClick={() => {
                        setSelectedDate(iso);
                        setSelectedStylistId(null);
                        setTimeSlots([]);
                      }}
                      className={`flex flex-col items-center justify-center w-14 h-14 rounded-full border-2 shadow-sm transition-all
                        ${isSelected
                          ? "bg-indigo-600 border-indigo-700 text-white scale-105"
                          : "bg-white border-gray-200 text-gray-700 hover:bg-blue-50"
                        }
                      `}
                    >
                      <span className="text-base font-semibold">{formatDayCircle(date)}</span>
                      <span className="text-xs">{formatDayLabel(date)}</span>
                    </button>
                  );
                })}
              </div>
              <button
                type="button"
                className="rounded-full bg-gray-200 hover:bg-gray-300 text-gray-600 px-3 py-2 transition"
                onClick={() => setCalendarOffset((prev) => prev + 7)}
                title="Next 7 days"
              >
                &gt;
              </button>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              <span className="ml-3 text-gray-500">Loading stylists...</span>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-10">
              {stylists.length > 0 ? (
                stylists.map((stylist) => (
                  <div
                    key={stylist.stylist_id}
                    onClick={() => handleStylistClick(stylist.stylist_id)}
                    className={`group flex items-center gap-4 bg-white shadow-md rounded-2xl p-5 hover:shadow-xl transition-all duration-300 cursor-pointer hover:-translate-y-1 border-2 w-full
                      ${selectedStylistId === stylist.stylist_id
                        ? "border-blue-500 ring-2 ring-blue-200"
                        : "border-gray-100 hover:border-blue-200"
                      }
                    `}
                  >
                    <div className="relative">
                      <img
                        src={stylist.profile_pic_link || defaultProfilePic}
                        alt={stylist.stylist_name}
                        className="w-16 h-16 rounded-full object-cover border-2 border-gray-200 shadow-sm group-hover:border-blue-300 transition-colors"
                      />
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 border-2 border-white rounded-full"></div>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-800 group-hover:text-blue-600 transition-colors">
                        {stylist.stylist_name}
                      </h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-sm text-gray-500">
                          {stylist.specialty || "Stylist"}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 mt-1">
                        <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                        <p className="text-sm text-green-600 font-medium">Available</p>
                      </div>
                    </div>
                    <div className="text-blue-600 group-hover:text-blue-700 transition-colors">
                      <svg
                        className="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500">No stylists available for selected services.</p>
              )}
            </div>
          )}

          {selectedStylistId && (
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-800">Available Time Slots</h2>
              {loadingSlots ? (
                <div className="flex justify-center items-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                  <span className="ml-3 text-gray-500">Loading slots...</span>
                </div>
              ) : timeSlots.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 max-h-60 overflow-y-auto">
                  {timeSlots.map((slot, index) => (
                    <button
                      key={index}
                      onClick={() => handleTimeSlotClick(slot)}
                      className="flex items-center justify-between border border-blue-100 rounded-lg px-4 py-3 bg-blue-50 hover:bg-blue-100 transition cursor-pointer shadow-sm w-full"
                    >
                      <span className="font-medium text-gray-700">{formatTime(slot.start)}</span>
                      <span className="mx-2 text-gray-400">to</span>
                      <span className="font-medium text-gray-700">{formatTime(slot.end)}</span>
                    </button>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No slots available for this stylist on selected date.</p>
              )}
            </div>
          )}
        </div>
        {/* Salon Info right */}
        <div className="w-full lg:w-96 flex-shrink-0">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 space-y-4 sticky top-24">
            <div className="flex items-center gap-4">
              <img
                src={salon_logo_link}
                alt="Salon Logo"
                className="w-16 h-16 rounded-full object-cover border-2 border-gray-200 shadow"
              />
              <div>
                <h2 className="text-xl font-bold text-gray-900">{salon_name}</h2>
                <div className="flex items-center gap-2 mt-1">
                  <div className="flex text-yellow-400 text-lg">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <span key={i}>
                        {i < (salon_average_rating || 0) ? "★" : "☆"}
                      </span>
                    ))}
                  </div>
                  <span className="text-sm text-gray-500">
                    ({salon_average_rating || 0}/5)
                  </span>
                </div>
                <div className="flex items-center gap-1 mt-1">
                  <svg
                    className="w-4 h-4 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  <span className="text-gray-500">{salon_address}</span>
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-base font-semibold text-gray-800 mb-2">Selected Services</h3>
              <ul className="list-disc pl-5 text-gray-700">
                {Array.isArray(serviceNames) && serviceNames.length > 0 ? (
                  serviceNames.map((name, idx) => (
                    <li key={idx}>
                      <span className="font-semibold">{name}</span>
                      <span className="ml-2 text-gray-500">| Duration: <span className="font-mono">{serviceDurations?.[idx] || 0} min</span></span>
                      <span className="ml-2 text-gray-500">| Price: <span className="font-mono">{servicePrices?.[idx] || 0} Rs</span></span>
                    </li>
                  ))
                ) : (
                  <li className="text-gray-400">No services selected</li>
                )}
              </ul>
              {/* Total Duration and Price */}
              {Array.isArray(serviceDurations) && Array.isArray(servicePrices) && serviceDurations.length > 0 && servicePrices.length > 0 && (
                <div className="mt-4 p-3 rounded-lg bg-gray-50 border border-gray-200 flex flex-col gap-2">
                  <div className="flex justify-between text-base text-gray-700">
                    <span className="font-medium">Total Duration:</span>
                    <span>{serviceDurations.reduce((a, b) => a + (b || 0), 0)} min</span>
                  </div>
                  <div className="flex justify-between text-base text-gray-700">
                    <span className="font-medium">Total Price:</span>
                    <span className="font-bold text-indigo-700">Rs {servicePrices.reduce((a, b) => a + (b || 0), 0).toLocaleString()}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Schedule;
