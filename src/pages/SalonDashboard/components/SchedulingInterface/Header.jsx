import { Calendar, Settings, Plus } from 'lucide-react';
import DateRangeNavigator from './DateRangeNavigator';
import ActionButton from './ActionButton';

const Header = ({ 
  title, 
  subtitle, 
  COLORS, 
  navigateDateRange, 
  weekDates, 
  maxDays, 
  formatDate,
  setShowScheduleManagementPanel,
  setSelectedLeavesToDelete,
  handleAddAppointment
}) => {
  return (
    <div className="mb-6 flex flex-wrap justify-between items-center">
      <div className="flex items-center gap-4">
<div
  className="hidden md:flex items-center justify-center rounded-2xl shadow-lg"
  style={{
    width: "60px",
    height: "60px",
    background: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.secondary})`,
    boxShadow: "0 8px 25px rgba(102, 126, 234, 0.3)",
  }}
>
  <Calendar size={28} color="white" />
</div>

        <div className="hidden md:flex flex-col">
          <h1 className="text-2xl font-extrabold text-[${COLORS.text}] mb-1">
            {title}
          </h1>
          <p className="text-sm font-medium text-[${COLORS.textLight}]">
            {subtitle}
          </p>
        </div>
      </div>
      <div className="flex flex-wrap gap-3">
        <DateRangeNavigator 
          navigateDateRange={navigateDateRange}
          weekDates={weekDates}
          maxDays={maxDays}
          formatDate={formatDate}
          COLORS={COLORS}
        />
        <ActionButton
          icon={<Settings size={18} />}
          text="Manage Schedules"
          onClick={() => {
            setShowScheduleManagementPanel(true);
            setSelectedLeavesToDelete([]);
          }}
          color={COLORS.warning}
        />
        <ActionButton
          icon={<Plus size={18} />}
          text="Add Appointment"
          onClick={handleAddAppointment}
          color={COLORS.success}
        />
      </div>
    </div>
  );
};

export default Header;
