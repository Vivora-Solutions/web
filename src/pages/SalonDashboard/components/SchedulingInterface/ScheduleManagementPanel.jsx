import { X, Save, Trash2, Plane } from "lucide-react"
import { COLORS } from "./utils/colors";

// Tailwind helper for conditional classes
function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

const ScheduleManagementPanel = ({
  showScheduleManagementPanel,
  setShowScheduleManagementPanel,
  scheduleType,
  setScheduleType,
  scheduleTypes,
  selectedTimeSlots,
  selectedLeaveDays,
  selectedBreakSlots,
  selectedLeavesToDelete,
  setSelectedLeavesToDelete,
  selectedStylists,
  handleSaveSchedule,
  handleDeleteSelectedLeaves,
  handleLeaveSelection,
  getStylistById,
  getUpcomingLeaves,
  loading,
}) => {
  if (!showScheduleManagementPanel) return null

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 z-[50] bg-white backdrop-blur-sm"
        onClick={() => {
          setShowScheduleManagementPanel(false)
          setSelectedLeavesToDelete([])
        }}
      />

      {/* Panel */}
      <div
        className="fixed right-0 top-0 h-screen w-full max-w-[450px] bg-white  shadow-2xl z-[51] overflow-y-auto flex flex-col"
      >
        {/* Header */}
        <div
          className="flex justify-between items-center px-6 py-7 border-b-2"
          style={{
            borderColor: COLORS.border,
            background: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.secondary})`,
            color: "white",
          }}
        >
          <div>
            <h2 className="text-[22px] font-extrabold mb-1">Schedule Management</h2>
            <p className="text-[14px] opacity-90 m-0">Configure staff schedules</p>
          </div>
          <button
            onClick={() => {
              setShowScheduleManagementPanel(false)
              setSelectedLeavesToDelete([])
            }}
            className="bg-white/20 border-none text-white text-[24px] w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 hover:bg-white/30"
          >
            <X size={22} />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-8 flex-1 flex flex-col">
          {/* Schedule Type Selection */}
          <div className="mb-8">
            <label className="block font-bold text-gray-800mb-4 text-[16px]">
              Schedule Type
            </label>
            <div className="flex flex-col gap-3">
              {scheduleTypes.map((type) => {
                const Icon = type.icon
                return (
                  <button
                    key={type.value}
                    onClick={() => setScheduleType(type.value)}
                    className={cn(
                      "flex items-center gap-3 px-5 py-4 border-2 rounded-xl font-semibold text-[15px] transition-all duration-300 shadow-sm",
                      scheduleType === type.value
                        ? "bg-opacity-10 border-3 shadow-lg"
                        : "bg-transparent border-3",
                    )}
                    style={{
                      backgroundColor: scheduleType === type.value ? `${type.color}20` : "transparent",
                      borderColor: scheduleType === type.value ? type.color : COLORS.border,
                      color: scheduleType === type.value ? type.color : COLORS.textLight,
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
          <div className="rounded-xl p-4 mb-8 border-2 bg-blue-100/50 border-blue-200">
            <p className="text-blue-900 text-[15px] font-medium leading-[1.5] m-0">
              💡{" "}
              {scheduleType === "leave"
                ? "Switch to day view to select leave days for staff members"
                : "Drag on the calendar to select time slots for availability or breaks"}
            </p>
          </div>

          {/* Selection Preview */}
          {(selectedTimeSlots.length > 0 || selectedLeaveDays.length > 0) && (
            <div className="rounded-xl p-4 mb-8 border-2 bg-blue-200/20 border-blue-200">
              <p className="text-blue-800 text-[15px] font-semibold m-0">
                <strong>Selection:</strong>{" "}
                {scheduleType === "leave"
                  ? `${selectedLeaveDays.length} day(s) selected`
                  : `${selectedTimeSlots.length} time slot(s) selected`}
              </p>
            </div>
          )}

          {/* Upcoming Leaves */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <Plane size={18} color={COLORS.leave} />
              <h3 className="text-[16px] font-bold text-gray-800 m-0">
                Manage Upcoming Leaves
              </h3>
            </div>

            {getUpcomingLeaves().length === 0 ? (
              <div className="rounded-xl p-4 text-center border-2 bg-gray-200/30 border-gray-300">
                <p className="text-gray-400 text-[14px] m-0">No upcoming leaves found</p>
              </div>
            ) : (
              <>
                <div className="rounded-xl max-h-[200px] overflow-y-auto mb-4 border-2 bg-red-100/20 border-red-200">
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
                        className={cn(
                          "flex items-center px-4 py-3 border-b cursor-pointer transition-all duration-200",
                          isSelected ? "bg-red-100/40" : "bg-transparent"
                        )}
                        style={{ borderBottom: "1px solid rgba(239, 68, 68, 0.1)" }}
                      >
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleLeaveSelection(leave.leave_id)}
                          className="mr-3 scale-110 accent-red-500"
                        />

                        <div
                          className="w-8 h-8 rounded-full flex items-center justify-center mr-3 text-[14px] text-white shadow"
                          style={{ backgroundColor: stylist.color }}
                        >
                          {stylist.avatar}
                        </div>

                        <div className="flex-1">
                          <div className="font-semibold text-gray-800 text-[14px] mb-0.5">
                            {stylist.name}
                          </div>
                          <div className="text-[12px] text-gray-400">{leaveDate}</div>
                        </div>

                        <div className="px-2 py-1 bg-red-100 rounded text-[11px] font-semibold text-red-500">
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
                    className={cn(
                      "w-full py-3 rounded-lg font-semibold text-[14px] flex items-center justify-center gap-2 shadow-md transition-all duration-300",
                      loading
                        ? "bg-red-600/80 cursor-not-allowed opacity-70"
                        : "bg-gradient-to-tr from-red-500 to-red-700 hover:from-red-600 hover:to-red-800 cursor-pointer"
                    )}
                  >
                    <Trash2 size={16} />
                    {loading ? "Deleting..." : `Delete ${selectedLeavesToDelete.length} Leave(s)`}
                  </button>
                )}
              </>
            )}
          </div>

          {/* Save Button */}
          <button
            onClick={handleSaveSchedule}
            disabled={loading || (selectedTimeSlots.length === 0 && selectedLeaveDays.length === 0)}
            className={cn(
              "w-full py-4 rounded-xl font-bold text-[16px] flex items-center justify-center gap-2 shadow-lg transition-all duration-300",
              loading || (selectedTimeSlots.length === 0 && selectedLeaveDays.length === 0)
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-gradient-to-tr from-green-500 to-green-700 hover:from-green-600 hover:to-green-800 cursor-pointer text-white"
            )}
          >
            <Save size={18} />
            {loading ? "Saving..." : "Save Schedule"}
          </button>
        </div>
      </div>
      {/* Responsive: panel slides from right, full width on mobile */}
      <style>{`
        @media (max-width: 640px) {
          .max-w-[450px] { max-width: 100vw !important; }
          .sm\\:p-8 { padding: 1.25rem !important; }
        }
      `}</style>
    </>
  )
}

export default ScheduleManagementPanel
