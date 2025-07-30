import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";

import useBookingStore from '../../store/bookingStore';
import API from '../../utils/api'; // optional, but keeping as-is

const defaultProfilePic =
  "https://ui-avatars.com/api/?name=No+Image&background=ccc&color=555&size=100";

const Schedule = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { salonId, serviceIds } = location.state || {};

  const [stylists, setStylists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedStylistId, setSelectedStylistId] = useState(null);
  const [timeSlots, setTimeSlots] = useState([]);

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
      navigate("/signup");
    }
  } catch (err) {
    navigate("/signup");
  }
  };

  const formatTime = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (!salonId || !serviceIds) {
    return (
      <p className="p-4 text-red-500">
        Missing salon or service information. Please go back and select services again.
      </p>
    );
  }

  return (
    <div className="p-4">
      <h1 className="text-xl font-semibold mb-4">Choose a Stylist</h1>

      <div className="mb-4">
        <label className="font-medium mr-2">Select a date:</label>
        <input
          type="date"
          className="border px-2 py-1 rounded"
          value={selectedDate}
          onChange={(e) => {
            setSelectedDate(e.target.value);
            setSelectedStylistId(null);
            setTimeSlots([]);
          }}
        />
      </div>

      {loading ? (
        <p>Loading stylists...</p>
      ) : (
        <div className="flex flex-wrap gap-6 mb-6">
          {stylists.length > 0 ? (
            stylists.map((stylist) => (
              <div
                key={stylist.stylist_id}
                onClick={() => handleStylistClick(stylist.stylist_id)}
                className={`flex flex-col items-center w-24 cursor-pointer ${
                  selectedStylistId === stylist.stylist_id ? "border-2 border-blue-500" : ""
                }`}
              >
                <img
                  src={stylist.profile_pic_link || defaultProfilePic}
                  alt={stylist.stylist_name}
                  className="w-20 h-20 rounded-full object-cover border"
                />
                <p className="text-sm mt-2 text-center">{stylist.stylist_name}</p>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No stylists available for selected services.</p>
          )}
        </div>
      )}

      {selectedStylistId && (
        <div>
          <h2 className="text-lg font-semibold mb-2">Available Time Slots</h2>
          {timeSlots.length > 0 ? (
            <div className="max-h-60 overflow-y-auto border rounded p-2 space-y-2">
              {timeSlots.map((slot, index) => (
                <div
                  key={index}
                  onClick={() => handleTimeSlotClick(slot)}
                  className="cursor-pointer border p-2 rounded bg-gray-100 flex justify-between hover:bg-blue-100"
                >
                  <span>{formatTime(slot.start)}</span>
                  <span>to</span>
                  <span>{formatTime(slot.end)}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No slots available for this stylist on selected date.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default Schedule;
