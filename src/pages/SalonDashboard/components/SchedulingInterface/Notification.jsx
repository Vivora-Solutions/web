import { XCircle, CheckCircle2 } from 'lucide-react';

const Notification = ({ message, type, COLORS }) => {
  if (!message) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: "20px",
        right: "20px",
        background: type === "error" ? COLORS.danger : COLORS.success,
        color: "white",
        padding: "16px 24px",
        borderRadius: "12px",
        boxShadow: "0 8px 25px rgba(0, 0, 0, 0.2)",
        zIndex: 1000,
        display: "flex",
        alignItems: "center",
        gap: "12px",
        fontWeight: "600",
      }}
    >
      {type === "error" ? <XCircle size={20} /> : <CheckCircle2 size={20} />}
      {message}
    </div>
  );
};

export default Notification;