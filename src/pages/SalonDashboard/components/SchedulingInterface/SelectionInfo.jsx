const SelectionInfo = ({ selectedTimeSlots, selectedLeaveDays, scheduleType, COLORS }) => {
  if (!selectedTimeSlots.length && !selectedLeaveDays.length) return null;

  return (
    <div
      style={{
        background: "rgba(66, 153, 225, 0.1)",
        border: "2px solid rgba(66, 153, 225, 0.2)",
        borderRadius: "12px",
        padding: "12px 20px",
        boxShadow: "0 4px 15px rgba(66, 153, 225, 0.1)",
      }}
    >
      <span style={{ color: "#2c5282", fontSize: "15px", fontWeight: "700" }}>
        {scheduleType === "leave"
          ? `${selectedLeaveDays.length} days selected for leave`
          : `${selectedTimeSlots.length} slots selected for ${scheduleType}`}
      </span>
    </div>
  );
};

export default SelectionInfo;