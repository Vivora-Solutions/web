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
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0, 0, 0, 0.5)",
          backdropFilter: "blur(4px)",
          zIndex: 50,
        }}
        onClick={onClose}
      />

      {/* Panel */}
      <div
        style={{
          position: "fixed",
          right: 0,
          top: "60px",
          height: "calc(100vh - 60px)",
          width: window.innerWidth <= 768 ? "90%" : "450px",
          background: COLORS.cardBg,
          boxShadow: "-10px 0 40px rgba(0, 0, 0, 0.2)",
          zIndex: 51,
          overflowY: "auto",
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-6 py-6 border-b-2"
          style={{
            padding: window.innerWidth <= 768 ? "20px 16px" : "28px 32px",
            borderBottom: `2px solid ${COLORS.border}`,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            background: `linear-gradient(135deg, ${
              getStylistById(appointment.stylistId).color
            }, ${getStylistById(appointment.stylistId).color}dd)`,
            color: "white",
          }}
        >
          <div>
            <h2
              style={{
                fontSize: window.innerWidth <= 768 ? "18px" : "22px",
                fontWeight: "800",
                margin: 0,
                marginBottom: "4px",
              }}
            >
              Appointment Details
            </h2>
            <p
              style={{
                fontSize: window.innerWidth <= 768 ? "12px" : "14px",
                opacity: 0.9,
                margin: 0,
              }}
            >
              {appointment.clientName}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full flex items-center justify-center bg-white/20 text-white hover:bg-white/30 transition"
          >
            <X size={22} />
          </button>
        </div>

        {/* Body */}
        <div
          style={{ padding: window.innerWidth <= 768 ? "20px 16px" : "32px" }}
        >
          {/* Status Badge */}
          <div className="text-center">
            <div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full font-bold text-sm capitalize"
              style={{
                background:
                  appointment.status === "confirmed"
                    ? COLORS.success
                    : appointment.status === "pending"
                    ? COLORS.warning
                    : appointment.status === "cancelled"
                    ? COLORS.danger
                    : COLORS.info,
                color: "white",
              }}
            >
              {appointment.status === "confirmed" && <CheckCircle2 size={16} />}
              {appointment.status === "pending" && <Clock size={16} />}
              {appointment.status === "cancelled" && <XCircle size={16} />}
              {appointment.status}
            </div>
          </div>

          {/* Client Information */}
          <div style={{ marginBottom: "24px" }}>
            <h3
              style={{
                fontSize: "18px",
                fontWeight: "700",
                color: COLORS.text,
                marginBottom: "16px",
              }}
            >
              Client Information
            </h3>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "12px" }}
            >
              <div
                style={{ display: "flex", alignItems: "center", gap: "12px" }}
              >
                <User size={18} color={COLORS.textLight} />
                <span style={{ fontWeight: "600", color: COLORS.text }}>
                  {appointment.clientName}
                </span>
                {appointment.isWalkIn && (
                  <span
                    className="text-xs px-2 py-1 rounded-full font-semibold"
                    style={{ background: COLORS.warning, color: "white" }}
                  >
                    Walk-in
                  </span>
                )}
              </div>
              {appointment.clientPhone && (
                <div
                  style={{ display: "flex", alignItems: "center", gap: "12px" }}
                >
                  <Phone size={18} color={COLORS.textLight} />
                  <span style={{ color: COLORS.text }}>
                    {appointment.clientPhone}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Appointment Information */}
          <div style={{ marginBottom: "24px" }}>
            <h3
              style={{
                fontSize: "18px",
                fontWeight: "700",
                color: COLORS.text,
                marginBottom: "16px",
              }}
            >
              Appointment Information
            </h3>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "12px" }}
            >
              <div
                style={{ display: "flex", alignItems: "center", gap: "12px" }}
              >
                <User size={18} color={COLORS.textLight} />
                <span style={{ color: COLORS.text }}>
                  <strong>Stylist:</strong>{" "}
                  {getStylistById(appointment.stylistId).name}
                </span>
              </div>
              <div
                style={{ display: "flex", alignItems: "center", gap: "12px" }}
              >
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
              <div
                style={{ display: "flex", alignItems: "center", gap: "12px" }}
              >
                <Clock size={18} color={COLORS.textLight} />
                <span style={{ color: COLORS.text }}>
                  <strong>Time:</strong> {appointment.startTime} -{" "}
                  {appointment.endTime}
                </span>
              </div>
              {appointment.workstation && (
                <div
                  style={{ display: "flex", alignItems: "center", gap: "12px" }}
                >
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
          <div style={{ marginBottom: "24px" }}>
            <h3
              style={{
                fontSize: "18px",
                fontWeight: "700",
                color: COLORS.text,
                marginBottom: "16px",
              }}
            >
              Services
            </h3>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "8px" }}
            >
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
                      style={{
                        fontWeight: "600",
                        color: COLORS.text,
                        marginBottom: "4px",
                      }}
                    >
                      {service.name}
                    </div>
                    <div
                      className="text-xs"
                      style={{ color: COLORS.textLight }}
                    >
                      {service.duration} minutes • ${service.price}
                    </div>
                  </div>
                );
              })}
            </div>
            <div style={{ marginTop: "12px", textAlign: "right" }}>
              <span
                style={{
                  fontSize: "16px",
                  fontWeight: "700",
                  color: COLORS.text,
                }}
              >
                Total: $
                {appointment.services.reduce((total, serviceId) => {
                  const service = getServiceById(serviceId);
                  return total + service.price;
                }, 0)}
              </span>
            </div>
          </div>

          {/* Notes */}
          {appointment.notes && (
            <div style={{ marginBottom: "24px" }}>
              <h3
                style={{
                  fontSize: "18px",
                  fontWeight: "700",
                  color: COLORS.text,
                  marginBottom: "16px",
                }}
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
            <div
              style={{ display: "flex", flexDirection: "column", gap: "12px" }}
            >
              <button
                onClick={() => handleCompleteAppointment(appointment.id)}
                style={{
                  width: "100%",
                  padding: window.innerWidth <= 768 ? "12px 16px" : "14px 20px",
                  background: `#5ece31ff`,
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  fontWeight: "700",
                  fontSize: window.innerWidth <= 768 ? "14px" : "16px",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                }}
              >
                <Edit size={16} />
                Complete Appointment
              </button>
              <button
                onClick={() => handleDeleteAppointment(appointment.id)}
                disabled={loading}
                className="w-full py-3 rounded-md font-bold flex items-center justify-center gap-2 text-white transition disabled:cursor-not-allowed"
                style={{
                  width: "100%",
                  padding: window.innerWidth <= 768 ? "12px 16px" : "14px 20px",
                  background: loading
                    ? COLORS.textLight
                    : `linear-gradient(135deg, ${COLORS.danger}, #c53030)`,
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  fontWeight: "700",
                  fontSize: window.innerWidth <= 768 ? "14px" : "16px",
                  cursor: loading ? "not-allowed" : "pointer",
                  transition: "all 0.2s ease",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
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
