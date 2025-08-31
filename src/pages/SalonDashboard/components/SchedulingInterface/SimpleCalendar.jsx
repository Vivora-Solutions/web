import React, { useState, useMemo, useCallback } from "react";
import { Plane, CheckCircle, X } from "lucide-react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import styles from "./SimpleCalendar.module.css";

const SimpleCalendar = ({
  COLORS,
  selectedLeaveDays = [],
  selectedStylists = [],
  onDaySelect,
  onQuickAddLeave,
  loading = false,
}) => {
  const [calendarDate, setCalendarDate] = useState(new Date());

  // Convert selectedLeaveDays to Date objects for comparison
  const selectedDatesSet = useMemo(() => {
    return new Set(
      selectedLeaveDays.map((date) => {
        if (date instanceof Date) {
          return date.toDateString();
        }
        return new Date(date).toDateString();
      })
    );
  }, [selectedLeaveDays]);

  // Handle date selection
  const handleCalendarChange = useCallback(
    (date) => {
      if (date instanceof Date) {
        onDaySelect(date);
        setCalendarDate(date);
      }
    },
    [onDaySelect]
  );

  // Custom tile content for calendar
  const tileContent = ({ date, view }) => {
    if (view === "month") {
      const isSelected = selectedDatesSet.has(date.toDateString());
      if (isSelected) {
        return (
          <div className={styles.selectedMarker}>
            <CheckCircle size={14} />
          </div>
        );
      }
    }
    return null;
  };

  // Custom tile class names for calendar
  const tileClassName = ({ date, view }) => {
    if (view === "month") {
      const isSelected = selectedDatesSet.has(date.toDateString());
      const isToday = date.toDateString() === new Date().toDateString();
      const isPast = date < new Date().setHours(0, 0, 0, 0);

      let classes = [];

      if (isSelected) {
        classes.push(styles.selectedDay);
      }
      if (isToday) {
        classes.push(styles.today);
      }
      if (isPast) {
        classes.push(styles.pastDate);
      }

      return classes.join(" ");
    }
    return null;
  };

  // Clear all selected dates
  const clearSelection = () => {
    selectedLeaveDays.forEach((date) => onDaySelect(date)); // Toggle off each selected date
  };

  // Get formatted date list
  const getFormattedDates = () => {
    return selectedLeaveDays
      .map((date) => {
        const dateObj = date instanceof Date ? date : new Date(date);
        return dateObj.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        });
      })
      .sort();
  };

  return (
    <div className="p-6">
      <div className={styles.container}>
        {/* Header */}
        <div
          className={styles.header}
          style={{
            background: `linear-gradient(135deg, ${COLORS.leave}, #c53030)`,
          }}
        >
          <div className="flex items-center justify-center gap-3 mb-2">
            <Plane size={24} />
            <h2 className="text-2xl font-bold">Select Leave Days</h2>
          </div>
          <p className="text-base opacity-90">
            Click on calendar days to mark them for leave
          </p>
        </div>

        {/* Calendar */}
        <div className="p-8">
          <div className={styles.calendarWrapper}>
            <Calendar
              onChange={handleCalendarChange}
              value={calendarDate}
              tileContent={tileContent}
              tileClassName={tileClassName}
              selectRange={false}
              minDate={new Date()}
              showNeighboringMonth={true}
              next2Label={null}
              prev2Label={null}
              navigationLabel={({ date, view, label }) => {
                if (view === "month") {
                  return date.toLocaleDateString("en-US", {
                    month: "long",
                    year: "numeric",
                  });
                }
                return label;
              }}
            />
          </div>

          {/* Selection Summary */}
          {selectedLeaveDays.length > 0 && (
            <div className="mt-8 space-y-4 max-w-2xl mx-auto">
              <div className={styles.selectionSummary}>
                <h3
                  className="text-lg font-semibold text-center"
                  style={{ color: COLORS.leave }}
                >
                  {selectedLeaveDays.length} Day
                  {selectedLeaveDays.length !== 1 ? "s" : ""} Selected
                </h3>

                {/* Selected Dates List */}
                <div className="flex flex-wrap gap-2 justify-center mt-4">
                  {getFormattedDates().map((dateStr, index) => (
                    <span key={index} className={styles.dateTag}>
                      {dateStr}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SimpleCalendar;
