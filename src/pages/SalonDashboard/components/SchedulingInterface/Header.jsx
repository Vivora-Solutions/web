import { Calendar, Settings, Plus } from "lucide-react";
import DateRangeNavigator from "./DateRangeNavigator";
import ActionButton from "./ActionButton";

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
  handleAddAppointment,
}) => {
  return (
    <div className="mb-6">
      {/* Mobile Header */}
      <div className="flex md:hidden flex-col space-y-4 mb-4">
        <div className="flex items-center gap-3">
          <div
            className="flex items-center justify-center rounded-xl shadow-lg bg-gray-800 text-white"
            style={{
              width: "45px",
              height: "45px",
              boxShadow: "0 6px 20px rgba(102, 126, 234, 0.3)",
            }}
          >
            <Calendar size={22} color="white" />
          </div>
          <div className="flex flex-col">
            <h1 className="text-lg font-extrabold text-gray-900 mb-1">
              {title}
            </h1>
            <p className="text-xs font-medium text-gray-600">{subtitle}</p>
          </div>
        </div>

        {/* Mobile Navigation and Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
          <div className="flex-1">
            <DateRangeNavigator
              navigateDateRange={navigateDateRange}
              weekDates={weekDates}
              maxDays={maxDays}
              formatDate={formatDate}
              COLORS={COLORS}
            />
          </div>
          <div className="flex gap-2 sm:gap-3">
            <ActionButton
              icon={<Settings size={16} />}
              text="Manage Schedules"
              onClick={() => {
                setShowScheduleManagementPanel(true);
                setSelectedLeavesToDelete([]);
              }}
              color="#1f2937"
              className="flex-1 sm:flex-none"
            />
            <ActionButton
              icon={<Plus size={16} />}
              text="Add Appointment"
              onClick={handleAddAppointment}
              color="#1f2937"
              className="flex-1 sm:flex-none"
            />
          </div>
        </div>
      </div>

      {/* Desktop Header */}
      <div className="hidden md:flex justify-between items-center">
        <div className="flex items-center gap-4">
          <div
            className="flex items-center justify-center rounded-2xl shadow-lg bg-gray-800 text-white"
            style={{
              width: "60px",
              height: "60px",
              boxShadow: "0 8px 25px rgba(102, 126, 234, 0.3)",
            }}
          >
            <Calendar size={28} color="white" />
          </div>

          <div className="flex flex-col">
            <h1 className="text-2xl font-extrabold text-gray-900 mb-1">
              {title}
            </h1>
            <p className="text-sm font-medium text-gray-600">{subtitle}</p>
          </div>
        </div>

        <div className="flex gap-3">
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
            color="#1f2937"
          />
          <ActionButton
            icon={<Plus size={18} />}
            text="Add Appointment"
            onClick={handleAddAppointment}
            color="#1f2937"
          />
        </div>
      </div>
    </div>
  );
};

export default Header;
