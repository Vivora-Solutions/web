const LoadingSpinner = () => (
  <div className="flex items-center justify-center h-64">
    <div className="relative">
      <div className="w-12 h-12 rounded-full border-4 border-purple-200"></div>
      <div className="w-12 h-12 rounded-full border-4 border-purple-600 border-t-transparent animate-spin absolute top-0 left-0"></div>
    </div>
  </div>
)

export default LoadingSpinner
