const ActionButton = ({ icon, text, onClick, color }) => {
  return (
    <button
      onClick={onClick}
      style={{
        padding: "14px 28px",
        background: `linear-gradient(135deg, ${color}, #38a169)`,
        color: "white",
        border: "none",
        borderRadius: "14px",
        fontWeight: "700",
        cursor: "pointer",
        transition: "all 0.3s ease",
        display: "flex",
        alignItems: "center",
        gap: "10px",
        boxShadow: `0 6px 20px rgba(72, 187, 120, 0.3)`,
        fontSize: "14px",
      }}
    >
      {icon}
      {text}
    </button>
  );
};

export default ActionButton;