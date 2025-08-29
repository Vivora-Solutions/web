import React from "react"
import { X } from "lucide-react"

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
        className="fixed inset-0 z-50 backdrop-blur-md"
        style={{ background: COLORS.overlay }}
        onClick={() => setShow(false)}
      />

      {/* Side Panel */}
      <div
        className="fixed top-0 right-0 h-screen w-full sm:w-[500px] z-50 shadow-2xl overflow-y-auto transition-all"
        style={{ background: COLORS.cardBg }}
      >
        {/* Header */}
        <div
          className="px-8 py-7 border-b-2 flex justify-between items-center"
          style={{
            borderColor: COLORS.border,
            background: `linear-gradient(135deg, ${COLORS.success}, #38a169)`,
            color: "white",
          }}
        >
          <div>
            <h2 className="text-[22px] font-extrabold leading-tight mb-1">
              {isEditing ? "Edit Appointment" : "New Appointment"}
            </h2>
            <p className="text-sm opacity-90">
              {isEditing
                ? "Update appointment details"
                : "Schedule a new appointment"}
            </p>
          </div>
          <button
            onClick={() => setShow(false)}
            className="w-10 h-10 rounded-full flex items-center justify-center bg-white/20 text-white hover:bg-white/30 transition"
          >
            <X size={22} />
          </button>
        </div>

        {/* === Main Form === */}
        <div className="p-8 space-y-6">
          {/* 🔹 Client Info, Appointment Details, Services, Notes, Buttons 
              (Insert your existing JSX form fields here, only update classes to Tailwind) */}
        </div>
      </div>
    </>
  )
}

export default AddEditAppointmentPanel
