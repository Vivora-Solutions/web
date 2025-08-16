const LoadingSpinner = ({ COLORS, text = "Loading..." }) => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "20px",
        minHeight: "400px",
      }}
    >
      <div
        style={{
          width: "50px",
          height: "50px",
          border: `4px solid ${COLORS.border}`,
          borderTop: `4px solid ${COLORS.info}`,
          borderRadius: "50%",
          animation: "spin 1s linear infinite",
        }}
      />
      <p style={{ fontSize: "16px", fontWeight: "600", color: COLORS.textLight }}>{text}</p>
    </div>
  );
};

export default LoadingSpinner;