import { Coffee, Plane, Plus, X } from "lucide-react";

const FloatingActionButton = ({
  scheduleType,
  selectedTimeSlots = [],
  selectedLeaveDays = [],
  selectedStylists = [],
  onQuickAddBreak,
  onQuickAddLeave,
  onCancel,
  loading = false,
  COLORS,
}) => {
  // Don't show if no selection or no staff selected
  if (
    (!selectedTimeSlots.length && !selectedLeaveDays.length) ||
    selectedStylists.length === 0
  ) {
    return null;
  }

  // Don't show for available schedule type
  if (scheduleType === "available") {
    return null;
  }

  const getActionData = () => {
    if (scheduleType === "leave") {
      return {
        icon: <Plane size={20} className="shrink-0" />,
        text: `Add ${selectedLeaveDays.length} Leave Day${
          selectedLeaveDays.length !== 1 ? "s" : ""
        }`,
        color: COLORS.leave,
        action: onQuickAddLeave,
        count: selectedLeaveDays.length,
      };
    } else if (scheduleType === "break") {
      return {
        icon: <Coffee size={20} className="shrink-0" />,
        text: `Add ${selectedTimeSlots.length} Break Slot${
          selectedTimeSlots.length !== 1 ? "s" : ""
        }`,
        color: COLORS.break,
        action: onQuickAddBreak,
        count: selectedTimeSlots.length,
      };
    }
    return null;
  };

  const actionData = getActionData();
  if (!actionData) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 animate-fade-in">
      {/* Cancel button */}
      <button
        onClick={onCancel}
        className="w-12 h-12 bg-gray-500 text-white rounded-full shadow-lg hover:bg-gray-600 transition-all duration-200 flex items-center justify-center hover:scale-110"
      >
        <X size={20} />
      </button>

      {/* Main action button */}
      <button
        onClick={actionData.action}
        disabled={loading}
        className="flex items-center gap-3 px-6 py-4 rounded-full font-bold text-white text-base transition-all duration-200 shadow-xl hover:shadow-2xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
        style={{
          background: `linear-gradient(135deg, ${actionData.color}, ${actionData.color}dd)`,
          boxShadow: `0 8px 25px ${actionData.color}50`,
        }}
      >
        {loading ? (
          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
        ) : (
          actionData.icon
        )}
        <span className="font-semibold">{actionData.text}</span>
        {selectedStylists.length > 1 && (
          <span className="text-sm opacity-90 bg-white/20 px-3 py-1 rounded-full">
            {selectedStylists.length} staff
          </span>
        )}
      </button>
    </div>
  );
};

export default FloatingActionButton;
