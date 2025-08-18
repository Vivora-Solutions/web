import { Filter } from 'lucide-react';

const ViewPeriodSelector = ({ maxDays, setMaxDays, dayFilters, COLORS }) => {
  return (
    <div className="hidden md:flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <Filter size={18} color={COLORS.text} />
        <h3 className="text-base font-bold" style={{ color: COLORS.text }}>View Period</h3>
      </div>
      <div className="flex gap-2 flex-wrap">
        {dayFilters.map((days) => (
          <button
            key={days}
            onClick={() => setMaxDays(days)}
            className={`px-4 py-3 rounded-lg font-semibold text-sm transition-all duration-300 cursor-pointer`}
            style={{
              background: maxDays === days ? `linear-gradient(135deg, ${COLORS.success}, #38a169)` : COLORS.cardBg,
              border: `2px solid ${maxDays === days ? COLORS.success : COLORS.border}`,
              color: maxDays === days ? 'white' : COLORS.text,
              boxShadow: maxDays === days ? "0 6px 20px rgba(72, 187, 120, 0.3)" : "0 2px 8px rgba(0,0,0,0.1)"
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
