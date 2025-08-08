// "use client"
// import LoadingSpinner from "./LoadingSpinner" // Reusing from previous task or defining here

// const TimeSlotList = ({ timeSlots, loadingSlots, onTimeSlotClick, formatTime }) => {
//   return (
//     <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
//       <h2 className="text-xl font-semibold mb-4 text-gray-800">Available Time Slots</h2>
//       {loadingSlots ? (
//         <LoadingSpinner message="Loading slots..." />
//       ) : timeSlots.length > 0 ? (
//         <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 max-h-60 overflow-y-auto pr-2">
//           {timeSlots.map((slot, index) => (
//             <button
//               key={index}
//               onClick={() => onTimeSlotClick(slot)}
//               className="flex flex-col items-center justify-center border border-purple-100 rounded-xl px-4 py-3 bg-purple-50 hover:bg-purple-100 transition cursor-pointer shadow-sm w-full text-center transform hover:scale-[1.02]"
//             >
//               <span className="font-semibold text-gray-700 text-lg">{formatTime(slot.start)}</span>
//               <span className="text-gray-500 text-xs">to {formatTime(slot.end)}</span>
//             </button>
//           ))}
//         </div>
//       ) : (
//         <p className="text-gray-500 text-center py-8">No slots available for this stylist on selected date.</p>
//       )}
//     </div>
//   )
// }

// export default TimeSlotList
