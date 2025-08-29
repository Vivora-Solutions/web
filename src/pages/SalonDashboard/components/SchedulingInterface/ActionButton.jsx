const ActionButton = ({ icon, text, onClick, color }) => {
  return (
    <button
      onClick={onClick}
      className={`px-7 py-3 rounded-xl font-bold text-white cursor-pointer flex items-center gap-2 shadow-lg text-sm transition duration-200`}
      style={{ backgroundColor: color }} // keep dynamic color from props
    >
      {icon}
      {text}
    </button>
  )
}

export default ActionButton
