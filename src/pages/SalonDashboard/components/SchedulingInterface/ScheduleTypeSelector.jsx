import { Calendar } from "lucide-react";

const ScheduleTypeSelector = ({
  scheduleType,
  setScheduleType,
  setSelectedTimeSlots,
  setSelectedLeaveDays,
  scheduleTypes,
  COLORS,
}) => {
  return (
    <div className="flex flex-col gap-3">
      {/* Header */}
      <div className="flex items-center gap-2">
        <Calendar size={18} color={COLORS.text} />
        <h3
          className="text-base font-bold m-0"
          style={{ color: COLORS.text }}
        >
          Schedule Type
        </h3>
      </div>

      {/* Buttons */}
      <div className="flex gap-2">
        {scheduleTypes.map((type) => {
          const IconComponent = type.icon;
          const isActive = scheduleType === type.value;

          return (
            <button
              key={type.value}
              onClick={() => {
                setScheduleType(type.value);
                setSelectedTimeSlots([]);
                setSelectedLeaveDays([]);
              }}
              className="px-4 py-3 rounded-xl font-semibold text-sm flex items-center gap-2 cursor-pointer transition-all duration-300"
              style={{
                background: isActive
                  ? `linear-gradient(135deg, ${type.color}, #38a169)`
                  : COLORS.cardBg,
                border: `2px solid ${isActive ? type.color : COLORS.border}`,
                color: isActive ? "white" : COLORS.text,
                boxShadow: isActive
                  ? `0 6px 20px ${type.color}50`
                  : "0 2px 8px rgba(0, 0, 0, 0.1)",
              }}
            >
              <IconComponent size={16} />
              {type.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default ScheduleTypeSelector;
