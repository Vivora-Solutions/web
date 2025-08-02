"use client"

const SalonCard = ({ salon, index, onSalonClick, onSalonHover }) => {
  return (
    <div
      onClick={() => onSalonClick(salon.salon_id)}
      onMouseEnter={() => onSalonHover && onSalonHover(salon)}
      className="group relative bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer border border-gray-100 hover:border-purple-200 transform hover:-translate-y-1"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-purple-600/5 to-pink-600/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

      <div className="relative flex items-start gap-4">
        <div className="relative flex-shrink-0">
          <img
            src={salon.salon_logo_link || "/placeholder.svg"}
            alt="Salon Logo"
            className="w-16 h-16 lg:w-20 lg:h-20 rounded-2xl object-cover border-2 border-gray-100 group-hover:border-purple-200 transition-all duration-300 shadow-sm"
          />
          <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-gradient-to-r from-green-400 to-emerald-500 border-3 border-white rounded-full flex items-center justify-center">
            <div className="w-2 h-2 bg-white rounded-full"></div>
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-2">
            <h3 className="text-lg lg:text-xl font-bold text-gray-800 group-hover:text-purple-600 transition-colors duration-200 truncate">
              {salon.salon_name}
            </h3>
            <div className="flex-shrink-0 ml-2">
              <svg
                className="w-5 h-5 text-gray-400 group-hover:text-purple-500 transition-colors duration-200"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>

          <div className="flex items-center gap-3 mb-3">
            <div className="flex items-center gap-1">
              <div className="flex text-yellow-400 text-sm">
                {Array.from({ length: 5 }).map((_, i) => (
                  <span key={i} className="transition-transform hover:scale-110">
                    {i < salon.average_rating ? "★" : "☆"}
                  </span>
                ))}
              </div>
              <span className="text-sm text-gray-600 ml-1">({salon.average_rating || 0})</span>
            </div>
            <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-green-600 font-medium">Open</span>
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-sm text-gray-600 flex items-center gap-2">
              <svg
                className="w-4 h-4 text-gray-400 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              <span className="truncate">{salon.salon_address}</span>
            </p>
            <p className="text-sm text-gray-500 flex items-center gap-2">
              <svg
                className="w-4 h-4 text-gray-400 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              8:00 AM - 10:00 PM
            </p>
          </div>

          <div className="mt-4 flex items-center gap-2">
            <div className="bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 px-3 py-1 rounded-full text-xs font-medium">
              Available Today
            </div>
            <div className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-medium">Quick Booking</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SalonCard
