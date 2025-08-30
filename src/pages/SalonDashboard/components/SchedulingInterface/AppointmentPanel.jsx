// AppointmentPanel.jsx
import React from "react";
import { X, Clock, Save } from "lucide-react";
import { COLORS } from "./utils/colors";

const AppointmentPanel = ({
  showAddAppointmentPanel,
  setShowAddAppointmentPanel,
  isEditingAppointment,
  newAppointment,
  setNewAppointment,
  availableTimeSlots,
  setAvailableTimeSlots,
  loading,
  stylists,
  services,
  handleCheckAvailability,
  handleSaveAppointment,
  // COLORS, // Using imported COLORS instead of prop
}) => {
  // Tailwind helper for conditional classes
  function cn(...classes) {
    return classes.filter(Boolean).join(" ");
  }
  return (
    <>
      {showAddAppointmentPanel && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 z-[50] bg-black/50 backdrop-blur-sm"
            onClick={() => setShowAddAppointmentPanel(false)}
          />

          {/* Panel */}
          <div
            className="
    fixed right-0 top-[60px]
    h-[calc(100vh-60px)]
    w-[90%] sm:w-[450px]
    bg-white shadow-2xl z-[51] 
    overflow-y-auto flex flex-col
  "
          >
            {/* Header */}
            <div
              className="flex justify-between items-center px-6 py-7 border-b-2"
              style={{
                borderColor: COLORS.border,
                background: `linear-gradient(135deg, ${COLORS.success}, #38a169)`,
                color: "white",
              }}
            >
              <div>
                <h2 className="text-[22px] font-extrabold mb-1">
                  {isEditingAppointment
                    ? "Edit Appointment"
                    : "New Appointment"}
                </h2>
                <p className="text-[14px] opacity-90 m-0">
                  {isEditingAppointment
                    ? "Update appointment details"
                    : "Schedule a new appointment"}
                </p>
              </div>
              <button
                onClick={() => setShowAddAppointmentPanel(false)}
                className="bg-white/20 border-none text-white text-[24px] w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 hover:bg-white/30"
              >
                <X size={22} />
              </button>
            </div>

            {/* Content */}
            <div className="p-4 sm:p-8 flex-1 flex flex-col">
              {/* Client Information */}
              <div className="mb-6">
                <h3 className="text-[18px] font-bold text-gray-800 mb-4">
                  Client Information
                </h3>
                <div className="flex flex-col gap-4">
                  <div>
                    <label className="block font-semibold text-gray-800  mb-2">
                      Client Name *
                    </label>
                    <input
                      type="text"
                      value={newAppointment.clientName}
                      onChange={(e) =>
                        setNewAppointment({
                          ...newAppointment,
                          clientName: e.target.value,
                        })
                      }
                      placeholder="Enter client name"
                      disabled={isEditingAppointment}
                      className={cn(
                        "w-full px-4 py-3 border-2 rounded-lg text-[14px] font-normal outline-none transition-colors",
                        isEditingAppointment
                          ? "bg-gray-100 cursor-not-allowed"
                          : "bg-white cursor-text"
                      )}
                      style={{ borderColor: COLORS.border }}
                      onFocus={(e) =>
                        !isEditingAppointment &&
                        (e.target.style.borderColor = COLORS.info)
                      }
                      onBlur={(e) =>
                        (e.target.style.borderColor = COLORS.border)
                      }
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-gray-800  mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={newAppointment.clientPhone}
                      onChange={(e) =>
                        setNewAppointment({
                          ...newAppointment,
                          clientPhone: e.target.value,
                        })
                      }
                      placeholder="Enter phone number"
                      disabled={isEditingAppointment}
                      className={cn(
                        "w-full px-4 py-3 border-2 rounded-lg text-[14px] font-normal outline-none transition-colors",
                        isEditingAppointment
                          ? "bg-gray-100 cursor-not-allowed"
                          : "bg-white cursor-text"
                      )}
                      style={{ borderColor: COLORS.border }}
                      onFocus={(e) =>
                        !isEditingAppointment &&
                        (e.target.style.borderColor = COLORS.info)
                      }
                      onBlur={(e) =>
                        (e.target.style.borderColor = COLORS.border)
                      }
                    />
                  </div>
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id="walkIn"
                      checked={newAppointment.isWalkIn}
                      onChange={(e) =>
                        setNewAppointment({
                          ...newAppointment,
                          isWalkIn: e.target.checked,
                        })
                      }
                      disabled={isEditingAppointment}
                      className={cn(
                        "scale-110 accent-blue-500",
                        isEditingAppointment
                          ? "cursor-not-allowed"
                          : "cursor-pointer"
                      )}
                    />
                    <label
                      htmlFor="walkIn"
                      className={cn(
                        "font-semibold",
                        isEditingAppointment
                          ? "text-gray-400 cursor-not-allowed"
                          : "text-gray-800  cursor-pointer"
                      )}
                    >
                      Walk-in Customer
                    </label>
                  </div>
                </div>
              </div>

              {/* Appointment Details */}
              <div className="mb-6">
                <h3 className="text-[18px] font-bold text-gray-800 mb-4">
                  Appointment Details
                </h3>
                <div className="flex flex-col gap-4">
                  <div>
                    <label className="block font-semibold text-gray-800 mb-2">
                      Stylist *
                    </label>
                    <select
                      value={newAppointment.stylistId}
                      onChange={(e) => {
                        newAppointment.stylistId = e.target.value;
                        setAvailableTimeSlots([]);
                        console.log(
                          `Selected stylist: ${newAppointment.stylistId}`
                        );
                      }}
                      className="w-full px-4 py-3 border-2 rounded-lg text-[14px] font-normal outline-none transition-colors bg-white"
                      style={{ borderColor: COLORS.border }}
                      onFocus={(e) =>
                        (e.target.style.borderColor = COLORS.info)
                      }
                      onBlur={(e) =>
                        (e.target.style.borderColor = COLORS.border)
                      }
                    >
                      <option value="">Select a stylist</option>
                      {stylists
                        .filter((s) => s.isActive)
                        .map((stylist) => (
                          <option key={stylist.id} value={stylist.id}>
                            {stylist.name}
                          </option>
                        ))}
                    </select>
                  </div>
                  <div className="w-full">
                    <label className="block font-semibold text-gray-800 mb-2">
                      Date *
                    </label>
                    <input
                      type="date"
                      value={newAppointment.date}
                      onChange={(e) => {
                        setNewAppointment({
                          ...newAppointment,
                          date: e.target.value,
                        });
                        setAvailableTimeSlots([]);
                      }}
                      className="w-full px-4 py-3 border-2 rounded-lg text-[14px] font-normal outline-none transition-colors"
                      style={{ borderColor: COLORS.border }}
                      onFocus={(e) =>
                        (e.target.style.borderColor = COLORS.info)
                      }
                      onBlur={(e) =>
                        (e.target.style.borderColor = COLORS.border)
                      }
                    />
                  </div>
                </div>
              </div>

              {/* Services */}
              <div className="mb-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4">
                  Services *
                </h3>
                <div className="flex flex-col gap-3">
                  {services.map((service) => (
                    <div
                      key={service.id}
                      className={cn(
                        "flex items-center p-3 sm:p-4 border-2 rounded-lg cursor-pointer transition-all duration-200",
                        newAppointment.services.includes(service.id)
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-300 bg-white hover:border-blue-400 hover:bg-blue-50",
                        isEditingAppointment
                          ? "cursor-not-allowed bg-gray-100 opacity-70"
                          : "cursor-pointer"
                      )}
                      onClick={() => {
                        if (!isEditingAppointment) {
                          const updatedServices =
                            newAppointment.services.includes(service.id)
                              ? newAppointment.services.filter(
                                  (id) => id !== service.id
                                )
                              : [...newAppointment.services, service.id];
                          setNewAppointment({
                            ...newAppointment,
                            services: updatedServices,
                          });
                          setAvailableTimeSlots([]);
                        }
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={newAppointment.services.includes(service.id)}
                        disabled={isEditingAppointment}
                        onChange={() => {}}
                        className={cn(
                          "mr-3 scale-110 accent-blue-500",
                          isEditingAppointment
                            ? "cursor-not-allowed"
                            : "cursor-pointer"
                        )}
                      />
                      <div className="flex-1">
                        <div
                          className={cn(
                            "font-semibold mb-1 text-sm sm:text-base",
                            isEditingAppointment
                              ? "text-gray-400"
                              : "text-gray-800"
                          )}
                        >
                          {service.name}
                        </div>
                        <div className="text-xs sm:text-sm text-gray-500">
                          {service.duration} min • Rs. {service.price}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Notes */}
              <div className="mb-8">
                <label className="block font-semibold text-gray-800 mb-2">
                  Notes
                </label>
                <textarea
                  value={newAppointment.notes}
                  onChange={(e) =>
                    setNewAppointment({
                      ...newAppointment,
                      notes: e.target.value,
                    })
                  }
                  placeholder="Add any special notes or requirements..."
                  rows={3}
                  disabled={isEditingAppointment}
                  className={cn(
                    "w-full px-4 py-3 border-2 rounded-lg text-sm outline-none transition-colors resize-y",
                    isEditingAppointment
                      ? "bg-gray-100 cursor-not-allowed"
                      : "bg-white cursor-text"
                  )}
                  style={{ borderColor: COLORS.border }}
                  onFocus={(e) =>
                    !isEditingAppointment &&
                    (e.target.style.borderColor = COLORS.info)
                  }
                  onBlur={(e) => (e.target.style.borderColor = COLORS.border)}
                />
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-3">
                {/* Check Availability Button - Show when required fields are filled but no slots available */}
                {newAppointment.stylistId &&
                  newAppointment.date &&
                  newAppointment.services.length > 0 &&
                  availableTimeSlots.length === 0 && (
                    <button
                      onClick={handleCheckAvailability}
                      disabled={loading}
                      className={cn(
                        "w-full px-5 py-3.5 rounded-lg font-bold transition-all duration-200 flex items-center justify-center gap-2 text-sm sm:text-base",
                        loading
                          ? "bg-gray-400 cursor-not-allowed"
                          : "bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 cursor-pointer"
                      )}
                      style={{
                        background: loading
                          ? COLORS.textLight
                          : `linear-gradient(135deg, ${COLORS.info}, #3182ce)`,
                        color: "white",
                      }}
                    >
                      <Clock size={16} />
                      {loading ? "Checking..." : "Check Availability"}
                    </button>
                  )}

                {/* Available Time Slots - Show when slots are available */}
                {availableTimeSlots.length > 0 && (
                  <div className="mb-4">
                    <h3 className="text-lg font-bold text-gray-800 mb-4">
                      Available Time Slots
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-64 sm:max-h-80 overflow-y-auto">
                      {availableTimeSlots.map((slot, index) => {
                        const isSelected =
                          newAppointment.startTime === slot.startTime &&
                          newAppointment.endTime === slot.endTime;
                        return (
                          <div
                            key={index}
                            onClick={() => {
                              setNewAppointment({
                                ...newAppointment,
                                startTime: slot.startTime,
                                endTime: slot.endTime,
                              });
                            }}
                            className={cn(
                              "p-3 sm:p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 text-center flex flex-col items-center gap-1",
                              isSelected
                                ? "border-green-500 bg-green-50"
                                : "border-gray-300 bg-white hover:border-blue-400 hover:bg-blue-50"
                            )}
                          >
                            <div
                              className={cn(
                                "font-semibold text-sm",
                                isSelected ? "text-green-600" : "text-gray-800"
                              )}
                            >
                              {slot.startTime
                                .split("T")[1]
                                .split(":")
                                .slice(0, 2)
                                .join(":")}{" "}
                              -{" "}
                              {slot.endTime
                                .split("T")[1]
                                .split(":")
                                .slice(0, 2)
                                .join(":")}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Save/Cancel Buttons */}
                {(availableTimeSlots.length > 0 &&
                  newAppointment.startTime &&
                  newAppointment.endTime) ||
                !newAppointment.stylistId ||
                !newAppointment.date ||
                newAppointment.services.length === 0 ? (
                  <div className="flex flex-col sm:flex-row gap-3">
                    <button
                      onClick={() => setShowAddAppointmentPanel(false)}
                      className="w-full sm:flex-1 px-5 py-3.5 bg-transparent border-2 text-gray-800 rounded-lg font-semibold cursor-pointer transition-all duration-200 hover:bg-gray-50 text-sm sm:text-base"
                      style={{ borderColor: COLORS.border }}
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSaveAppointment}
                      disabled={
                        loading ||
                        !newAppointment.clientName ||
                        !newAppointment.stylistId ||
                        !newAppointment.date ||
                        !newAppointment.startTime ||
                        !newAppointment.endTime ||
                        newAppointment.services.length === 0
                      }
                      className={cn(
                        "w-full sm:flex-2 px-5 py-3.5 rounded-lg font-bold transition-all duration-200 flex items-center justify-center gap-2 text-sm sm:text-base",
                        loading ||
                          !newAppointment.clientName ||
                          !newAppointment.stylistId ||
                          !newAppointment.date ||
                          !newAppointment.startTime ||
                          !newAppointment.endTime ||
                          newAppointment.services.length === 0
                          ? "bg-gray-400 cursor-not-allowed"
                          : "bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 cursor-pointer"
                      )}
                      style={{
                        background:
                          loading ||
                          !newAppointment.clientName ||
                          !newAppointment.stylistId ||
                          !newAppointment.date ||
                          !newAppointment.startTime ||
                          !newAppointment.endTime ||
                          newAppointment.services.length === 0
                            ? COLORS.textLight
                            : `linear-gradient(135deg, ${COLORS.success}, #38a169)`,
                        color: "white",
                      }}
                    >
                      <Save size={16} />
                      {loading
                        ? "Saving..."
                        : isEditingAppointment
                        ? "Update Appointment"
                        : "Create Appointment"}
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setShowAddAppointmentPanel(false)}
                    className="w-full px-5 py-3.5 bg-transparent border-2 text-gray-800 rounded-lg font-semibold cursor-pointer transition-all duration-200 hover:bg-gray-50 text-sm sm:text-base"
                    style={{ borderColor: COLORS.border }}
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>
          </div>
        </>
      )}
      {/* Responsive: panel slides from right, full width on mobile */}
      <style>{`
        @media (max-width: 640px) {
          .max-w-[450px] { max-width: 100vw !important; }
          .sm\\:p-8 { padding: 1.25rem !important; }
        }
      `}</style>
    </>
  );
};

export default AppointmentPanel;
