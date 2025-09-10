import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import useBookingStore from "../../store/bookingStore";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { ProtectedAPI, PublicAPI } from "../../utils/api";
import {
  ChevronLeft,
  ChevronRight,
  MapPin,
  Star,
  CheckCircle,
} from "lucide-react";

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
    salon_address,
  } = location.state || {};

  const [stylists, setStylists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedStylistId, setSelectedStylistId] = useState(null);
  const [timeSlots, setTimeSlots] = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [calendarOffset, setCalendarOffset] = useState(0);
  const [showStylistSelection, setShowStylistSelection] = useState(true); // Add this state

  const setBookingDetails = useBookingStore((state) => state.setBookingDetails);

  useEffect(() => {
    if (!salonId || !serviceIds) return;
    const fetchStylists = async () => {
      try {
        const response = await PublicAPI.post("/bookings/eligible-stylists", {
          salonId,
          serviceIds,
        });
        if (response.data.success) {
          setStylists(response.data.data);
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
    setShowStylistSelection(true); // Switch back to individual stylist mode
    setSelectedStylistId(stylistId);
    setTimeSlots([]);
    setLoadingSlots(true);
    try {
      const response = await PublicAPI.post(
        "/salons/available-time-slots-sithum",
        {
          service_ids: serviceIds,
          stylist_id: stylistId,
          salon_id: salonId,
          date: selectedDate,
        }
      );
      if (response.data.success) {
        setTimeSlots(response.data.data);
      }
    } catch (err) {
      console.error("Error fetching time slots:", err);
    } finally {
      setLoadingSlots(false);
    }
  };

  // Update the stylist click handler to show all slots instead
  const handleShowAllTimeSlots = async () => {
    if (!selectedDate) {
      alert("Please select a date first.");
      return;
    }

    setShowStylistSelection(false); // Hide individual stylist selection
    setSelectedStylistId(null); // Clear selected stylist
    setTimeSlots([]);
    setLoadingSlots(true);

    try {
      const response = await PublicAPI.post(
        "/salons/available-time-slots-all",
        {
          service_ids: serviceIds,
          salon_id: salonId,
          date: selectedDate,
        }
      );

      if (response.data.success) {
        setTimeSlots(response.data.data);
      }
    } catch (err) {
      console.error("Error fetching time slots:", err);
    } finally {
      setLoadingSlots(false);
    }
  };

  const handleTimeSlotClick = async (slot) => {
    let assignedStylist = null;

    // Check if slot has available stylists (new format) or use selected stylist (old format)
    if (slot.available_stylists && slot.available_stylists.length > 0) {
      // Randomly select a stylist from available ones
      const randomIndex = Math.floor(
        Math.random() * slot.available_stylists.length
      );
      assignedStylist = slot.available_stylists[randomIndex];
    } else if (selectedStylistId) {
      // Fallback to selected stylist for old format
      const selectedStylist = stylists.find(
        (s) => s.stylist_id === selectedStylistId
      );
      if (selectedStylist) {
        assignedStylist = {
          stylist_id: selectedStylist.stylist_id,
          stylist_name: selectedStylist.stylist_name,
          profile_pic_link: selectedStylist.profile_pic_link,
        };
      }
    }

    if (!assignedStylist) {
      alert("Unable to assign a stylist for this time slot.");
      return;
    }

    const details = {
      salonId,
      serviceIds,
      stylistId: assignedStylist.stylist_id,
      stylistName: assignedStylist.stylist_name,
      date: selectedDate,
      timeSlot: {
        start: slot.start,
        end: slot.end,
      },
      workstationStrategy: slot.workstation_strategy,
      workstations: slot.available_workstations,
    };

    setBookingDetails(details);
    try {
      const response = await ProtectedAPI.get("/auth/me");
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
    // Extract hours and minutes directly from the ISO string
    const timePart = isoString.split("T")[1];
    const hours = timePart.substring(0, 2);
    const minutes = timePart.substring(3, 5);

    // Format as HH:MM
    return `${hours}:${minutes}`;
  };

  if (!salonId || !serviceIds) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="bg-white p-6 rounded-xl shadow text-red-500 text-center">
          Missing salon or service information.
          <br />
          Please go back and select services again.
        </div>
      </div>
    );
  }

  const minOffset = -4;
  const days = Array.from({ length: 7 }, (_, i) =>
    getDateNDaysFromToday(i + calendarOffset)
  );
  const todayISO = new Date().toISOString().slice(0, 10);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <Header />
      <div className="py-8 px-4 md:px-8 flex flex-col lg:flex-row gap-8 max-w-7xl mx-auto">
        <div className="flex-1">
          <h1 className="text-3xl md:text-4xl font-extrabold mb-8 text-gray-900">
            Choose Your Time
          </h1>

          <div className="mb-8 p-4 sm:p-6 bg-gray-50 rounded-2xl shadow-md border border-gray-200 w-full max-w-3xl mx-auto">
            <label className="font-semibold text-base sm:text-lg text-gray-900 mb-3 sm:mb-4 block">
              Select a date:
            </label>
            <div className="flex items-center justify-between gap-2 sm:gap-3 overflow-x-auto pb-2 touch-pan-x snap-x snap-mandatory">
              <button
                type="button"
                className="rounded-full bg-gray-300 hover:bg-gray-400 disabled:bg-gray-200 text-gray-800 disabled:text-gray-400 p-2 sm:p-3 transition w-9 h-9 sm:w-10 sm:h-10 flex-shrink-0"
                onClick={() =>
                  setCalendarOffset((prev) => Math.max(prev - 7, 0))
                }
                disabled={calendarOffset <= 0}
              >
                <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
              <div className="flex p-4 gap-2 sm:gap-3 flex-grow justify-start sm:justify-center">
                {days
                  .filter((date) => {
                    const today = new Date();
                    const maxDate = new Date();
                    maxDate.setDate(today.getDate() + 6); // only show today + next 6 days
                    return date >= today && date <= maxDate;
                  })
                  .map((date) => {
                    const iso = date.toISOString().slice(0, 10);
                    const isSelected = selectedDate === iso;
                    const isToday = iso === todayISO;
                    return (
                      <button
                        key={iso}
                        onClick={() => {
                          setSelectedDate(iso);
                          setSelectedStylistId(null);
                          setTimeSlots([]);
                          setShowStylistSelection(true); // Reset to show all options
                        }}
                        className={`w-14 h-14 sm:w-16 sm:h-16 rounded-full border-2 shadow-sm transition-all duration-200 flex items-center justify-center text-center snap-center
                          ${
                            isSelected
                              ? "bg-gradient-to-br from-gray-800 via-gray-900 to-gray-600 border-red-500 text-white scale-110 shadow-lg"
                              : "bg-white border-gray-300 text-gray-800 hover:bg-gray-100 hover:border-gray-400"
                          }
                          ${
                            isToday && !isSelected
                              ? "border-dashed border-2 border-gray-800"
                              : ""
                          }`}
                      >
                        <div className="flex flex-col items-center justify-center leading-tight text-[0.65rem] sm:text-[0.75rem]">
                          <span className="font-bold text-xs sm:text-sm">
                            {formatDayCircle(date)}
                          </span>
                          <span className="text-[0.6rem] sm:text-[0.65rem]">
                            {formatDayLabel(date)}
                          </span>
                        </div>
                      </button>
                    );
                  })}
              </div>
              <button
                type="button"
                className="rounded-full bg-gray-300 hover:bg-gray-400 disabled:bg-gray-200 text-gray-800 disabled:text-gray-400 p-2 sm:p-3 transition w-9 h-9 sm:w-10 sm:h-10 flex-shrink-0"
                onClick={() => setCalendarOffset((prev) => prev + 7)}
                disabled={calendarOffset >= 0} // no moving forward past 7 days
              >
                <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-10 w-10 border-b-4 border-gray-800"></div>
              <span className="ml-4 text-gray-600">Loading stylists...</span>
            </div>
          ) : selectedDate ? (
            <div className="flex flex-wrap gap-4 justify-center mb-10">
              {/* Any Stylist Button - First in the list */}
              <div className="relative">
                <div className="absolute -top-2 -right-2 bg-emerald-500 text-white text-xs font-bold px-2 py-1 rounded-full z-10">
                  RECOMMENDED
                </div>
                <div
                  onClick={handleShowAllTimeSlots}
                  className={`group flex flex-col items-center bg-white shadow-lg rounded-2xl p-4 hover:shadow-xl transition-all duration-300 cursor-pointer hover:-translate-y-1 border-2 w-32 h-36
                    ${
                      !showStylistSelection
                        ? "border-emerald-500 ring-2 ring-emerald-300 bg-emerald-50"
                        : "border-emerald-200 hover:border-emerald-400"
                    }`}
                >
                  <div className="relative shrink-0 mb-3">
                    <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-emerald-200 shadow-sm group-hover:border-emerald-500 transition bg-gradient-to-r from-emerald-500 to-emerald-600 flex items-center justify-center">
                      <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                        <circle cx="18" cy="8" r="2"/>
                        <path d="M18 12c-1.33 0-2.67.33-3.33.67C15.33 13 16 13.67 16 14.33V16h6v-1.67c0-1.33-2-2.33-4-2.33z"/>
                        <circle cx="6" cy="8" r="2"/>
                        <path d="M6 12c-2 0-4 1-4 2.33V16h6v-1.67c0-.66.67-1.33 1.33-1.66C8.67 12.33 7.33 12 6 12z"/>
                      </svg>
                    </div>
                    <div className="absolute -bottom-1 -right-1 bg-emerald-500 border-2 border-white rounded-full p-1">
                      <CheckCircle className="w-2.5 h-2.5 text-white" />
                    </div>
                  </div>

                  <div className="text-center">
                    <h3 className="text-sm font-semibold text-gray-800 group-hover:text-emerald-600 transition mb-1">
                      Any Stylist
                    </h3>
                    <p className="text-xs text-emerald-600 font-medium">
                      Best Availability
                    </p>
                  </div>
                </div>
              </div>

              {/* Individual Stylists */}
              {stylists.length > 0 ? (
                stylists.map((stylist) => (
                  <div
                    key={stylist.stylist_id}
                    onClick={() => handleStylistClick(stylist.stylist_id)}
                    className={`group flex flex-col items-center bg-white shadow-lg rounded-2xl p-4 hover:shadow-xl transition-all duration-300 cursor-pointer hover:-translate-y-1 border-2 w-32 h-36
                      ${
                        selectedStylistId === stylist.stylist_id
                          ? "border-gray-800 ring-2 ring-gray-600 bg-gray-50"
                          : "border-gray-100 hover:border-gray-400"
                      }`}
                  >
                    <div className="relative shrink-0 mb-3">
                      <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-gray-200 shadow-sm group-hover:border-gray-400 transition">
                        <img
                          src={stylist.profile_pic_link || defaultProfilePic}
                          alt={stylist.stylist_name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="absolute -bottom-1 -right-1 bg-green-500 border-2 border-white rounded-full p-1">
                        <CheckCircle className="w-2.5 h-2.5 text-white" />
                      </div>
                    </div>

                    <div className="text-center">
                      <h3 className="text-sm font-semibold text-gray-800 group-hover:text-gray-600 transition mb-1 truncate w-full">
                        {stylist.stylist_name}
                      </h3>
                      <p className="text-xs text-green-600 font-medium">
                        Available
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center w-full">
                  No stylists available for selected services.
                </p>
              )}
            </div>
          ) : null}

          {/* Time Slots Display */}
          {selectedDate && !showStylistSelection && (
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <h2 className="text-xl font-semibold mb-4 text-gray-800">
                Available Time Slots
              </h2>
              {loadingSlots ? (
                <div className="flex justify-center items-center py-8">
                  <div className="animate-spin rounded-full h-10 w-10 border-b-4 border-gray-800"></div>
                  <span className="ml-3 text-gray-600">Loading slots...</span>
                </div>
              ) : timeSlots.length > 0 ? (
                <div className="flex flex-col gap-3 max-h-72 overflow-y-auto pr-2">
                  {timeSlots.map((slot, index) => (
                    <button
                      key={index}
                      onClick={() => handleTimeSlotClick(slot)}
                      className="flex items-center justify-between border border-emerald-900 rounded-xl px-4 py-3 bg-gray-50 hover:bg-blue-200 transition cursor-pointer shadow-sm w-full"
                    >
                      <div className="flex items-center gap-4">
                        <span className="font-medium text-gray-700">
                          {formatTime(slot.start)}
                        </span>
                        <span className="mx-2 text-gray-400">to</span>
                        <span className="font-medium text-gray-700">
                          {formatTime(slot.end)}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-500">
                          {slot.stylist_count} stylist
                          {slot.stylist_count !== 1 ? "s" : ""} available
                        </span>
                        <ChevronRight className="w-4 h-4 text-gray-400" />
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">
                  No slots available for selected date.
                </p>
              )}
            </div>
          )}

          {selectedStylistId && showStylistSelection && (
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <h2 className="text-xl font-semibold mb-4 text-gray-800">
                Available Time Slots
              </h2>
              {loadingSlots ? (
                <div className="flex justify-center items-center py-8">
                  <div className="animate-spin rounded-full h-10 w-10 border-b-4 border-gray-800"></div>
                  <span className="ml-3 text-gray-600">Loading slots...</span>
                </div>
              ) : timeSlots.length > 0 ? (
                <div className="flex flex-col gap-3 max-h-72 overflow-y-auto pr-2">
                  {timeSlots.map((slot, index) => (
                    <button
                      key={index}
                      onClick={() => handleTimeSlotClick(slot)}
                      className="flex items-center justify-between border border-emerald-900 rounded-xl px-4 py-3 bg-gray-50 hover:bg-blue-200 transition cursor-pointer shadow-sm w-full"
                    >
                      <span className="font-medium text-gray-700">
                        {formatTime(slot.start)}
                      </span>
                      <span className="mx-2 text-gray-400">to</span>
                      <span className="font-medium text-gray-700">
                        {formatTime(slot.end)}
                      </span>
                    </button>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">
                  This stylist is fully booked on this date.
                </p>
              )}
            </div>
          )}
        </div>

        <div className="w-full lg:w-96 flex-shrink-0">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 space-y-6 sticky top-24">
            <div className="flex items-center gap-4 pb-4 border-b border-gray-100">
              <img
                src={salon_logo_link || "/placeholder.svg"}
                alt="Salon Logo"
                className="w-20 h-20 rounded-full object-cover border-2 border-gray-200 shadow-md"
              />
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {salon_name}
                </h2>
                <div className="flex items-center gap-2 mt-1">
                  <div className="flex text-yellow-500 text-lg">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-5 h-5 ${
                          i < (salon_average_rating || 0)
                            ? "fill-yellow-500 stroke-yellow-500"
                            : "fill-gray-300 stroke-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-500">
                    ({salon_average_rating || 0}/5)
                  </span>
                </div>
                <div className="flex items-center gap-1 mt-2 text-gray-600">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  <span className="text-sm">{salon_address}</span>
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                Selected Services
              </h3>
              <ul className="list-none space-y-2 text-gray-700">
                {Array.isArray(serviceNames) && serviceNames.length > 0 ? (
                  serviceNames.map((name, idx) => (
                    <li
                      key={idx}
                      className="flex justify-between items-start text-sm"
                    >
                      <span className="font-medium">{name}</span>
                      <div className="text-right">
                        <span className="block text-gray-500">
                          {serviceDurations?.[idx] || 0} min
                        </span>
                        <span className="block font-semibold text-gray-700">
                          Rs {servicePrices?.[idx] || 0}
                        </span>
                      </div>
                    </li>
                  ))
                ) : (
                  <li className="text-gray-400 text-center py-4">
                    No services selected
                  </li>
                )}
              </ul>
              {Array.isArray(serviceDurations) &&
                Array.isArray(servicePrices) && (
                  <div className="mt-6 p-4 rounded-xl bg-gray-50 border border-gray-800 flex flex-col gap-3">
                    <div className="flex justify-between text-base text-gray-900">
                      <span className="font-bold">Total Duration:</span>
                      <span className="font-bold text-gray-900">
                        {serviceDurations.reduce((a, b) => a + (b || 0), 0)} min
                      </span>
                    </div>
                    <div className="flex justify-between text-lg text-gray-800">
                      <span className="font-bold">Total Price:</span>
                      <span className="font-extrabold text-gray-800">
                        Rs{" "}
                        {servicePrices
                          .reduce((a, b) => a + (b || 0), 0)
                          .toLocaleString()}
                      </span>
                    </div>
                  </div>
                )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Schedule;
