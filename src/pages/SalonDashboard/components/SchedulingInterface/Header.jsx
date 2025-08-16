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
    <div style={{ marginBottom: "24px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
        <div
          style={{
            width: "60px",
            height: "60px",
            background: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.secondary})`,
            borderRadius: "16px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 8px 25px rgba(102, 126, 234, 0.3)",
          }}
        >
          <Calendar size={28} color="white" />
        </div>
        <div>
          <h1
            style={{
              fontSize: "28px",
              fontWeight: "800",
              color: COLORS.text,
              marginBottom: "4px",
              margin: 0,
            }}
          >
            {title}
          </h1>
          <p style={{ fontSize: "15px", color: COLORS.textLight, margin: 0, fontWeight: "500" }}>
            {subtitle}
          </p>
        </div>
      </div>
      <div style={{ display: "flex", gap: "14px" }}>
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