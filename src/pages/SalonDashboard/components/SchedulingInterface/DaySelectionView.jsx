import { Plane, CheckCircle } from "lucide-react";

const DaySelectionView = ({
  weekDates,
  isDaySelected,
  handleDayClick,
  COLORS,
  selectedLeaveDays = [],
}) => {
  return (
    <div className="p-6">
      <div
        className="rounded-2xl shadow-2xl overflow-hidden"
        style={{ background: COLORS.cardBg }}
      >
        {/* Header */}
        <div
          className="px-8 py-6 text-center text-white"
          style={{
            background: `linear-gradient(135deg, ${COLORS.leave}, #c53030)`,
          }}
        >
          <div className="flex items-center justify-center gap-3 mb-2">
            <Plane size={24} />
            <h2 className="text-2xl font-bold">Select Leave Days</h2>
          </div>
          <p className="text-base opacity-90">
            Click on days to mark them for leave
          </p>
        </div>

        {/* Calendar Grid */}
        <div className="p-8">
          <div
            className={`grid gap-4 max-w-3xl mx-auto`}
            style={{
              gridTemplateColumns: `repeat(${Math.min(
                weekDates.length,
                4
              )}, 1fr)`,
            }}
          >
            {weekDates.map((date, index) => {
              const isSelected = isDaySelected(date);
              const isToday = date.toDateString() === new Date().toDateString();

              return (
                <div
                  key={index}
                  onClick={() => handleDayClick(date)}
                  className={`rounded-xl p-6 text-center cursor-pointer transition-all duration-300 ${
                    isSelected
                      ? "transform -translate-y-1 text-white"
                      : isToday
                      ? "text-white"
                      : "text-gray-700"
                  }`}
                  style={{
                    background: isSelected
                      ? `linear-gradient(135deg, ${COLORS.leave}, #c53030)`
                      : isToday
                      ? `linear-gradient(135deg, ${COLORS.info}, #3182ce)`
                      : "white",
                    border: `3px solid ${
                      isSelected
                        ? COLORS.leave
                        : isToday
                        ? COLORS.info
                        : COLORS.border
                    }`,
                    boxShadow: isSelected
                      ? "0 8px 25px rgba(239, 68, 68, 0.3)"
                      : isToday
                      ? "0 8px 25px rgba(66, 153, 225, 0.3)"
                      : "0 4px 15px rgba(0, 0, 0, 0.1)",
                  }}
                >
                  <div className="text-sm font-semibold mb-2 opacity-80">
                    {date
                      .toLocaleDateString("en-US", { weekday: "short" })
                      .toUpperCase()}
                  </div>
                  <div className="text-3xl font-bold mb-1">
                    {date.getDate()}
                  </div>
                  <div className="text-xs font-medium opacity-80">
                    {date.toLocaleDateString("en-US", { month: "short" })}
                  </div>
                  {isSelected && (
                    <div className="mt-3 flex justify-center">
                      <CheckCircle size={20} />
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Selection Summary */}
          {selectedLeaveDays.length > 0 && (
            <div className="mt-8 p-5 rounded-xl border-2 text-center max-w-md mx-auto bg-red-50 border-red-200">
              <h3
                className="text-lg font-semibold mb-2"
                style={{ color: COLORS.leave }}
              >
                {selectedLeaveDays.length} Day
                {selectedLeaveDays.length !== 1 ? "s" : ""} Selected
              </h3>
              <p className="text-sm text-red-700">
                These days will be marked as leave for all selected staff
                members
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DaySelectionView;
