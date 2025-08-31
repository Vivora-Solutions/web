import { Coffee, Plane, Plus } from "lucide-react";

const SelectionInfo = ({
  selectedTimeSlots,
  selectedLeaveDays,
  scheduleType,
  COLORS,
  selectedStylists = [],
  stylists = [],
  onQuickAddBreak,
  onQuickAddLeave,
  loading = false,
}) => {
  if (!selectedTimeSlots.length && !selectedLeaveDays.length) return null;

  // Get selected stylist names
  const getSelectedStylistNames = () => {
    const selectedStylistsData = stylists.filter((stylist) =>
      selectedStylists.includes(stylist.id)
    );

    if (selectedStylistsData.length === 0) return "No staff selected";
    if (selectedStylistsData.length === 1) return selectedStylistsData[0].name;
    if (selectedStylistsData.length === 2)
      return `${selectedStylistsData[0].name} and ${selectedStylistsData[1].name}`;
    if (selectedStylistsData.length <= 4) {
      const names = selectedStylistsData
        .slice(0, -1)
        .map((s) => s.name)
        .join(", ");
      return `${names} and ${
        selectedStylistsData[selectedStylistsData.length - 1].name
      }`;
    }
    return `${selectedStylistsData
      .slice(0, 3)
      .map((s) => s.name)
      .join(", ")} and ${selectedStylistsData.length - 3} others`;
  };

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
        <div className="text-[15px] font-bold" style={{ color: "#2c5282" }}>
          <div className="mb-1">
            {scheduleType === "leave"
              ? `${selectedLeaveDays.length} day${
                  selectedLeaveDays.length !== 1 ? "s" : ""
                } selected for leave`
              : `${selectedTimeSlots.length} slot${
                  selectedTimeSlots.length !== 1 ? "s" : ""
                } selected for ${scheduleType}`}
          </div>
          {selectedStylists.length > 0 && (
            <div className="text-[13px] font-medium opacity-80">
              Staff: {getSelectedStylistNames()}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SelectionInfo;
