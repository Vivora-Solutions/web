import { ChevronLeft, ChevronRight } from "lucide-react";

const DateRangeNavigator = ({
  navigateDateRange,
  weekDates,
  maxDays,
  formatDate,
  COLORS,
}) => {
  return (
    <div
      className={`flex items-center gap-2 sm:gap-5 px-3 sm:px-5 py-2 sm:py-3 rounded-xl shadow-sm border w-full sm:w-auto`}
      style={{
        background: COLORS.cardBg,
        borderColor: COLORS.border,
        boxShadow: "0 4px 15px rgba(0,0,0,0.08)",
      }}
    >
      <button
        onClick={() => navigateDateRange(-1)}
        className={`p-1 sm:p-2 rounded-md transition-colors duration-200 flex items-center justify-center flex-shrink-0`}
        style={{ color: COLORS.text }}
        onMouseEnter={(e) => (e.currentTarget.style.background = COLORS.hover)}
        onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
      >
        <ChevronLeft size={18} className="sm:w-5 sm:h-5" />
      </button>

      <span
        className="font-bold text-center text-xs sm:text-sm flex-1 truncate"
        style={{ color: COLORS.text, minWidth: "120px" }}
      >
        {weekDates.length > 0 &&
          (maxDays === 1
            ? formatDate(weekDates[0])
            : `${formatDate(weekDates[0])} - ${formatDate(
                weekDates[weekDates.length - 1]
              )}`)}
      </span>

      <button
        onClick={() => navigateDateRange(1)}
        className={`p-1 sm:p-2 rounded-md transition-colors duration-200 flex items-center justify-center flex-shrink-0`}
        style={{ color: COLORS.text }}
        onMouseEnter={(e) => (e.currentTarget.style.background = COLORS.hover)}
        onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
      >
        <ChevronRight size={18} className="sm:w-5 sm:h-5" />
      </button>
    </div>
  );
};

export default DateRangeNavigator;
