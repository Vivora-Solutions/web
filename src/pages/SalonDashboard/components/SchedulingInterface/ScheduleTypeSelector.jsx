import { Calendar } from 'lucide-react';

const ScheduleTypeSelector = ({
  scheduleType,
  setScheduleType,
  setSelectedTimeSlots,
  setSelectedLeaveDays,
  scheduleTypes,
  COLORS
}) => {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <Calendar size={18} color={COLORS.text} />
        <h3 style={{ fontSize: "16px", fontWeight: "700", color: COLORS.text, margin: 0 }}>Schedule Type</h3>
      </div>
      <div style={{ display: "flex", gap: "8px" }}>
        {scheduleTypes.map((type) => {
          const IconComponent = type.icon;
          return (
            <button
              key={type.value}
              onClick={() => {
                setScheduleType(type.value);
                setSelectedTimeSlots([]);
                setSelectedLeaveDays([]);
              }}
              style={{
                padding: "12px 16px",
                background: scheduleType === type.value ? `linear-gradient(135deg, ${type.color}, #38a169)` : COLORS.cardBg,
                border: `2px solid ${scheduleType === type.value ? type.color : COLORS.border}`,
                borderRadius: "12px",
                fontWeight: "600",
                color: scheduleType === type.value ? "white" : COLORS.text,
                cursor: "pointer",
                transition: "all 0.3s ease",
                boxShadow: scheduleType === type.value ? `0 6px 20px ${type.color}50` : "0 2px 8px rgba(0, 0, 0, 0.1)",
                fontSize: "14px",
                display: "flex",
                alignItems: "center",
                gap: "8px",
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