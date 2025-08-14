const StylistList = ({ stylists, selectedStylistId, onStylistClick, defaultProfilePic }) => {
  return (
    <div className="mb-10 p-4 bg-white rounded-2xl shadow-md border border-gray-100">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">Available Stylists</h2>
      {stylists.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {stylists.map((stylist) => (
            <div
              key={stylist.stylist_id}
              onClick={() => onStylistClick(stylist.stylist_id)}
              className={`group flex flex-col items-center text-center bg-white shadow-md rounded-2xl p-5 hover:shadow-xl transition-all duration-300 cursor-pointer hover:-translate-y-1 border-2 w-full
                ${
                  selectedStylistId === stylist.stylist_id
                    ? "border-purple-500 ring-2 ring-purple-200"
                    : "border-gray-100 hover:border-purple-200"
                }
              `}
            >
              <div className="relative mb-4">
                <img
                  src={stylist.profile_pic_link || defaultProfilePic}
                  alt={stylist.stylist_name || "Stylist"}
                  className="w-20 h-20 rounded-full object-cover border-2 border-gray-200 shadow-sm group-hover:border-purple-300 transition-colors"
                />
                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-400 border-2 border-white rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 group-hover:text-purple-600 transition-colors">
                {stylist.stylist_name || "Unknown Stylist"}
              </h3>
              <span className="text-sm text-gray-500 mt-1">{stylist.specialty || "Stylist"}</span>
              <div className="flex items-center gap-1 mt-2">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <p className="text-sm text-green-600 font-medium">Available</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 text-center py-8">No stylists available for selected services.</p>
      )}
    </div>
  )
}

export default StylistList
