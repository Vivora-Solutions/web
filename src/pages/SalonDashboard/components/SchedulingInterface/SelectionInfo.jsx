import { Coffee, Plane, Plus } from "lucide-react";

const SelectionInfo = ({
  selectedTimeSlots,
  selectedLeaveDays,
  scheduleType,
  COLORS,
  selectedStylists = [],
  onQuickAddBreak,
  onQuickAddLeave,
  loading = false,
}) => {
  if (!selectedTimeSlots.length && !selectedLeaveDays.length) return null;

  const handleQuickAction = () => {
    if (scheduleType === "leave" && onQuickAddLeave) {
      onQuickAddLeave();
    } else if (scheduleType === "break" && onQuickAddBreak) {
      onQuickAddBreak();
    }
  };

  const getActionButtonText = () => {
    if (scheduleType === "leave") {
      return `Add ${selectedLeaveDays.length} Leave Day${
        selectedLeaveDays.length !== 1 ? "s" : ""
      }`;
    } else if (scheduleType === "break") {
      return `Add ${selectedTimeSlots.length} Break Slot${
        selectedTimeSlots.length !== 1 ? "s" : ""
      }`;
    }
    return null;
  };

  const getActionIcon = () => {
    if (scheduleType === "leave") {
      return <Plane size={16} className="shrink-0" />;
    } else if (scheduleType === "break") {
      return <Coffee size={16} className="shrink-0" />;
    }
    return <Plus size={16} className="shrink-0" />;
  };

  const getActionColor = () => {
    if (scheduleType === "leave") {
      return COLORS.leave;
    } else if (scheduleType === "break") {
      return COLORS.break;
    }
    return COLORS.info;
  };

  const canShowQuickAction =
    (scheduleType === "leave" || scheduleType === "break") &&
    selectedStylists.length > 0 &&
    (onQuickAddBreak || onQuickAddLeave);

  return (
    <div className="flex items-center gap-4 flex-wrap">
      {/* Selection Info */}
      <div
        className="rounded-xl px-5 py-3 shadow-md"
        style={{
          background: "rgba(66, 153, 225, 0.1)",
          border: "2px solid rgba(66, 153, 225, 0.2)",
          boxShadow: "0 4px 15px rgba(66, 153, 225, 0.1)",
        }}
      >
        <span className="text-[15px] font-bold" style={{ color: "#2c5282" }}>
          {scheduleType === "leave"
            ? `${selectedLeaveDays.length} days selected for leave`
            : `${selectedTimeSlots.length} slots selected for ${scheduleType}`}
        </span>
      </div>

      {/* Quick Action Button */}
      {canShowQuickAction && (
        <button
          onClick={handleQuickAction}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-3 rounded-xl font-semibold text-white text-sm transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          style={{
            background: `linear-gradient(135deg, ${getActionColor()}, ${getActionColor()}dd)`,
            boxShadow: `0 4px 15px ${getActionColor()}40`,
          }}
        >
          {loading ? (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            getActionIcon()
          )}
          <span>{getActionButtonText()}</span>
          {selectedStylists.length > 1 && (
            <span className="text-xs opacity-80">
              ({selectedStylists.length} staff)
            </span>
          )}
        </button>
      )}
    </div>
  );
};

export default SelectionInfo;
