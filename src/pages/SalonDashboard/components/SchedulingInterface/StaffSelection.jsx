// import { Users } from "lucide-react";
// import { COLORS } from "./utils/colors";

// const StaffSelection = ({
//   stylists,
//   selectedStylists,
//   setSelectedStylists,
//   handleStylistToggle,
// }) => {
//   const handleSelectAllStylists = () => {
//     const allStylistIds = stylists.filter((s) => s.isActive).map((s) => s.id);
//     if (selectedStylists.length === allStylistIds.length) {
//       setSelectedStylists([]);
//     } else {
//       setSelectedStylists(allStylistIds);
//     }
//   };

//   return (
//     <div
//       style={{
//         display: "flex",
//         flexDirection: "column",
//         gap: "12px",
//         flex: 1,
//         minWidth: "300px",
//       }}
//     >
//       <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
//         <Users size={18} color={COLORS.text} />
//         <h3
//           style={{
//             fontSize: "16px",
//             fontWeight: "700",
//             color: COLORS.text,
//             margin: 0,
//           }}
//         >
//           Staff (
//           {selectedStylists.length}/{stylists.filter((s) => s.isActive).length})
//         </h3>
//         <button
//           onClick={handleSelectAllStylists}
//           style={{
//             padding: "6px 12px",
//             background: COLORS.info,
//             color: "white",
//             border: "none",
//             borderRadius: "8px",
//             fontSize: "12px",
//             fontWeight: "600",
//             cursor: "pointer",
//             transition: "all 0.3s ease",
//           }}
//         >
//           {selectedStylists.length ===
//           stylists.filter((s) => s.isActive).length
//             ? "Deselect All"
//             : "Select All"}
//         </button>
//       </div>

//       <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
//         {stylists
//           .filter((s) => s.isActive)
//           .map((stylist) => (
//             <div
//               key={stylist.id}
//               onClick={() => handleStylistToggle(stylist.id)}
//               style={{
//                 padding: "8px 12px",
//                 borderRadius: "20px",
//                 fontSize: "12px",
//                 fontWeight: "700",
//                 color: selectedStylists.includes(stylist.id)
//                   ? "white"
//                   : stylist.color,
//                 backgroundColor: selectedStylists.includes(stylist.id)
//                   ? stylist.color
//                   : "rgba(255, 255, 255, 0.8)",
//                 border: `2px solid ${stylist.color}`,
//                 textShadow: selectedStylists.includes(stylist.id)
//                   ? "0 1px 3px rgba(0, 0, 0, 0.3)"
//                   : "none",
//                 boxShadow: selectedStylists.includes(stylist.id)
//                   ? "0 3px 10px rgba(0, 0, 0, 0.2)"
//                   : "0 2px 6px rgba(0, 0, 0, 0.1)",
//                 cursor: "pointer",
//                 transition: "all 0.3s ease",
//                 transform: selectedStylists.includes(stylist.id)
//                   ? "translateY(-1px)"
//                   : "none",
//               }}
//             >
//               {stylist.name.split(" ")[0]}
//             </div>
//           ))}
//       </div>
//     </div>
//   );
// };

// export default StaffSelection;


import { Users } from "lucide-react";
import { COLORS } from "./utils/colors";

const StaffSelection = ({
  stylists,
  selectedStylists,
  setSelectedStylists,
  handleStylistToggle,
}) => {
  const handleSelectAllStylists = () => {
    const allStylistIds = stylists.filter((s) => s.isActive).map((s) => s.id);
    if (selectedStylists.length === allStylistIds.length) {
      setSelectedStylists([]);
    } else {
      setSelectedStylists(allStylistIds);
    }
  };

  return (
    <div className="flex flex-col gap-3 flex-1 min-w-[300px]">
      {/* Header */}
      <div className="flex items-center gap-2">
        <Users size={18} color={COLORS.text} />
        <h3
          className="text-base font-bold m-0"
          style={{ color: COLORS.text }}
        >
          Staff ({selectedStylists.length}/
          {stylists.filter((s) => s.isActive).length})
        </h3>
        <button
          onClick={handleSelectAllStylists}
          className="px-3 py-1 rounded-lg text-white text-xs font-semibold cursor-pointer transition-all duration-300"
          style={{ background: COLORS.info }}
        >
          {selectedStylists.length ===
          stylists.filter((s) => s.isActive).length
            ? "Deselect All"
            : "Select All"}
        </button>
      </div>

      {/* Stylist Pills */}
      <div className="flex flex-wrap gap-2">
        {stylists
          .filter((s) => s.isActive)
          .map((stylist) => {
            const isSelected = selectedStylists.includes(stylist.id);
            return (
              <div
                key={stylist.id}
                onClick={() => handleStylistToggle(stylist.id)}
                className="px-3 py-2 rounded-full text-xs font-bold cursor-pointer transition-all duration-300"
                style={{
                  color: isSelected ? "white" : stylist.color,
                  backgroundColor: isSelected
                    ? stylist.color
                    : "rgba(255, 255, 255, 0.8)",
                  border: `2px solid ${stylist.color}`,
                  textShadow: isSelected
                    ? "0 1px 3px rgba(0, 0, 0, 0.3)"
                    : "none",
                  boxShadow: isSelected
                    ? "0 3px 10px rgba(0, 0, 0, 0.2)"
                    : "0 2px 6px rgba(0, 0, 0, 0.1)",
                  transform: isSelected ? "translateY(-1px)" : "none",
                }}
              >
                {stylist.name.split(" ")[0]}
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default StaffSelection;
