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
  if (!show || !appointment) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
        onClick={onClose}
      />

      {/* Panel */}
      <div
        className="fixed right-0 top-[60px] h-[calc(100vh-60px)] w-[90%] md:w-[450px] z-51 flex flex-col shadow-2xl"
        style={{ background: COLORS.cardBg }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-4 md:px-8 py-4 md:py-6 border-b-2 text-white"
          style={{
            borderBottom: `2px solid ${COLORS.border}`,
            background: `linear-gradient(135deg, ${
              getStylistById(appointment.stylistId).color
            }, ${getStylistById(appointment.stylistId).color}dd)`,
          }}
        >
          <div>
            <h2 className="text-lg md:text-xl font-extrabold mb-1">
              Appointment Details
            </h2>
            <p className="text-xs md:text-sm opacity-90">
              {appointment.clientName}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full flex items-center justify-center bg-white/20 hover:bg-white/30 transition"
          >
            <X size={22} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-4 md:px-8 py-5 space-y-6">
          {/* Status Badge */}
          <div className="text-center">
            <div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full font-bold text-sm capitalize text-white"
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
              {appointment.status === "confirmed" && <CheckCircle2 size={16} />}
              {appointment.status === "pending" && <Clock size={16} />}
              {appointment.status === "cancelled" && <XCircle size={16} />}
              {appointment.status}
            </div>
          </div>

          {/* Client Info */}
          <div>
            <h3
              className="text-lg font-bold mb-4"
              style={{ color: COLORS.text }}
            >
              Client Information
            </h3>
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <User size={18} color={COLORS.textLight} />
                <span className="font-semibold" style={{ color: COLORS.text }}>
                  {appointment.clientName}
                </span>
                {appointment.isWalkIn && (
                  <span
                    className="text-xs px-2 py-1 rounded-full font-semibold text-white"
                    style={{ background: COLORS.warning }}
                  >
                    Walk-in
                  </span>
                )}
              </div>
              {appointment.clientPhone && (
                <div className="flex items-center gap-3">
                  <Phone size={18} color={COLORS.textLight} />
                  <span style={{ color: COLORS.text }}>
                    {appointment.clientPhone}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Appointment Info */}
          <div>
            <h3
              className="text-lg font-bold mb-4"
              style={{ color: COLORS.text }}
            >
              Appointment Information
            </h3>
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <User size={18} color={COLORS.textLight} />
                <span style={{ color: COLORS.text }}>
                  <strong>Stylist:</strong>{" "}
                  {getStylistById(appointment.stylistId).name}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Calendar size={18} color={COLORS.textLight} />
                <span style={{ color: COLORS.text }}>
                  <strong>Date:</strong>{" "}
                  {new Date(appointment.date).toLocaleDateString("en-US", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Clock size={18} color={COLORS.textLight} />
                <span style={{ color: COLORS.text }}>
                  <strong>Time:</strong> {appointment.startTime} -{" "}
                  {appointment.endTime}
                </span>
              </div>
              {appointment.workstation && (
                <div className="flex items-center gap-3">
                  <MapPin size={18} color={COLORS.textLight} />
                  <span style={{ color: COLORS.text }}>
                    <strong>Workstation:</strong>{" "}
                    {appointment.workstation.workstation_name}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Services */}
          <div>
            <h3
              className="text-lg font-bold mb-4"
              style={{ color: COLORS.text }}
            >
              Services
            </h3>
            <div className="flex flex-col gap-2">
              {appointment.services.map((serviceId) => {
                const service = getServiceById(serviceId);
                return (
                  <div
                    key={serviceId}
                    className="p-3 rounded-md border-2"
                    style={{
                      background: "rgba(66,153,225,0.1)",
                      borderColor: "rgba(66,153,225,0.2)",
                    }}
                  >
                    <div
                      className="font-semibold mb-1"
                      style={{ color: COLORS.text }}
                    >
                      {service.name}
                    </div>
                    <div
                      className="text-xs"
                      style={{ color: COLORS.textLight }}
                    >
                      {service.duration} minutes • Rs. {service.price}
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="mt-3 text-right">
              <span
                className="text-base font-bold"
                style={{ color: COLORS.text }}
              >
                Total: Rs.{" "}
                {appointment.services.reduce((total, serviceId) => {
                  const service = getServiceById(serviceId);
                  return total + service.price;
                }, 0)}
              </span>
            </div>
          </div>

          {/* Notes */}
          {appointment.notes && (
            <div>
              <h3
                className="text-lg font-bold mb-4"
                style={{ color: COLORS.text }}
              >
                Notes
              </h3>
              <div
                className="p-4 rounded-md"
                style={{
                  background: "#f8fafc",
                  border: `2px solid ${COLORS.border}`,
                  color: COLORS.text,
                }}
              >
                {appointment.notes}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          {appointment.status !== "completed" && (
            <div className="flex flex-col gap-3">
              <button
                onClick={() => handleCompleteAppointment(appointment.id)}
                className="w-full rounded-md font-bold flex items-center justify-center gap-2 text-white transition"
                style={{
                  background: "#5ece31ff",
                  padding: "12px 16px",
                  fontSize: "14px",
                }}
              >
                <Edit size={16} />
                Complete Appointment
              </button>
              <button
                onClick={() => handleDeleteAppointment(appointment.id)}
                disabled={loading}
                className="w-full rounded-md font-bold flex items-center justify-center gap-2 text-white transition disabled:cursor-not-allowed"
                style={{
                  background: loading
                    ? COLORS.textLight
                    : `linear-gradient(135deg, ${COLORS.danger}, #c53030)`,
                  padding: "12px 16px",
                  fontSize: "14px",
                }}
              >
                <Trash2 size={16} />
                {loading ? "Cancelling..." : "Cancel Appointment"}
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default AppointmentDetailsPanel;
