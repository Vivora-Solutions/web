// import { XCircle, CheckCircle2 } from 'lucide-react';

// const Notification = ({ message, type, COLORS }) => {
//   if (!message) return null;

//   return (
//     <div
//       style={{
//         position: "fixed",
//         top: "20px",
//         right: "20px",
//         background: type === "error" ? COLORS.danger : COLORS.success,
//         color: "white",
//         padding: "16px 24px",
//         borderRadius: "12px",
//         boxShadow: "0 8px 25px rgba(0, 0, 0, 0.2)",
//         zIndex: 1000,
//         display: "flex",
//         alignItems: "center",
//         gap: "12px",
//         fontWeight: "600",
//       }}
//     >
//       {type === "error" ? <XCircle size={20} /> : <CheckCircle2 size={20} />}
//       {message}
//     </div>
//   );
// };

// export default Notification;

import { XCircle, CheckCircle2 } from "lucide-react";

const Notification = ({ message, type, COLORS }) => {
  if (!message) return null;

  return (
    <div
      className="fixed top-5 right-5 text-white px-6 py-4 rounded-xl shadow-lg z-[1000] flex items-center gap-3 font-semibold"
      style={{
        background: type === "error" ? COLORS.danger : COLORS.success,
      }}
    >
      {type === "error" ? (
        <XCircle size={20} className="shrink-0" />
      ) : (
        <CheckCircle2 size={20} className="shrink-0" />
      )}
      <span>{message}</span>
    </div>
  );
};

export default Notification;
