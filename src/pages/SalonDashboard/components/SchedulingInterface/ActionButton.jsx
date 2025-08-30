const ActionButton = ({ icon, text, onClick, color, className = "" }) => {
  return (
    <button
      onClick={onClick}
      className={`px-3 sm:px-7 py-2 sm:py-3 rounded-xl font-bold text-white cursor-pointer flex items-center justify-center gap-1 sm:gap-2 shadow-lg text-xs sm:text-sm transition duration-200 whitespace-nowrap min-w-0 ${className}`}
      style={{ backgroundColor: color }}
    >
      {icon}
      <span>{text}</span>
    </button>
  );
};

export default ActionButton;
