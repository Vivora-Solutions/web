import { Filter } from 'lucide-react';

const ViewPeriodSelector = ({ maxDays, setMaxDays, dayFilters, COLORS }) => {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <Filter size={18} color={COLORS.text} />
        <h3 style={{ fontSize: "16px", fontWeight: "700", color: COLORS.text, margin: 0 }}>View Period</h3>
      </div>
      <div style={{ display: "flex", gap: "8px" }}>
        {dayFilters.map((days) => (
          <button
            key={days}
            onClick={() => setMaxDays(days)}
            style={{
              padding: "12px 16px",
              background: maxDays === days ? `linear-gradient(135deg, ${COLORS.success}, #38a169)` : COLORS.cardBg,
              border: `2px solid ${maxDays === days ? COLORS.success : COLORS.border}`,
              borderRadius: "12px",
              fontWeight: "600",
              color: maxDays === days ? "white" : COLORS.text,
              cursor: "pointer",
              transition: "all 0.3s ease",
              boxShadow: maxDays === days ? "0 6px 20px rgba(72, 187, 120, 0.3)" : "0 2px 8px rgba(0, 0, 0, 0.1)",
              fontSize: "14px",
            }}
          >
            {days} Day{days !== 1 ? "s" : ""}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ViewPeriodSelector;