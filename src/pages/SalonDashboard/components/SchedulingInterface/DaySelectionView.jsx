import SimpleCalendar from "./SimpleCalendar";

const DaySelectionView = ({
  weekDates,
  isDaySelected,
  handleDayClick,
  COLORS,
  selectedLeaveDays = [],
  selectedStylists = [],
  onQuickAddLeave,
  loading = false,
}) => {
  return (
    <SimpleCalendar
      COLORS={COLORS}
      selectedLeaveDays={selectedLeaveDays}
      selectedStylists={selectedStylists}
      onDaySelect={handleDayClick}
      onQuickAddLeave={onQuickAddLeave}
      loading={loading}
    />
  );
};

export default DaySelectionView;
