import {
  X,
  XCircle,
  CheckCircle2,
  Clock,
  User,
  Phone,
  Calendar,
  MapPin,
  Edit,
  Trash2,
} from "lucide-react";
import { useState, useEffect } from "react";

const AppointmentDetailsPanel = ({
  show,
  onClose,
  appointment,
  COLORS,
  getStylistById,
  getServiceById,
  handleDeleteAppointment,
  handleCompleteAppointment,
  loading,
}) => {
  const [isSmallScreen, setIsSmallScreen] = useState(false);

  // Check screen size on mount and on resize
  useEffect(() => {
    const checkScreenSize = () => {
      setIsSmallScreen(window.innerWidth < 768);
    };
    
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  if (!show || !appointment) return null;

  // Calculate total price
  const totalPrice = appointment.services.reduce((total, serviceId) => {
    const service = getServiceById(serviceId);
    return total + service.price;
  }, 0);

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
        onClick={onClose}
      />

      {/* Panel */}
      <div
        className="fixed right-0 top-20 h-[calc(100vh-80px)] w-full sm:w-[85%] md:w-[450px] z-51 flex flex-col shadow-2xl overflow-hidden"
        style={{ background: COLORS.cardBg }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-4 py-2.5 md:px-5 md:py-3.5 border-b-2 text-white sticky top-0 z-10"
          style={{
            borderBottom: `2px solid ${COLORS.border}`,
            background: `linear-gradient(135deg, ${
              getStylistById(appointment.stylistId).color
            }, ${getStylistById(appointment.stylistId).color}dd)`,
          }}
        >
          <div className="flex-1">
            <h2 className="text-base md:text-lg font-extrabold">
              Appointment Details
            </h2>
            <div className="flex items-center gap-2">
              <p className="text-xs opacity-90 truncate">
                {appointment.clientName}
              </p>
              <div 
                className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-xs font-bold capitalize text-white"
                style={{
                  background:
                    appointment.status === "confirmed"
                      ? COLORS.success
                      : appointment.status === "pending"
                      ? COLORS.warning
                      : appointment.status === "cancelled"
                      ? COLORS.danger
                      : COLORS.info,
                }}
              >
                {appointment.status === "confirmed" && <CheckCircle2 size={10} />}
                {appointment.status === "pending" && <Clock size={10} />}
                {appointment.status === "cancelled" && <XCircle size={10} />}
                {appointment.status}
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center bg-white/20 hover:bg-white/30 transition"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body - compact layout for mobile */}
        <div className="flex-1 py-0 overflow-y-auto pb-20">
          <div className="px-4 py-3 space-y-4">
            {/* Client Info - Compact card */}
            <div className="bg-white/50 p-3 rounded-lg shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <User size={16} color={COLORS.textLight} />
                  <h3 className="text-sm font-bold" style={{ color: COLORS.text }}>
                    Client Information
                  </h3>
                </div>
                {appointment.isWalkIn && (
                  <span
                    className="text-xs px-1.5 py-0.5 rounded-full font-semibold text-white"
                    style={{ background: COLORS.warning }}
                  >
                    Walk-in
                  </span>
                )}
              </div>
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-sm" style={{ color: COLORS.text }}>
                    {appointment.clientName}
                  </span>
                </div>
                {appointment.clientPhone && (
                  <div className="flex items-center gap-2">
                    <Phone size={14} color={COLORS.textLight} />
                    <span className="text-xs" style={{ color: COLORS.text }}>
                      {appointment.clientPhone}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Appointment Info - Compact card */}
            <div className="bg-white/50 p-3 rounded-lg shadow-sm border border-gray-100">
              <div className="flex items-center mb-1.5">
                <Calendar size={16} color={COLORS.textLight} />
                <h3 className="text-sm font-bold ml-2" style={{ color: COLORS.text }}>
                  Appointment Details
                </h3>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <div className="text-xs text-gray-500">Stylist</div>
                  <div className="text-sm font-medium" style={{ color: COLORS.text }}>
                    {getStylistById(appointment.stylistId).name}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-gray-500">Date</div>
                  <div className="text-sm font-medium" style={{ color: COLORS.text }}>
                    {new Date(appointment.date).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-gray-500">Time</div>
                  <div className="text-sm font-medium" style={{ color: COLORS.text }}>
                    {appointment.startTime} - {appointment.endTime}
                  </div>
                </div>
                {appointment.workstation && (
                  <div>
                    <div className="text-xs text-gray-500">Workstation</div>
                    <div className="text-sm font-medium truncate" style={{ color: COLORS.text }}>
                      {appointment.workstation.workstation_name}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Services - Compact card */}
            <div className="bg-white/50 p-3 rounded-lg shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold" style={{ color: COLORS.text }}>
                    Services ({appointment.services.length})
                  </h3>
                </div>
                <span className="font-medium text-sm" style={{ color: COLORS.text }}>
                  Rs. {totalPrice}
                </span>
              </div>
              <div className="space-y-2">
                {appointment.services.map((serviceId) => {
                  const service = getServiceById(serviceId);
                  return (
                    <div
                      key={serviceId}
                      className="flex items-center justify-between p-2 rounded-md"
                      style={{
                        background: "rgba(66,153,225,0.05)",
                        border: "1px solid rgba(66,153,225,0.1)",
                      }}
                    >
                      <div className="flex-1 min-w-0">
                        <div
                          className="font-medium text-sm truncate"
                          style={{ color: COLORS.text }}
                        >
                          {service.name}
                        </div>
                        <div
                          className="text-xs"
                          style={{ color: COLORS.textLight }}
                        >
                          {service.duration} min
                        </div>
                      </div>
                      <div className="text-sm font-medium pl-2" style={{ color: COLORS.text }}>
                        Rs. {service.price}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Notes - Compact card */}
            {appointment.notes && (
              <div className="bg-white/50 p-3 rounded-lg shadow-sm border border-gray-100">
                <h3 className="text-sm font-bold mb-2" style={{ color: COLORS.text }}>
                  Notes
                </h3>
                <div
                  className="p-2 rounded-md text-xs"
                  style={{
                    background: "#f8fafc",
                    border: `1px solid ${COLORS.border}`,
                    color: COLORS.text,
                  }}
                >
                  {appointment.notes}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Fixed Action Buttons */}
        {appointment.status !== "completed" && (
          <div 
            className="absolute bottom-0 left-0 right-0 px-4 py-3 flex gap-3 border-t z-10 shadow-lg"
            style={{ 
              background: COLORS.cardBg,
              borderColor: COLORS.border
            }}
          >
            <button
              onClick={() => handleCompleteAppointment(appointment.id)}
              className="flex-1 rounded-md font-bold flex items-center justify-center gap-2 text-white transition"
              style={{
                background: "#5ece31ff",
                padding: isSmallScreen ? "8px" : "10px",
                fontSize: isSmallScreen ? "12px" : "13px",
              }}
            >
              <Edit size={isSmallScreen ? 14 : 16} />
              {isSmallScreen ? "Complete" : "Complete Appointment"}
            </button>
            <button
              onClick={() => handleDeleteAppointment(appointment.id)}
              disabled={loading}
              className="flex-1 rounded-md font-bold flex items-center justify-center gap-2 text-white transition disabled:cursor-not-allowed"
              style={{
                background: loading
                  ? COLORS.textLight
                  : `linear-gradient(135deg, ${COLORS.danger}, #c53030)`,
                padding: isSmallScreen ? "8px" : "10px",
                fontSize: isSmallScreen ? "12px" : "13px",
              }}
            >
              <Trash2 size={isSmallScreen ? 14 : 16} />
              {loading ? "Cancelling..." : isSmallScreen ? "Cancel" : "Cancel Appointment"}
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default AppointmentDetailsPanel;
