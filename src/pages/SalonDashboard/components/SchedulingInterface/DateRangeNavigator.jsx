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
      style={{
        display: "flex",
        alignItems: "center",
        gap: "20px",
        background: COLORS.cardBg,
        padding: "12px 20px",
        borderRadius: "14px",
        boxShadow: "0 4px 15px rgba(0, 0, 0, 0.08)",
        border: `2px solid ${COLORS.border}`,
      }}
    >
      <button
        onClick={() => navigateDateRange(-1)}
        style={{
          background: "none",
          border: "none",
          padding: "10px",
          borderRadius: "8px",
          cursor: "pointer",
          transition: "all 0.2s ease",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: COLORS.text,
        }}
        onMouseEnter={(e) => {
          e.target.style.background = COLORS.hover;
        }}
        onMouseLeave={(e) => {
          e.target.style.background = "none";
        }}
      >
        <ChevronLeft size={20} />
      </button>
      <span
        style={{
          fontWeight: "700",
          color: COLORS.text,
          minWidth: "220px",
          textAlign: "center",
          fontSize: "16px",
        }}
      >
        {weekDates.length > 0 &&
          (maxDays === 1
            ? formatDate(weekDates[0])
            : `${formatDate(weekDates[0])} - ${formatDate(weekDates[weekDates.length - 1])}`)}
      </span>
      <button
        onClick={() => navigateDateRange(1)}
        style={{
          background: "none",
          border: "none",
          padding: "10px",
          borderRadius: "8px",
          cursor: "pointer",
          transition: "all 0.2s ease",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: COLORS.text,
        }}
        onMouseEnter={(e) => {
          e.target.style.background = COLORS.hover;
        }}
        onMouseLeave={(e) => {
          e.target.style.background = "none";
        }}
      >
        <ChevronRight size={20} />
      </button>
    </div>
  );
};

export default DateRangeNavigator;