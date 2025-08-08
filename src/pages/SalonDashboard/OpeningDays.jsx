import React, { useState, useEffect } from "react";
import { ProtectedAPI } from "../../utils/api";

const OpeningHours = () => {
  const [openingHours, setOpeningHours] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  const daysOfWeek = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  useEffect(() => {
    const fetchOpeningHours = async () => {
      setIsLoading(true);
      try {
        const response = await ProtectedAPI.get("/salon-admin/opening-hours");
        const days = response.data.days || [];
        const completeDays = Array(7)
          .fill()
          .map((_, index) => {
            const existingDay = days.find((d) => d.day_of_week === index);
            return (
              existingDay || {
                day_of_week: index,
                is_open: false,
                opening_time: null,
                closing_time: null,
              }
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
      updatedHours[index].opening_time =
        updatedHours[index].opening_time || "10:00:00";
      updatedHours[index].closing_time =
        updatedHours[index].closing_time || "17:00:00";
    }

    setOpeningHours(updatedHours);
  };

  const handleTimeChange = (index, field, value) => {
    const updatedHours = [...openingHours];
    const formattedValue = value ? `${value}:00` : null;
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

  const formatTimeForInput = (time) => {
    if (!time) return "";
    return time.substring(0, 5);
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
      alert(
        `Failed to update opening hours: ${
          error.response?.data?.error || error.message
        }`
      );
    }
  };

  if (isLoading)
    return (
      <div className="text-center py-8 text-red-600 font-semibold">
        Loading opening hours...
      </div>
    );

  return (
    <div className="mx-auto my-6 p-6 bg-white rounded-lg shadow-md border border-gray-300">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <h2 className="text-xl font-semibold text-black">Opening Hours</h2>
        <div className="flex gap-3 flex-wrap">
          {isEditing ? (
            <>
              <button
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 text-sm font-medium rounded bg-red-600 text-white hover:bg-red-700 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 text-sm font-medium rounded bg-red-600 text-white hover:bg-red-700 transition"
              >
                Save Changes
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="px-4 py-2 text-sm font-medium rounded bg-red-600 text-white hover:bg-red-700 transition"
            >
              Edit Hours
            </button>
          )}
        </div>
      </div>

      {/* Responsive scroll wrapper */}
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse">
          <thead>
            <tr className="bg-gray-100 border-b border-gray-300">
              <th className="text-left px-4 py-3 font-medium text-black whitespace-nowrap">
                Day
              </th>
              <th className="text-left px-4 py-3 font-medium text-black whitespace-nowrap">
                Open
              </th>
              <th className="text-left px-4 py-3 font-medium text-black whitespace-nowrap">
                Opening Time
              </th>
              <th className="text-left px-4 py-3 font-medium text-black whitespace-nowrap">
                Closing Time
              </th>
            </tr>
          </thead>
          <tbody>
            {openingHours.map((day, index) => (
              <tr
                key={day.day_of_week}
                className="hover:bg-gray-50 border-b border-gray-200"
              >
                <td className="px-4 py-3 whitespace-nowrap">{daysOfWeek[day.day_of_week]}</td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <input
                    type="checkbox"
                    checked={day.is_open}
                    onChange={() => handleToggleOpen(index)}
                    disabled={!isEditing}
                    className="w-5 h-5 accent-red-600 cursor-pointer"
                  />
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  {isEditing && day.is_open ? (
                    <input
                      type="time"
                      value={formatTimeForInput(day.opening_time)}
                      onChange={(e) =>
                        handleTimeChange(index, "opening_time", e.target.value)
                      }
                      disabled={!day.is_open}
                      className="border border-gray-300 rounded px-2 py-1 text-sm text-black"
                    />
                  ) : (
                    <span>{formatTimeForDisplay(day.opening_time)}</span>
                  )}
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  {isEditing && day.is_open ? (
                    <input
                      type="time"
                      value={formatTimeForInput(day.closing_time)}
                      onChange={(e) =>
                        handleTimeChange(index, "closing_time", e.target.value)
                      }
                      disabled={!day.is_open}
                      className="border border-gray-300 rounded px-2 py-1 text-sm text-black"
                    />
                  ) : (
                    <span>{formatTimeForDisplay(day.closing_time)}</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OpeningHours;
