"use client"
import { 
  User, 
  Phone, 
  Calendar, 
  Clock, 
  MapPin, 
  Edit, 
  Trash2, 
  CheckCircle2, 
  XCircle,
  X
} from "lucide-react"
import { COLORS } from "./colours"

const AppointmentDetailsPanel = ({
  appointment,
  stylists,
  services,
  onComplete,
  onDelete,
  onClose,
  loading
}) => {
  // Helper function to get stylist by ID
  const getStylistById = (id) => {
    return stylists.find(s => s.id === id) || {
      id,
      name: `Stylist ${id}`,
      color: COLORS.stylists[0]
    }
  }

  // Helper function to get service by ID
  const getServiceById = (id) => {
    return services.find(s => s.id === id) || { 
      id, 
      name: "Unknown Service", 
      duration: 30, 
      price: 0 
    }
  }

  return (
    <>
      <div
        style={{
          position: "fixed",
          inset: 0,
          background: COLORS.overlay,
          backdropFilter: "blur(8px)",
          zIndex: 50,
        }}
        onClick={onClose}
      />
      <div
        style={{
          position: "fixed",
          right: 0,
          top: 0,
          height: "100vh",
          width: "450px",
          background: COLORS.cardBg,
          boxShadow: "-10px 0 40px rgba(0, 0, 0, 0.2)",
          zIndex: 51,
          overflowY: "auto",
        }}
      >
        {/* Header */}
        <PanelHeader 
          appointment={appointment} 
          getStylistById={getStylistById}
          onClose={onClose}
        />

        <div style={{ padding: "32px" }}>
          {/* Status Badge */}
          <StatusBadge status={appointment.status} />

          {/* Client Information */}
          <ClientInfoSection 
            clientName={appointment.clientName}
            clientPhone={appointment.clientPhone}
            isWalkIn={appointment.isWalkIn}
          />

          {/* Appointment Information */}
          <AppointmentInfoSection 
            appointment={appointment}
            getStylistById={getStylistById}
          />

          {/* Services */}
          <ServicesSection 
            services={appointment.services}
            getServiceById={getServiceById}
          />

          {/* Notes */}
          {appointment.notes && (
            <NotesSection notes={appointment.notes} />
          )}

          {/* Action Buttons */}
          {appointment.status !== "completed" && (
            <ActionButtons 
              onComplete={onComplete}
              onDelete={onDelete}
              loading={loading}
            />
          )}
        </div>
      </div>
    </>
  )
}

// Sub-components for better organization
const PanelHeader = ({ appointment, getStylistById, onClose }) => (
  <div
    style={{
      padding: "28px 32px",
      borderBottom: `2px solid ${COLORS.border}`,
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      background: `linear-gradient(135deg, ${getStylistById(appointment.stylistId).color}, ${getStylistById(appointment.stylistId).color}dd)`,
      color: "white",
    }}
  >
    <div>
      <h2 style={{ fontSize: "22px", fontWeight: "800", margin: 0, marginBottom: "4px" }}>
        Appointment Details
      </h2>
      <p style={{ fontSize: "14px", opacity: 0.9, margin: 0 }}>{appointment.clientName}</p>
    </div>
    <button
      onClick={onClose}
      style={{
        background: "rgba(255, 255, 255, 0.2)",
        border: "none",
        color: "white",
        fontSize: "24px",
        width: "40px",
        height: "40px",
        borderRadius: "50%",
        cursor: "pointer",
        transition: "all 0.3s ease",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <X size={22} />
    </button>
  </div>
)

const StatusBadge = ({ status }) => {
  const statusConfig = {
    confirmed: { color: COLORS.success, icon: <CheckCircle2 size={16} /> },
    pending: { color: COLORS.warning, icon: <Clock size={16} /> },
    cancelled: { color: COLORS.danger, icon: <XCircle size={16} /> },
    default: { color: COLORS.info, icon: null }
  }

  const config = statusConfig[status] || statusConfig.default

  return (
    <div style={{ marginBottom: "24px", textAlign: "center" }}>
      <div
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "8px",
          padding: "8px 16px",
          borderRadius: "20px",
          fontSize: "14px",
          fontWeight: "700",
          background: config.color,
          color: "white",
          textTransform: "capitalize",
        }}
      >
        {config.icon}
        {status}
      </div>
    </div>
  )
}

const ClientInfoSection = ({ clientName, clientPhone, isWalkIn }) => (
  <div style={{ marginBottom: "24px" }}>
    <h3 style={{ fontSize: "18px", fontWeight: "700", color: COLORS.text, marginBottom: "16px" }}>
      Client Information
    </h3>
    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        <User size={18} color={COLORS.textLight} />
        <span style={{ fontWeight: "600", color: COLORS.text }}>{clientName}</span>
        {isWalkIn && (
          <span
            style={{
              fontSize: "12px",
              padding: "4px 8px",
              background: COLORS.warning,
              color: "white",
              borderRadius: "12px",
              fontWeight: "600",
            }}
          >
            Walk-in
          </span>
        )}
      </div>
      {clientPhone && (
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <Phone size={18} color={COLORS.textLight} />
          <span style={{ color: COLORS.text }}>{clientPhone}</span>
        </div>
      )}
    </div>
  </div>
)

const AppointmentInfoSection = ({ appointment, getStylistById }) => (
  <div style={{ marginBottom: "24px" }}>
    <h3 style={{ fontSize: "18px", fontWeight: "700", color: COLORS.text, marginBottom: "16px" }}>
      Appointment Information
    </h3>
    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        <User size={18} color={COLORS.textLight} />
        <span style={{ color: COLORS.text }}>
          <strong>Stylist:</strong> {getStylistById(appointment.stylistId).name}
        </span>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
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
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        <Clock size={18} color={COLORS.textLight} />
        <span style={{ color: COLORS.text }}>
          <strong>Time:</strong> {appointment.startTime} - {appointment.endTime}
        </span>
      </div>
      {appointment.workstation && (
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <MapPin size={18} color={COLORS.textLight} />
          <span style={{ color: COLORS.text }}>
            <strong>Workstation:</strong> {appointment.workstation.workstation_name}
          </span>
        </div>
      )}
    </div>
  </div>
)

const ServicesSection = ({ services, getServiceById }) => (
  <div style={{ marginBottom: "24px" }}>
    <h3 style={{ fontSize: "18px", fontWeight: "700", color: COLORS.text, marginBottom: "16px" }}>
      Services
    </h3>
    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
      {services.map((serviceId) => {
        const service = getServiceById(serviceId)
        return (
          <div
            key={serviceId}
            style={{
              padding: "12px 16px",
              background: "rgba(66, 153, 225, 0.1)",
              border: "2px solid rgba(66, 153, 225, 0.2)",
              borderRadius: "8px",
            }}
          >
            <div style={{ fontWeight: "600", color: COLORS.text, marginBottom: "4px" }}>
              {service.name}
            </div>
            <div style={{ fontSize: "12px", color: COLORS.textLight }}>
              {service.duration} minutes • ${service.price}
            </div>
          </div>
        )
      })}
    </div>
    <div style={{ marginTop: "12px", textAlign: "right" }}>
      <span style={{ fontSize: "16px", fontWeight: "700", color: COLORS.text }}>
        Total: $
        {services.reduce((total, serviceId) => {
          const service = getServiceById(serviceId)
          return total + service.price
        }, 0)}
      </span>
    </div>
  </div>
)

const NotesSection = ({ notes }) => (
  <div style={{ marginBottom: "24px" }}>
    <h3 style={{ fontSize: "18px", fontWeight: "700", color: COLORS.text, marginBottom: "16px" }}>
      Notes
    </h3>
    <div
      style={{
        padding: "16px",
        background: "#f8fafc",
        border: `2px solid ${COLORS.border}`,
        borderRadius: "8px",
        color: COLORS.text,
        lineHeight: "1.5",
      }}
    >
      {notes}
    </div>
  </div>
)

const ActionButtons = ({ onComplete, onDelete, loading }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
    <button
      onClick={onComplete}
      style={{
        width: "100%",
        padding: "14px 20px",
        background: `#5ece31ff`,
        color: "white",
        border: "none",
        borderRadius: "8px",
        fontWeight: "700",
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
      onClick={onDelete}
      disabled={loading}
      style={{
        width: "100%",
        padding: "14px 20px",
        background: loading ? COLORS.textLight : `linear-gradient(135deg, ${COLORS.danger}, #c53030)`,
        color: "white",
        border: "none",
        borderRadius: "8px",
        fontWeight: "700",
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
)

export default AppointmentDetailsPanel