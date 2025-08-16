import React from "react"
import { X, Plane, Trash2, Save } from "lucide-react"

const ScheduleManagementPanel = ({
  show,
  setShow,
  COLORS,
  scheduleTypes,
  scheduleType,
  setScheduleType,
  selectedTimeSlots,
  selectedLeaveDays,
  selectedLeavesToDelete,
  setSelectedLeavesToDelete,
  getUpcomingLeaves,
  getStylistById,
  handleLeaveSelection,
  handleDeleteSelectedLeaves,
  handleSaveSchedule,
  loading,
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
        onClick={() => {
          setShow(false)
          setSelectedLeavesToDelete([])
        }}
      />

      {/* Side Panel */}
      <div
        style={{
          position: "fixed",
          right: 0,
          top: 0,
          height: "100vh",
          width: "450px",
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
            background: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.secondary})`,
            color: "white",
          }}
        >
          <div>
            <h2 style={{ fontSize: "22px", fontWeight: "800", margin: 0, marginBottom: "4px" }}>
              Schedule Management
            </h2>
            <p style={{ fontSize: "14px", opacity: 0.9, margin: 0 }}>Configure staff schedules</p>
          </div>
          <button
            onClick={() => {
              setShow(false)
              setSelectedLeavesToDelete([])
            }}
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

        <div style={{ padding: "32px" }}>
          {/* Schedule Type Selector */}
          <div style={{ marginBottom: "32px" }}>
            <label
              style={{
                display: "block",
                fontWeight: "700",
                color: COLORS.text,
                marginBottom: "16px",
                fontSize: "16px",
              }}
            >
              Schedule Type
            </label>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {scheduleTypes.map((type) => {
                const Icon = type.icon
                return (
                  <button
                    key={type.value}
                    onClick={() => setScheduleType(type.value)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                      padding: "16px 20px",
                      backgroundColor: scheduleType === type.value ? `${type.color}20` : "transparent",
                      borderColor: scheduleType === type.value ? type.color : COLORS.border,
                      color: scheduleType === type.value ? type.color : COLORS.textLight,
                      border: "3px solid",
                      borderRadius: "12px",
                      fontWeight: "600",
                      cursor: "pointer",
                      transition: "all 0.3s ease",
                      fontSize: "15px",
                      boxShadow: scheduleType === type.value ? `0 6px 20px ${type.color}30` : "none",
                    }}
                  >
                    <Icon size={18} />
                    {type.label}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Instructions */}
          <div
            style={{
              background: "rgba(59, 130, 246, 0.1)",
              border: "2px solid rgba(59, 130, 246, 0.2)",
              borderRadius: "12px",
              padding: "16px 20px",
              marginBottom: "32px",
            }}
          >
            <p
              style={{
                color: "#1e40af",
                fontSize: "15px",
                margin: 0,
                fontWeight: "500",
                lineHeight: "1.5",
              }}
            >
              💡{" "}
              {scheduleType === "leave"
                ? "Switch to day view to select leave days for staff members"
                : "Drag on the calendar to select time slots for availability or breaks"}
            </p>
          </div>

          {/* Preview */}
          {(selectedTimeSlots.length > 0 || selectedLeaveDays.length > 0) && (
            <div
              style={{
                background: "rgba(66, 153, 225, 0.1)",
                border: "2px solid rgba(66, 153, 225, 0.2)",
                borderRadius: "12px",
                padding: "16px 20px",
                marginBottom: "32px",
              }}
            >
              <p
                style={{
                  color: "#2c5282",
                  fontSize: "15px",
                  margin: 0,
                  fontWeight: "600",
                }}
              >
                <strong>Selection:</strong>{" "}
                {scheduleType === "leave"
                  ? `${selectedLeaveDays.length} day(s) selected`
                  : `${selectedTimeSlots.length} time slot(s) selected`}
              </p>
            </div>
          )}

          {/* Manage Leaves */}
          <div style={{ marginBottom: "32px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
              <Plane size={18} color={COLORS.leave} />
              <h3 style={{ fontSize: "16px", fontWeight: "700", color: COLORS.text, margin: 0 }}>
                Manage Upcoming Leaves
              </h3>
            </div>

            {getUpcomingLeaves().length === 0 ? (
              <div
                style={{
                  background: "rgba(107, 114, 128, 0.1)",
                  border: "2px solid rgba(107, 114, 128, 0.2)",
                  borderRadius: "12px",
                  padding: "16px 20px",
                  textAlign: "center",
                }}
              >
                <p style={{ color: COLORS.textLight, fontSize: "14px", margin: 0 }}>
                  No upcoming leaves found
                </p>
              </div>
            ) : (
              <>
                <div
                  style={{
                    background: "rgba(239, 68, 68, 0.05)",
                    border: "2px solid rgba(239, 68, 68, 0.1)",
                    borderRadius: "12px",
                    maxHeight: "200px",
                    overflowY: "auto",
                    marginBottom: "16px",
                  }}
                >
                  {getUpcomingLeaves().map((leave) => {
                    const stylist = getStylistById(leave.stylist_id)
                    const isSelected = selectedLeavesToDelete.includes(leave.leave_id)
                    const leaveDate = new Date(leave.date).toLocaleDateString("en-US", {
                      weekday: "short",
                      month: "short",
                      day: "numeric",
                    })

                    return (
                      <div
                        key={leave.leave_id}
                        onClick={() => handleLeaveSelection(leave.leave_id)}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          padding: "12px 16px",
                          borderBottom: "1px solid rgba(239, 68, 68, 0.1)",
                          cursor: "pointer",
                          transition: "all 0.2s ease",
                          background: isSelected ? "rgba(239, 68, 68, 0.1)" : "transparent",
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleLeaveSelection(leave.leave_id)}
                          style={{
                            marginRight: "12px",
                            accentColor: COLORS.leave,
                            transform: "scale(1.1)",
                          }}
                        />
                        <div
                          style={{
                            width: "32px",
                            height: "32px",
                            borderRadius: "50%",
                            backgroundColor: stylist.color,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            marginRight: "12px",
                            fontSize: "14px",
                            color: "white",
                            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
                          }}
                        >
                          {stylist.avatar}
                        </div>
                        <div style={{ flex: 1 }}>
                          <div
                            style={{
                              fontWeight: "600",
                              color: COLORS.text,
                              fontSize: "14px",
                              marginBottom: "2px",
                            }}
                          >
                            {stylist.name}
                          </div>
                          <div style={{ fontSize: "12px", color: COLORS.textLight }}>{leaveDate}</div>
                        </div>
                        <div
                          style={{
                            padding: "4px 8px",
                            background: "rgba(239, 68, 68, 0.1)",
                            borderRadius: "6px",
                            fontSize: "11px",
                            fontWeight: "600",
                            color: COLORS.leave,
                          }}
                        >
                          Leave
                        </div>
                      </div>
                    )
                  })}
                </div>

                {selectedLeavesToDelete.length > 0 && (
                  <button
                    onClick={handleDeleteSelectedLeaves}
                    disabled={loading}
                    style={{
                      width: "100%",
                      padding: "12px 16px",
                      background: `linear-gradient(135deg, ${COLORS.danger}, #dc2626)`,
                      color: "white",
                      border: "none",
                      borderRadius: "10px",
                      fontWeight: "600",
                      fontSize: "14px",
                      cursor: loading ? "not-allowed" : "pointer",
                      transition: "all 0.3s ease",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "8px",
                      boxShadow: "0 4px 15px rgba(239, 68, 68, 0.3)",
                      opacity: loading ? 0.7 : 1,
                    }}
                  >
                    <Trash2 size={16} />
                    {loading ? "Deleting..." : `Delete ${selectedLeavesToDelete.length} Leave(s)`}
                  </button>
                )}
              </>
            )}
          </div>

          {/* Save Schedule */}
          <button
            onClick={handleSaveSchedule}
            disabled={loading || (selectedTimeSlots.length === 0 && selectedLeaveDays.length === 0)}
            style={{
              width: "100%",
              padding: "18px",
              background:
                loading || (selectedTimeSlots.length === 0 && selectedLeaveDays.length === 0)
                  ? "#cbd5e0"
                  : `linear-gradient(135deg, ${COLORS.success}, #38a169)`,
              color: "white",
              border: "none",
              borderRadius: "14px",
              fontWeight: "700",
              fontSize: "16px",
              cursor:
                loading || (selectedTimeSlots.length === 0 && selectedLeaveDays.length === 0)
                  ? "not-allowed"
                  : "pointer",
              transition: "all 0.3s ease",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "10px",
              boxShadow: "0 6px 20px rgba(72, 187, 120, 0.3)",
            }}
          >
            <Save size={18} />
            {loading ? "Saving..." : "Save Schedule"}
          </button>
        </div>
      </div>
    </>
  )
}

export default ScheduleManagementPanel
