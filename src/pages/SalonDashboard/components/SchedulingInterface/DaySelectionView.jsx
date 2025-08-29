// import { Plane, CheckCircle } from 'lucide-react';

// const DaySelectionView = ({
//   weekDates,
//   isDaySelected,
//   handleDayClick,
//   COLORS,
//   selectedLeaveDays = []
// }) => {
//   return (
//     <div style={{ padding: "24px" }}>
//       <div
//         style={{
//           background: COLORS.cardBg,
//           borderRadius: "20px",
//           boxShadow: "0 10px 40px rgba(0, 0, 0, 0.1)",
//           overflow: "hidden",
//         }}
//       >
//         {/* Header */}
//         <div
//           style={{
//             background: `linear-gradient(135deg, ${COLORS.leave}, #c53030)`,
//             color: "white",
//             padding: "24px 32px",
//             textAlign: "center",
//           }}
//         >
//           <div
//             style={{
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "center",
//               gap: "12px",
//               marginBottom: "8px",
//             }}
//           >
//             <Plane size={24} />
//             <h2 style={{ fontSize: "24px", fontWeight: "700", margin: 0 }}>Select Leave Days</h2>
//           </div>
//           <p style={{ fontSize: "16px", opacity: 0.9, margin: 0 }}>Click on days to mark them for leave</p>
//         </div>

//         {/* Calendar Grid */}
//         <div style={{ padding: "32px" }}>
//           <div
//             style={{
//               display: "grid",
//               gridTemplateColumns: `repeat(${Math.min(weekDates.length, 4)}, 1fr)`,
//               gap: "16px",
//               maxWidth: "800px",
//               margin: "0 auto",
//             }}
//           >
//             {weekDates.map((date, index) => {
//               const isSelected = isDaySelected(date);
//               const isToday = date.toDateString() === new Date().toDateString();
//               return (
//                 <div
//                   key={index}
//                   onClick={() => handleDayClick(date)}
//                   style={{
//                     background: isSelected
//                       ? `linear-gradient(135deg, ${COLORS.leave}, #c53030)`
//                       : isToday
//                       ? `linear-gradient(135deg, ${COLORS.info}, #3182ce)`
//                       : "white",
//                     border: `3px solid ${isSelected ? COLORS.leave : isToday ? COLORS.info : COLORS.border}`,
//                     borderRadius: "16px",
//                     padding: "24px 16px",
//                     textAlign: "center",
//                     cursor: "pointer",
//                     transition: "all 0.3s ease",
//                     boxShadow: isSelected
//                       ? "0 8px 25px rgba(239, 68, 68, 0.3)"
//                       : isToday
//                       ? "0 8px 25px rgba(66, 153, 225, 0.3)"
//                       : "0 4px 15px rgba(0, 0, 0, 0.1)",
//                     transform: isSelected ? "translateY(-4px)" : "none",
//                     color: isSelected || isToday ? "white" : COLORS.text,
//                   }}
//                 >
//                   <div style={{ fontSize: "14px", fontWeight: "600", marginBottom: "8px", opacity: 0.8 }}>
//                     {date.toLocaleDateString("en-US", { weekday: "short" }).toUpperCase()}
//                   </div>
//                   <div style={{ fontSize: "32px", fontWeight: "700", marginBottom: "4px" }}>{date.getDate()}</div>
//                   <div style={{ fontSize: "12px", fontWeight: "500", opacity: 0.8 }}>
//                     {date.toLocaleDateString("en-US", { month: "short" })}
//                   </div>
//                   {isSelected && (
//                     <div style={{ marginTop: "12px" }}>
//                       <CheckCircle size={20} />
//                     </div>
//                   )}
//                 </div>
//               );
//             })}
//           </div>

//           {/* Selection Summary */}
//           {selectedLeaveDays.length > 0 && (
//             <div
//               style={{
//                 marginTop: "32px",
//                 padding: "20px",
//                 background: "rgba(239, 68, 68, 0.1)",
//                 border: "2px solid rgba(239, 68, 68, 0.2)",
//                 borderRadius: "12px",
//                 textAlign: "center",
//                 maxWidth: "400px",
//                 margin: "32px auto 0",
//               }}
//             >
//               <h3 style={{ color: COLORS.leave, fontSize: "18px", fontWeight: "600", marginBottom: "8px" }}>
//                 {selectedLeaveDays.length} Day{selectedLeaveDays.length !== 1 ? "s" : ""} Selected
//               </h3>
//               <p style={{ color: "#c53030", fontSize: "14px", margin: 0 }}>
//                 These days will be marked as leave for all selected staff members
//               </p>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default DaySelectionView;

import { Plane, CheckCircle } from "lucide-react";

const DaySelectionView = ({
  weekDates,
  isDaySelected,
  handleDayClick,
  COLORS,
  selectedLeaveDays = [],
}) => {
  return (
    <div className="p-6">
      <div
        className="rounded-2xl shadow-2xl overflow-hidden"
        style={{ background: COLORS.cardBg }}
      >
        {/* Header */}
        <div
          className="px-8 py-6 text-center text-white"
          style={{
            background: `linear-gradient(135deg, ${COLORS.leave}, #c53030)`,
          }}
        >
          <div className="flex items-center justify-center gap-3 mb-2">
            <Plane size={24} />
            <h2 className="text-2xl font-bold">Select Leave Days</h2>
          </div>
          <p className="text-base opacity-90">
            Click on days to mark them for leave
          </p>
        </div>

        {/* Calendar Grid */}
        <div className="p-8">
          <div
            className={`grid gap-4 max-w-3xl mx-auto`}
            style={{
              gridTemplateColumns: `repeat(${Math.min(
                weekDates.length,
                4
              )}, 1fr)`,
            }}
          >
            {weekDates.map((date, index) => {
              const isSelected = isDaySelected(date);
              const isToday = date.toDateString() === new Date().toDateString();

              return (
                <div
                  key={index}
                  onClick={() => handleDayClick(date)}
                  className={`rounded-xl p-6 text-center cursor-pointer transition-all duration-300 ${
                    isSelected
                      ? "transform -translate-y-1 text-white"
                      : isToday
                      ? "text-white"
                      : "text-gray-700"
                  }`}
                  style={{
                    background: isSelected
                      ? `linear-gradient(135deg, ${COLORS.leave}, #c53030)`
                      : isToday
                      ? `linear-gradient(135deg, ${COLORS.info}, #3182ce)`
                      : "white",
                    border: `3px solid ${
                      isSelected
                        ? COLORS.leave
                        : isToday
                        ? COLORS.info
                        : COLORS.border
                    }`,
                    boxShadow: isSelected
                      ? "0 8px 25px rgba(239, 68, 68, 0.3)"
                      : isToday
                      ? "0 8px 25px rgba(66, 153, 225, 0.3)"
                      : "0 4px 15px rgba(0, 0, 0, 0.1)",
                  }}
                >
                  <div className="text-sm font-semibold mb-2 opacity-80">
                    {date
                      .toLocaleDateString("en-US", { weekday: "short" })
                      .toUpperCase()}
                  </div>
                  <div className="text-3xl font-bold mb-1">
                    {date.getDate()}
                  </div>
                  <div className="text-xs font-medium opacity-80">
                    {date.toLocaleDateString("en-US", { month: "short" })}
                  </div>
                  {isSelected && (
                    <div className="mt-3 flex justify-center">
                      <CheckCircle size={20} />
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Selection Summary */}
          {selectedLeaveDays.length > 0 && (
            <div className="mt-8 p-5 rounded-xl border-2 text-center max-w-md mx-auto bg-red-50 border-red-200">
              <h3
                className="text-lg font-semibold mb-2"
                style={{ color: COLORS.leave }}
              >
                {selectedLeaveDays.length} Day
                {selectedLeaveDays.length !== 1 ? "s" : ""} Selected
              </h3>
              <p className="text-sm text-red-700">
                These days will be marked as leave for all selected staff
                members
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DaySelectionView;
