import React from 'react';
import { Plane, CheckCircle } from 'lucide-react';

const DaySelectionView = ({
  weekDates,
  isDaySelected,
  handleDayClick,
  COLORS
}) => {
  return (
    <div style={{ padding: "24px" }}>
      <div
        style={{
          background: COLORS.cardBg,
          borderRadius: "20px",
          boxShadow: "0 10px 40px rgba(0, 0, 0, 0.1)",
          overflow: "hidden",
        }}
      >
        {/* Header */}
        <div
          style={{
            background: `linear-gradient(135deg, ${COLORS.leave}, #c53030)`,
            color: "white",
            padding: "24px 32px",
            textAlign: "center",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "12px",
              marginBottom: "8px",
            }}
          >
            <Plane size={24} />
            <h2 style={{ fontSize: "24px", fontWeight: "700", margin: 0 }}>Select Leave Days</h2>
          </div>
          <p style={{ fontSize: "16px", opacity: 0.9, margin: 0 }}>Click on days to mark them for leave</p>
        </div>

        {/* Calendar Grid */}
        <div style={{ padding: "32px" }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: `repeat(${Math.min(weekDates.length, 4)}, 1fr)`,
              gap: "16px",
              maxWidth: "800px",
              margin: "0 auto",
            }}
          >
            {weekDates.map((date, index) => {
              const isSelected = isDaySelected(date);
              const isToday = date.toDateString() === new Date().toDateString();
              return (
                <div
                  key={index}
                  onClick={() => handleDayClick(date)}
                  style={{
                    background: isSelected
                      ? `linear-gradient(135deg, ${COLORS.leave}, #c53030)`
                      : isToday
                      ? `linear-gradient(135deg, ${COLORS.info}, #3182ce)`
                      : "white",
                    border: `3px solid ${isSelected ? COLORS.leave : isToday ? COLORS.info : COLORS.border}`,
                    borderRadius: "16px",
                    padding: "24px 16px",
                    textAlign: "center",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                    boxShadow: isSelected
                      ? "0 8px 25px rgba(239, 68, 68, 0.3)"
                      : isToday
                      ? "0 8px 25px rgba(66, 153, 225, 0.3)"
                      : "0 4px 15px rgba(0, 0, 0, 0.1)",
                    transform: isSelected ? "translateY(-4px)" : "none",
                    color: isSelected || isToday ? "white" : COLORS.text,
                  }}
                >
                  <div style={{ fontSize: "14px", fontWeight: "600", marginBottom: "8px", opacity: 0.8 }}>
                    {date.toLocaleDateString("en-US", { weekday: "short" }).toUpperCase()}
                  </div>
                  <div style={{ fontSize: "32px", fontWeight: "700", marginBottom: "4px" }}>{date.getDate()}</div>
                  <div style={{ fontSize: "12px", fontWeight: "500", opacity: 0.8 }}>
                    {date.toLocaleDateString("en-US", { month: "short" })}
                  </div>
                  {isSelected && (
                    <div style={{ marginTop: "12px" }}>
                      <CheckCircle size={20} />
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Selection Summary */}
          {selectedLeaveDays.length > 0 && (
            <div
              style={{
                marginTop: "32px",
                padding: "20px",
                background: "rgba(239, 68, 68, 0.1)",
                border: "2px solid rgba(239, 68, 68, 0.2)",
                borderRadius: "12px",
                textAlign: "center",
                maxWidth: "400px",
                margin: "32px auto 0",
              }}
            >
              <h3 style={{ color: COLORS.leave, fontSize: "18px", fontWeight: "600", marginBottom: "8px" }}>
                {selectedLeaveDays.length} Day{selectedLeaveDays.length !== 1 ? "s" : ""} Selected
              </h3>
              <p style={{ color: "#c53030", fontSize: "14px", margin: 0 }}>
                These days will be marked as leave for all selected staff members
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DaySelectionView;