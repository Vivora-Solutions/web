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
      
      // Professional success notification
      const notification = document.createElement("div");
      notification.className = "fixed top-4 right-4 bg-gradient-to-r from-black to-[#8B4513] text-white py-3 px-4 rounded-lg shadow-lg z-50 flex items-center";
      notification.innerHTML = `
        <svg class="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
        </svg>
        <span>Opening hours updated successfully!</span>
      `;
      document.body.appendChild(notification);
      setTimeout(() => {
        notification.classList.add("opacity-0", "transition-opacity", "duration-500");
        setTimeout(() => document.body.removeChild(notification), 500);
      }, 3000);
    } catch (error) {
      console.error("Error updating opening hours:", error);
      
      // Professional error notification
      const errorNotification = document.createElement("div");
      errorNotification.className = "fixed top-4 right-4 bg-red-600 text-white py-3 px-4 rounded-lg shadow-lg z-50 flex items-center";
      errorNotification.innerHTML = `
        <svg class="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
        </svg>
        <span>Failed to update opening hours: ${error.response?.data?.error || error.message}</span>
      `;
      document.body.appendChild(errorNotification);
      setTimeout(() => {
        errorNotification.classList.add("opacity-0", "transition-opacity", "duration-500");
        setTimeout(() => document.body.removeChild(errorNotification), 500);
      }, 3000);
    }
  };

  if (isLoading) {
    return (
      <div className="mx-auto my-6 p-6 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-lg shadow-md border border-gray-200">
        {/* Loading Header */}
        <div className="mb-8 text-center">
          <div className="relative inline-block">
            {/* Animated Clock Icon */}
            <div className="w-16 h-16 mx-auto mb-4 relative">
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-400 to-purple-500 rounded-full animate-pulse"></div>
              <div className="absolute inset-1 bg-white rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10"></circle>
                  <polyline points="12,6 12,12 16,14" className="animate-pulse"></polyline>
                </svg>
              </div>
              
              {/* Rotating border */}
              <div className="absolute inset-0 border-4 border-transparent border-t-indigo-500 rounded-full animate-spin"></div>
            </div>
            
            {/* Floating time indicators */}
            <div className="absolute -top-2 -left-2 w-3 h-3 bg-indigo-400 rounded-full animate-bounce" style={{animationDelay: '0s'}}></div>
            <div className="absolute -top-2 -right-2 w-3 h-3 bg-purple-400 rounded-full animate-bounce" style={{animationDelay: '0.5s'}}></div>
            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-blue-400 rounded-full animate-bounce" style={{animationDelay: '1s'}}></div>
          </div>
          
          <h2 className="text-xl font-semibold text-gray-800 mb-2 animate-fade-in">
            Loading Opening Hours
          </h2>
          <p className="text-gray-600 animate-fade-in-delay">
            Fetching your salon's schedule...
          </p>
        </div>

        {/* Desktop Table Skeleton */}
        <div className="hidden sm:block overflow-x-auto">
          <div className="min-w-full border-collapse bg-white rounded-lg shadow-sm">
            {/* Header skeleton */}
            <div className="bg-gray-100 border-b border-gray-200 p-4">
              <div className="grid grid-cols-4 gap-4">
                <div className="h-4 bg-gray-300 rounded animate-pulse"></div>
                <div className="h-4 bg-gray-300 rounded animate-pulse"></div>
                <div className="h-4 bg-gray-300 rounded animate-pulse"></div>
                <div className="h-4 bg-gray-300 rounded animate-pulse"></div>
              </div>
            </div>
            
            {/* Row skeletons */}
            {[...Array(7)].map((_, index) => (
              <div key={index} className="border-b border-gray-100 p-4 hover:bg-gray-50">
                <div className="grid grid-cols-4 gap-4 items-center">
                  <div className="h-4 bg-gray-200 rounded animate-pulse" style={{animationDelay: `${index * 0.1}s`}}></div>
                  <div className="w-5 h-5 bg-gray-200 rounded animate-pulse" style={{animationDelay: `${index * 0.1 + 0.05}s`}}></div>
                  <div className="h-4 bg-gray-200 rounded animate-pulse" style={{animationDelay: `${index * 0.1 + 0.1}s`}}></div>
                  <div className="h-4 bg-gray-200 rounded animate-pulse" style={{animationDelay: `${index * 0.1 + 0.15}s`}}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Mobile Cards Skeleton */}
        <div className="space-y-4 sm:hidden">
          {[...Array(7)].map((_, index) => (
            <div key={index} className="border rounded-lg p-4 shadow-sm bg-white animate-pulse" style={{animationDelay: `${index * 0.1}s`}}>
              <div className="flex justify-between items-center mb-3">
                <div className="h-5 bg-gray-200 rounded w-20"></div>
                <div className="w-5 h-5 bg-gray-200 rounded"></div>
              </div>
              <div className="space-y-3">
                <div>
                  <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
                  <div className="h-8 bg-gray-200 rounded w-full"></div>
                </div>
                <div>
                  <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
                  <div className="h-8 bg-gray-200 rounded w-full"></div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Progress Indicators */}
        <div className="flex justify-center space-x-2 mt-8">
          <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{animationDelay: '0s'}}></div>
          <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
          <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{animationDelay: '0.4s'}}></div>
          <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{animationDelay: '0.6s'}}></div>
        </div>

        {/* Custom animations */}
        <style jsx>{`
          @keyframes fade-in {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
          
          @keyframes fade-in-delay {
            0% { opacity: 0; transform: translateY(10px); }
            50% { opacity: 0; transform: translateY(10px); }
            100% { opacity: 1; transform: translateY(0); }
          }
          
          .animate-fade-in {
            animation: fade-in 1s ease-out;
          }
          
          .animate-fade-in-delay {
            animation: fade-in-delay 2s ease-out;
          }
        `}</style>
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
