// AppointmentPanel.jsx
import React from 'react';
import { X, Clock, Save } from 'lucide-react';

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
  COLORS
}) => {
  // Tailwind helper for conditional classes
  function cn(...classes) {
    return classes.filter(Boolean).join(" ");
  }
  return (
    <>
      {showAddAppointmentPanel && (
        <>
          <div
            className="fixed inset-0 z-[50] bg-whitebackdrop-blur-sm"
            onClick={() => setShowAddAppointmentPanel(false)}
          />
          <div
            className="fixed right-0 top-0 h-screen w-full max-w-[500px] bg-white shadow-2xl z-[51] overflow-y-auto flex flex-col"
          >
            <div
              className="flex justify-between items-center px-6 py-7 border-b-2"
              style={{
                borderColor: COLORS.border,
                background: `linear-gradient(135deg, ${COLORS.success}, #38a169)`,
                color: "white",
              }}
            >
              <div>
                <h2 className="text-[22px] font-extrabold mb-1">{isEditingAppointment ? "Edit Appointment" : "New Appointment"}</h2>
                <p className="text-[14px] opacity-90 m-0">{isEditingAppointment ? "Update appointment details" : "Schedule a new appointment"}</p>
              </div>
              <button
                onClick={() => setShowAddAppointmentPanel(false)}
                className="bg-white/20 border-none text-white text-[24px] w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 hover:bg-white/30"
              >
                <X size={22} />
              </button>
            </div>

            <div className="p-4 sm:p-8 flex-1 flex flex-col">
              {/* Client Information */}
              <div className="mb-6">
                <h3 className="text-[18px] font-bold text-gray-800 mb-4">Client Information</h3>
                <div className="flex flex-col gap-4">
                  <div>
                    <label className="block font-semibold text-gray-800  mb-2">Client Name *</label>
                    <input
                      type="text"
                      value={newAppointment.clientName}
                      onChange={(e) => setNewAppointment({ ...newAppointment, clientName: e.target.value })}
                      placeholder="Enter client name"
                      disabled={isEditingAppointment}
                      className={cn(
                        "w-full px-4 py-3 border-2 rounded-lg text-[14px] font-normal outline-none transition-colors",
                        isEditingAppointment ? "bg-gray-100 cursor-not-allowed" : "bg-white cursor-text"
                      )}
                      style={{ borderColor: COLORS.border }}
                      onFocus={e => !isEditingAppointment && (e.target.style.borderColor = COLORS.info)}
                      onBlur={e => (e.target.style.borderColor = COLORS.border)}
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-gray-800  mb-2">Phone Number</label>
                    <input
                      type="tel"
                      value={newAppointment.clientPhone}
                      onChange={(e) => setNewAppointment({ ...newAppointment, clientPhone: e.target.value })}
                      placeholder="Enter phone number"
                      disabled={isEditingAppointment}
                      className={cn(
                        "w-full px-4 py-3 border-2 rounded-lg text-[14px] font-normal outline-none transition-colors",
                        isEditingAppointment ? "bg-gray-100 cursor-not-allowed" : "bg-white cursor-text"
                      )}
                      style={{ borderColor: COLORS.border }}
                      onFocus={e => !isEditingAppointment && (e.target.style.borderColor = COLORS.info)}
                      onBlur={e => (e.target.style.borderColor = COLORS.border)}
                    />
                  </div>
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id="walkIn"
                      checked={newAppointment.isWalkIn}
                      onChange={(e) => setNewAppointment({ ...newAppointment, isWalkIn: e.target.checked })}
                      disabled={isEditingAppointment}
                      className={cn(
                        "scale-110 accent-blue-500",
                        isEditingAppointment ? "cursor-not-allowed" : "cursor-pointer"
                      )}
                    />
                    <label
                      htmlFor="walkIn"
                      className={cn(
                        "font-semibold",
                        isEditingAppointment ? "text-gray-400 cursor-not-allowed" : "text-gray-800  cursor-pointer"
                      )}
                    >
                      Walk-in Customer
                    </label>
                  </div>
                </div>
              </div>

              {/* Appointment Details */}
              <div style={{ marginBottom: "24px" }}>
                <h3 style={{ fontSize: "18px", fontWeight: "700", color: COLORS.text, marginBottom: "16px" }}>
                  Appointment Details
                </h3>
                <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                  <div>
                    <label style={{ display: "block", fontWeight: "600", color: COLORS.text, marginBottom: "8px" }}>
                      Stylist *
                    </label>
                    <select
                      value={newAppointment.stylistId}
                      onChange={(e) => {
                        newAppointment.stylistId = e.target.value;
                        setAvailableTimeSlots([]);
                        console.log(`Selected stylist: ${newAppointment.stylistId}`);
                      }}
                      style={{
                        width: "100%",
                        padding: "12px 16px",
                        border: `2px solid ${COLORS.border}`,
                        borderRadius: "8px",
                        fontSize: "14px",
                        fontFamily: "inherit",
                        outline: "none",
                        transition: "border-color 0.2s ease",
                        backgroundColor: "white",
                      }}
                      onFocus={(e) => (e.target.style.borderColor = COLORS.info)}
                      onBlur={(e) => (e.target.style.borderColor = COLORS.border)}
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
                  <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "12px" }}>
                    <div>
                      <label style={{ display: "block", fontWeight: "600", color: COLORS.text, marginBottom: "8px" }}>
                        Date *
                      </label>
                      <input
                        type="date"
                        value={newAppointment.date}
                        onChange={(e) => {
                          setNewAppointment({ ...newAppointment, date: e.target.value });
                          setAvailableTimeSlots([]);
                        }}
                        style={{
                          width: "100%",
                          padding: "12px 16px",
                          border: `2px solid ${COLORS.border}`,
                          borderRadius: "8px",
                          fontSize: "14px",
                          fontFamily: "inherit",
                          outline: "none",
                          transition: "border-color 0.2s ease",
                        }}
                        onFocus={(e) => (e.target.style.borderColor = COLORS.info)}
                        onBlur={(e) => (e.target.style.borderColor = COLORS.border)}
                      />
                    </div>
                  </div>

                  {availableTimeSlots.length > 0 && (
                    <div>
                      <label style={{ display: "block", fontWeight: "600", color: COLORS.text, marginBottom: "8px" }}>
                        Available Time Slots *
                      </label>
                      <select
                        value={newAppointment.startTime && newAppointment.endTime ? `${newAppointment.startTime}|${newAppointment.endTime}` : ""}
                        onChange={(e) => {
                          const [startTime, endTime] = e.target.value.split('|');
                          setNewAppointment({
                            ...newAppointment,
                            startTime,
                            endTime
                          });
                          console.log(`Selected time slot: ${startTime} - ${endTime}`);
                        }}
                        style={{
                          width: "100%",
                          padding: "12px 16px",
                          border: `2px solid ${COLORS.border}`,
                          borderRadius: "8px",
                          fontSize: "14px",
                          fontFamily: "inherit",
                          outline: "none",
                          transition: "border-color 0.2s ease",
                          backgroundColor: "white",
                        }}
                        onFocus={(e) => (e.target.style.borderColor = COLORS.info)}
                        onBlur={(e) => (e.target.style.borderColor = COLORS.border)}
                      >
                        <option value="">Select available time slot</option>
                        {availableTimeSlots.map((slot, index) => {
                          return (
                            <option key={index} value={`${slot.startTime}|${slot.endTime}`}>
                              {slot.startTime.split('T')[1].split(":").slice(0, 2).join(":")} - {slot.endTime.split('T')[1].split(":").slice(0, 2).join(":")}
                            </option>
                          );
                        })}
                      </select>
                    </div>
                  )}

                  {availableTimeSlots.length === 0 && (
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                      <div>
                        <label style={{ display: "block", fontWeight: "600", color: COLORS.text, marginBottom: "8px" }}>
                          Start Time *
                        </label>
                        <input
                          type="time"
                          value={newAppointment.startTime}
                          onChange={(e) => setNewAppointment({ ...newAppointment, startTime: e.target.value })}
                          disabled={true}
                          style={{
                            width: "100%",
                            padding: "12px 16px",
                            border: `2px solid ${COLORS.border}`,
                            borderRadius: "8px",
                            fontSize: "14px",
                            fontFamily: "inherit",
                            outline: "none",
                            transition: "border-color 0.2s ease",
                            backgroundColor: "#f5f5f5",
                            cursor: "not-allowed",
                          }}
                        />
                      </div>
                      <div>
                        <label style={{ display: "block", fontWeight: "600", color: COLORS.text, marginBottom: "8px" }}>
                          End Time *
                        </label>
                        <input
                          type="time"
                          value={newAppointment.endTime}
                          onChange={(e) => setNewAppointment({ ...newAppointment, endTime: e.target.value })}
                          disabled={true}
                          style={{
                            width: "100%",
                            padding: "12px 16px",
                            border: `2px solid ${COLORS.border}`,
                            borderRadius: "8px",
                            fontSize: "14px",
                            fontFamily: "inherit",
                            outline: "none",
                            transition: "border-color 0.2s ease",
                            backgroundColor: "#f5f5f5",
                            cursor: "not-allowed",
                          }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Services */}
              <div style={{ marginBottom: "24px" }}>
                <h3 style={{ fontSize: "18px", fontWeight: "700", color: COLORS.text, marginBottom: "16px" }}>
                  Services *
                </h3>
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  {services.map((service) => (
                    <div
                      key={service.id}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        padding: "12px 16px",
                        border: `2px solid ${newAppointment.services.includes(service.id) ? COLORS.info : COLORS.border}`,
                        borderRadius: "8px",
                        cursor: isEditingAppointment ? "not-allowed" : "pointer",
                        transition: "all 0.2s ease",
                        background: newAppointment.services.includes(service.id)
                          ? "rgba(66, 153, 225, 0.1)"
                          : isEditingAppointment
                            ? "#f5f5f5"
                            : "white",
                        opacity: isEditingAppointment ? 0.7 : 1,
                      }}
                      onClick={() => {
                        if (!isEditingAppointment) {
                          const updatedServices = newAppointment.services.includes(service.id)
                            ? newAppointment.services.filter((id) => id !== service.id)
                            : [...newAppointment.services, service.id];
                          setNewAppointment({ ...newAppointment, services: updatedServices });
                          setAvailableTimeSlots([]);
                        }
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={newAppointment.services.includes(service.id)}
                        disabled={isEditingAppointment}
                        onChange={() => {}}
                        style={{
                          marginRight: "12px",
                          accentColor: COLORS.info,
                          transform: "scale(1.2)",
                          cursor: isEditingAppointment ? "not-allowed" : "pointer",
                        }}
                      />
                      <div style={{ flex: 1 }}>
                        <div style={{
                          fontWeight: "600",
                          color: isEditingAppointment ? COLORS.textLight : COLORS.text,
                          marginBottom: "4px"
                        }}>
                          {service.name}
                        </div>
                        <div style={{ fontSize: "12px", color: COLORS.textLight }}>
                          {service.duration} min • ${service.price}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Notes */}
              <div style={{ marginBottom: "32px" }}>
                <label style={{ display: "block", fontWeight: "600", color: COLORS.text, marginBottom: "8px" }}>
                  Notes
                </label>
                <textarea
                  value={newAppointment.notes}
                  onChange={(e) => setNewAppointment({ ...newAppointment, notes: e.target.value })}
                  placeholder="Add any special notes or requirements..."
                  rows={3}
                  disabled={isEditingAppointment}
                  style={{
                    width: "100%",
                    padding: "12px 16px",
                    border: `2px solid ${COLORS.border}`,
                    borderRadius: "8px",
                    fontSize: "14px",
                    fontFamily: "inherit",
                    outline: "none",
                    transition: "border-color 0.2s ease",
                    resize: "vertical",
                    backgroundColor: isEditingAppointment ? "#f5f5f5" : "white",
                    cursor: isEditingAppointment ? "not-allowed" : "text",
                  }}
                  onFocus={(e) => !isEditingAppointment && (e.target.style.borderColor = COLORS.info)}
                  onBlur={(e) => (e.target.style.borderColor = COLORS.border)}
                />
              </div>

              {/* Action Buttons */}
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {newAppointment.stylistId &&
                  newAppointment.date &&
                  newAppointment.services.length > 0 &&
                  availableTimeSlots.length === 0 && (
                    <button
                      onClick={handleCheckAvailability}
                      disabled={loading}
                      style={{
                        width: "100%",
                        padding: "14px 20px",
                        background: loading ? COLORS.textLight : `linear-gradient(135deg, ${COLORS.info}, #3182ce)`,
                        color: "white",
                        border: "none",
                        borderRadius: "8px",
                        fontWeight: "700",
                        cursor: loading ? "not-allowed" : "pointer",
                        transition: "all 0.2s ease",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "8px",
                      }}
                    >
                      <Clock size={16} />
                      {loading ? "Checking..." : "Check Availability"}
                    </button>
                  )}

                {(availableTimeSlots.length > 0 && newAppointment.startTime && newAppointment.endTime) ||
                  (!newAppointment.stylistId || !newAppointment.date || newAppointment.services.length === 0) ? (
                  <div style={{ display: "flex", gap: "12px" }}>
                    <button
                      onClick={() => setShowAddAppointmentPanel(false)}
                      style={{
                        flex: 1,
                        padding: "14px 20px",
                        background: "transparent",
                        border: `2px solid ${COLORS.border}`,
                        color: COLORS.text,
                        borderRadius: "8px",
                        fontWeight: "600",
                        cursor: "pointer",
                        transition: "all 0.2s ease",
                      }}
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSaveAppointment}
                      disabled={loading || !newAppointment.clientName || !newAppointment.stylistId ||
                        !newAppointment.date || !newAppointment.startTime || !newAppointment.endTime ||
                        newAppointment.services.length === 0}
                      style={{
                        flex: 2,
                        padding: "14px 20px",
                        background: loading || !newAppointment.clientName || !newAppointment.stylistId ||
                          !newAppointment.date || !newAppointment.startTime || !newAppointment.endTime ||
                          newAppointment.services.length === 0
                          ? COLORS.textLight
                          : `linear-gradient(135deg, ${COLORS.success}, #38a169)`,
                        color: "white",
                        border: "none",
                        borderRadius: "8px",
                        fontWeight: "700",
                        cursor: loading || !newAppointment.clientName || !newAppointment.stylistId ||
                          !newAppointment.date || !newAppointment.startTime || !newAppointment.endTime ||
                          newAppointment.services.length === 0
                          ? "not-allowed"
                          : "pointer",
                        transition: "all 0.2s ease",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "8px",
                      }}
                    >
                      <Save size={16} />
                      {loading ? "Saving..." : isEditingAppointment ? "Update Appointment" : "Create Appointment"}
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setShowAddAppointmentPanel(false)}
                    style={{
                      width: "100%",
                      padding: "14px 20px",
                      background: "transparent",
                      border: `2px solid ${COLORS.border}`,
                      color: COLORS.text,
                      borderRadius: "8px",
                      fontWeight: "600",
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                    }}
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default AppointmentPanel;