import React from "react"
import { X, Clock, Save } from "lucide-react"

const AddEditAppointmentPanel = ({
  show,
  setShow,
  isEditing,
  newAppointment,
  setNewAppointment,
  stylists,
  services,
  availableTimeSlots,
  setAvailableTimeSlots,
  loading,
  handleCheckAvailability,
  handleSaveAppointment,
  COLORS,
}) => {
  if (!show) return null

  return (
    <>
      {/* Overlay */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          background: COLORS.overlay,
          backdropFilter: "blur(8px)",
          zIndex: 50,
        }}
        onClick={() => setShow(false)}
      />

      {/* Side Panel */}
      <div
        style={{
          position: "fixed",
          right: 0,
          top: 0,
          height: "100vh",
          width: "500px",
          background: COLORS.cardBg,
          boxShadow: "-10px 0 40px rgba(0, 0, 0, 0.2)",
          zIndex: 51,
          overflowY: "auto",
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: "28px 32px",
            borderBottom: `2px solid ${COLORS.border}`,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            background: `linear-gradient(135deg, ${COLORS.success}, #38a169)`,
            color: "white",
          }}
        >
          <div>
            <h2 style={{ fontSize: "22px", fontWeight: "800", margin: 0, marginBottom: "4px" }}>
              {isEditing ? "Edit Appointment" : "New Appointment"}
            </h2>
            <p style={{ fontSize: "14px", opacity: 0.9, margin: 0 }}>
              {isEditing ? "Update appointment details" : "Schedule a new appointment"}
            </p>
          </div>
          <button
            onClick={() => setShow(false)}
            style={{
              background: "rgba(255, 255, 255, 0.2)",
              border: "none",
              color: "white",
              fontSize: "24px",
              width: "40px",
              height: "40px",
              borderRadius: "50%",
              cursor: "pointer",
              transition: "all 0.3s ease",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <X size={22} />
          </button>
        </div>

        {/* === Main Form === */}
        <div style={{ padding: "32px" }}>
          {/* 🔹 Client Info, Appointment Details, Services, Notes, Buttons */}
          {/* Keep the big JSX blocks you already wrote here, unchanged,
              just replacing state props with the ones passed down */}
        </div>
      </div>
    </>
  )
}

export default AddEditAppointmentPanel
