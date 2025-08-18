import { ChevronLeft, ChevronRight } from 'lucide-react';

const DateRangeNavigator = ({ 
  navigateDateRange, 
  weekDates, 
  maxDays, 
  formatDate,
  COLORS 
}) => {
  return (
    <div
      className={`flex items-center gap-5 px-5 py-3 rounded-xl shadow-sm border`}
      style={{
        background: COLORS.cardBg,
        borderColor: COLORS.border,
        boxShadow: "0 4px 15px rgba(0,0,0,0.08)"
      }}
    >
      <button
        onClick={() => navigateDateRange(-1)}
        className={`p-2 rounded-md transition-colors duration-200 flex items-center justify-center`}
        style={{ color: COLORS.text }}
        onMouseEnter={(e) => e.currentTarget.style.background = COLORS.hover}
        onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
      >
        <ChevronLeft size={20} />
      </button>

      <span
        className="font-bold text-center text-sm flex-1 truncate"
        style={{ color: COLORS.text, minWidth: "180px" }}
      >
        {weekDates.length > 0 &&
          (maxDays === 1
            ? formatDate(weekDates[0])
            : `${formatDate(weekDates[0])} - ${formatDate(weekDates[weekDates.length - 1])}`)}
      </span>

      <button
        onClick={() => navigateDateRange(1)}
        className={`p-2 rounded-md transition-colors duration-200 flex items-center justify-center`}
        style={{ color: COLORS.text }}
        onMouseEnter={(e) => e.currentTarget.style.background = COLORS.hover}
        onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
      >
        <ChevronRight size={20} />
      </button>
    </div>
  );
};

export default DateRangeNavigator;
