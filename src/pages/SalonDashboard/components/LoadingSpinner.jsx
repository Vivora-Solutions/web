const LoadingSpinner = ({ message = "Loading..." }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
      <div className="w-10 h-10 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
      <p className="text-white text-base font-medium">{message}</p>
    </div>
  )
}

export default LoadingSpinner
