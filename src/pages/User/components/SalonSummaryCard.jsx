const SalonSummaryCard = ({
  salon_logo_link,
  salon_name,
  salon_average_rating,
  salon_address,
  serviceNames,
  serviceDurations,
  servicePrices,
}) => {
  const totalDuration = Array.isArray(serviceDurations) ? serviceDurations.reduce((a, b) => a + (b || 0), 0) : 0
  const totalPrice = Array.isArray(servicePrices) ? servicePrices.reduce((a, b) => a + (b || 0), 0) : 0

  return (
    <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6 lg:p-8 space-y-6 sticky top-24">
      <div className="flex items-center gap-4 pb-4 border-b border-gray-100">
        <img
          src={salon_logo_link || "/placeholder.svg?height=64&width=64&query=salon-logo"}
          alt={salon_name || "Salon Logo"}
          className="w-16 h-16 rounded-full object-cover border-2 border-purple-200 shadow-md"
        />
        <div>
          <h2 className="text-xl lg:text-2xl font-bold text-gray-900">{salon_name || "Selected Salon"}</h2>
          <div className="flex items-center gap-2 mt-1">
            <div className="flex text-yellow-400 text-lg">
              {Array.from({ length: 5 }).map((_, i) => (
                <span key={i}>{i < (salon_average_rating || 0) ? "★" : "☆"}</span>
              ))}
            </div>
            <span className="text-sm text-gray-500">({salon_average_rating || 0}/5)</span>
          </div>
          <div className="flex items-center gap-1 mt-1 text-gray-600">
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="text-sm">{salon_address || "No address provided"}</span>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-3">Selected Services</h3>
        <ul className="space-y-2 text-gray-700">
          {Array.isArray(serviceNames) && serviceNames.length > 0 ? (
            serviceNames.map((name, idx) => (
              <li key={idx} className="flex justify-between items-center text-sm">
                <span className="font-medium">{name}</span>
                <span className="text-gray-500">
                  {serviceDurations?.[idx] || 0} min | Rs {servicePrices?.[idx] || 0}
                </span>
              </li>
            ))
          ) : (
            <li className="text-gray-400 italic">No services selected</li>
          )}
        </ul>

        {totalDuration > 0 && totalPrice > 0 && (
          <div className="mt-6 p-4 rounded-xl bg-purple-50 border border-purple-100 flex flex-col gap-3">
            <div className="flex justify-between text-base text-gray-700">
              <span className="font-semibold">Total Duration:</span>
              <span className="font-bold text-purple-700">{totalDuration} min</span>
            </div>
            <div className="flex justify-between text-base text-gray-700">
              <span className="font-semibold">Total Price:</span>
              <span className="font-bold text-pink-700">Rs {totalPrice.toLocaleString()}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default SalonSummaryCard
