import { Filter, Calendar } from 'lucide-react';
import ScheduleTypeSelector from './ScheduleTypeSelector';
import ViewPeriodSelector from './ViewPeriodSelector';
import StaffSelection from './StaffSelection';

const FiltersRow = ({
  maxDays,
  setMaxDays,
  dayFilters,
  scheduleType,
  setScheduleType,
  setSelectedTimeSlots,
  setSelectedLeaveDays,
  scheduleTypes,
  stylists,
  selectedStylists,
  setSelectedStylists,
  handleStylistToggle,
  COLORS
}) => {
  return (
    <div style={{ display: "flex", gap: "32px", alignItems: "flex-start", flexWrap: "wrap" }}>
      <ViewPeriodSelector 
        maxDays={maxDays}
        setMaxDays={setMaxDays}
        dayFilters={dayFilters}
        COLORS={COLORS}
      />
      
      <ScheduleTypeSelector
        scheduleType={scheduleType}
        setScheduleType={setScheduleType}
        setSelectedTimeSlots={setSelectedTimeSlots}
        setSelectedLeaveDays={setSelectedLeaveDays}
        scheduleTypes={scheduleTypes}
        COLORS={COLORS}
      />

      <StaffSelection
        stylists={stylists}
        selectedStylists={selectedStylists}
        setSelectedStylists={setSelectedStylists}
        handleStylistToggle={handleStylistToggle}
      />
    </div>
  );
};

export default FiltersRow;