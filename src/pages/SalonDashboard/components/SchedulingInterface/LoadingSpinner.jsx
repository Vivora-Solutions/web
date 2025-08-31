// const LoadingSpinner = ({ COLORS, text = "Loading..." }) => {
//   return (
//     <div
//       style={{
//         display: "flex",
//         flexDirection: "column",
//         alignItems: "center",
//         justifyContent: "center",
//         gap: "20px",
//         minHeight: "400px",
//       }}
//     >
//       <div
//         style={{
//           width: "50px",
//           height: "50px",
//           border: `4px solid ${COLORS.border}`,
//           borderTop: `4px solid ${COLORS.info}`,
//           borderRadius: "50%",
//           animation: "spin 1s linear infinite",
//         }}
//       />
//       <p style={{ fontSize: "16px", fontWeight: "600", color: COLORS.textLight }}>{text}</p>
//     </div>
//   );
// };

// export default LoadingSpinner;

const LoadingSpinner = ({ COLORS, text = "Loading..." }) => {
  return (
    <div className="flex flex-col items-center justify-center gap-5 min-h-[400px]">
      <div
        className="w-12 h-12 border-4 border-t-4 rounded-full animate-spin"
        style={{
          borderColor: COLORS.border,
          borderTopColor: COLORS.info,
        }}
      />
      <p
        className="text-base font-semibold"
        style={{ color: COLORS.textLight }}
      >
        {text}
      </p>
    </div>
  );
};

export default LoadingSpinner;
