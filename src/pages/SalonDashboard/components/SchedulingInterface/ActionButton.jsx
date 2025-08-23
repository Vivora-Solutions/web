const ActionButton = ({ icon, text, onClick, color }) => {
  return (
    <button
      onClick={onClick}
      style={{
        padding: "14px 28px",
        background: color, // solid background
        color: "white",
        border: "none",
        borderRadius: "14px",
        fontWeight: "700",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        gap: "10px",
        boxShadow: "0 6px 20px rgba(0, 0, 0, 0.25)", // neutral shadow
        fontSize: "14px",
      }}
    >
      {icon}
      {text}
    </button>
  );
};

export default ActionButton;
