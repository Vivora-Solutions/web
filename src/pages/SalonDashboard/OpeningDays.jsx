import React, { useState, useEffect } from "react";
import { ProtectedAPI } from "../../utils/api";

const OpeningHours = () => {
  const [openingHours, setOpeningHours] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  const daysOfWeek = [
    "Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday",
  ];

  useEffect(() => {
    const fetchOpeningHours = async () => {
      setIsLoading(true);
      try {
        const response = await ProtectedAPI.get("/salon-admin/opening-hours");
        const days = response.data.days || [];
        const completeDays = Array(7).fill().map((_, index) => {
          const existingDay = days.find((d) => d.day_of_week === index);
          return (
            existingDay || { day_of_week: index, is_open: false, opening_time: null, closing_time: null }
          );
        });
        setOpeningHours(completeDays);
      } catch (error) {
        console.error("Error fetching opening hours:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchOpeningHours();
  }, []);

  const handleToggleOpen = (index) => {
    const updatedHours = [...openingHours];
    updatedHours[index].is_open = !updatedHours[index].is_open;
    if (!updatedHours[index].is_open) {
      updatedHours[index].opening_time = null;
      updatedHours[index].closing_time = null;
    } else {
      updatedHours[index].opening_time = updatedHours[index].opening_time || "10:00:00";
      updatedHours[index].closing_time = updatedHours[index].closing_time || "17:00:00";
    }
    setOpeningHours(updatedHours);
  };

  const generateTimeOptions = () => {
    const options = [];
    for (let h = 0; h < 24; h++) {
      for (let m = 0; m < 60; m += 15) {
        const hour = String(h).padStart(2, "0");
        const minute = String(m).padStart(2, "0");
        options.push(`${hour}:${minute}:00`);
      }
    }
    return options;
  };

  const TIME_OPTIONS = generateTimeOptions();

  const handleTimeChange = (index, field, value) => {
    if (!value) {
      const updatedHours = [...openingHours];
      updatedHours[index][field] = null;
      setOpeningHours(updatedHours);
      return;
    }
    let [hours, minutes] = value.split(":").map(Number);
    const roundedMinutes = Math.round(minutes / 15) * 15;
    if (roundedMinutes === 60) {
      hours = (hours + 1) % 24;
      minutes = 0;
    } else {
      minutes = roundedMinutes;
    }
    const formattedValue = `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:00`;
    const updatedHours = [...openingHours];
    updatedHours[index][field] = formattedValue;
    setOpeningHours(updatedHours);
  };

  const formatTimeForDisplay = (time) => {
    if (!time) return "--:-- --";
    const [hours, minutes] = time.split(":");
    const hourNum = parseInt(hours, 10);
    const period = hourNum >= 12 ? "pm" : "am";
    const displayHour = hourNum % 12 || 12;
    return `${displayHour}:${minutes} ${period}`;
  };

  const handleSave = async () => {
    try {
      const payload = {
        daysData: openingHours.map((day) => ({
          day_of_week: day.day_of_week,
          is_open: day.is_open,
          opening_time: day.is_open ? day.opening_time : null,
          closing_time: day.is_open ? day.closing_time : null,
        })),
      };
      await ProtectedAPI.post("/salon-admin/opening-hours", payload);
      setIsEditing(false);
      alert("Opening hours updated successfully!");
    } catch (error) {
      console.error("Error updating opening hours:", error);
      alert(`Failed to update opening hours: ${error.response?.data?.error || error.message}`);
    }
  };

  if (isLoading) {
    return (
      <div className="text-center py-8 text-gray-600 font-semibold">
        Loading opening hours...
      </div>
    );
  }

  return (
    <div className="mx-auto my-6 p-6 bg-white rounded-lg shadow-md border border-gray-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <h2 className="text-xl font-semibold text-black">Opening Hours</h2>
        <div className="flex gap-3 flex-wrap">
          {isEditing ? (
            <>
              <button
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 text-sm font-medium rounded bg-gray-600 text-white hover:bg-gray-900"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 text-sm font-medium rounded bg-gray-600 text-white hover:bg-gray-900"
              >
                Save Changes
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="px-4 py-2 text-sm font-medium rounded bg-gray-600 text-white hover:bg-gray-900"
            >
              Edit Hours
            </button>
          )}
        </div>
      </div>

      {/* Desktop Table */}
      <div className="hidden sm:block overflow-x-auto">
        <table className="min-w-full border-collapse">
          <thead>
            <tr className="bg-gray-100 border-b border-gray-300">
              <th className="text-left px-4 py-3">Day</th>
              <th className="text-left px-4 py-3">Open</th>
              <th className="text-left px-4 py-3">Opening Time</th>
              <th className="text-left px-4 py-3">Closing Time</th>
            </tr>
          </thead>
          <tbody>
            {openingHours.map((day, index) => (
              <tr key={day.day_of_week} className="hover:bg-gray-50 border-b border-gray-200">
                <td className="px-4 py-3">{daysOfWeek[day.day_of_week]}</td>
                <td className="px-4 py-3">
                  <input
                    type="checkbox"
                    checked={day.is_open}
                    onChange={() => handleToggleOpen(index)}
                    disabled={!isEditing}
                    className="w-5 h-5 accent-gray-600 cursor-pointer"
                  />
                </td>
                <td className="px-4 py-3">
                  {isEditing && day.is_open ? (
                    <select
                      value={day.opening_time || ""}
                      onChange={(e) => handleTimeChange(index, "opening_time", e.target.value)}
                      className="border border-gray-300 rounded px-2 py-1 text-sm"
                    >
                      <option value="">--:--</option>
                      {TIME_OPTIONS.map((time) => (
                        <option key={time} value={time}>
                          {formatTimeForDisplay(time)}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <span>{formatTimeForDisplay(day.opening_time)}</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  {isEditing && day.is_open ? (
                    <select
                      value={day.closing_time || ""}
                      onChange={(e) => handleTimeChange(index, "closing_time", e.target.value)}
                      className="border border-gray-300 rounded px-2 py-1 text-sm"
                    >
                      <option value="">--:--</option>
                      {TIME_OPTIONS.map((time) => (
                        <option key={time} value={time}>
                          {formatTimeForDisplay(time)}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <span>{formatTimeForDisplay(day.closing_time)}</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="space-y-4 sm:hidden">
        {openingHours.map((day, index) => (
          <div key={day.day_of_week} className="border rounded-lg p-4 shadow-sm bg-gray-50">
            <div className="flex justify-between items-center">
              <h3 className="font-semibold">{daysOfWeek[day.day_of_week]}</h3>
              <input
                type="checkbox"
                checked={day.is_open}
                onChange={() => handleToggleOpen(index)}
                disabled={!isEditing}
                className="w-5 h-5 accent-gray-600"
              />
            </div>
            <div className="mt-3 text-sm">
              <p className="font-medium">Opening Time:</p>
              {isEditing && day.is_open ? (
                <select
                  value={day.opening_time || ""}
                  onChange={(e) => handleTimeChange(index, "opening_time", e.target.value)}
                  className="w-full border border-gray-300 rounded px-2 py-1 mt-1"
                >
                  <option value="">--:--</option>
                  {TIME_OPTIONS.map((time) => (
                    <option key={time} value={time}>
                      {formatTimeForDisplay(time)}
                    </option>
                  ))}
                </select>
              ) : (
                <p>{formatTimeForDisplay(day.opening_time)}</p>
              )}
            </div>
            <div className="mt-3 text-sm">
              <p className="font-medium">Closing Time:</p>
              {isEditing && day.is_open ? (
                <select
                  value={day.closing_time || ""}
                  onChange={(e) => handleTimeChange(index, "closing_time", e.target.value)}
                  className="w-full border border-gray-300 rounded px-2 py-1 mt-1"
                >
                  <option value="">--:--</option>
                  {TIME_OPTIONS.map((time) => (
                    <option key={time} value={time}>
                      {formatTimeForDisplay(time)}
                    </option>
                  ))}
                </select>
              ) : (
                <p>{formatTimeForDisplay(day.closing_time)}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OpeningHours;
