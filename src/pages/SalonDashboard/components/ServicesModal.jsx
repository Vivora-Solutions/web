


import { X } from "lucide-react"

const ServicesModal = ({
  showServicesModal,
  selectedStylist,
  services,
  stylistServices,
  loading,
  onClose,
  onServiceToggle,
  onUpdateServices,
}) => {
  if (!showServicesModal || !selectedStylist) return null

  const handleClose = () => {
    onClose()
  }

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
        onClick={handleClose}
      />

      {/* Responsive Drawer */}
      <div className="fixed right-0 top-0 h-screen w-full sm:w-[400px] bg-white shadow-2xl z-50 animate-slide-in flex flex-col">
        {/* Header */}
        <div className="p-4 sm:p-6 border-b-2 border-gray-200 bg-gradient-to-r from-indigo-500 to-purple-600 text-white flex justify-between items-center">
          <h2 className="text-lg sm:text-xl font-bold leading-snug">
            Services for {selectedStylist.stylist_name}
          </h2>
          <button
            onClick={handleClose}
            className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-all"
          >
            <X size={20} />
          </button>
        </div>

        {/* Scrollable services list */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          <div className="border-2 border-gray-200 rounded-lg divide-y divide-gray-100">
            {services.map((service) => (
              <div
                key={service.service_id}
                className="flex items-center justify-between p-3 sm:p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-3 flex-1">
                  <input
                    type="checkbox"
                    id={`service-${service.service_id}`}
                    checked={stylistServices.includes(service.service_id)}
                    onChange={() => onServiceToggle(service.service_id)}
                    className="w-4 h-4 accent-blue-500"
                  />
                  <label
                    htmlFor={`service-${service.service_id}`}
                    className="flex flex-col gap-0.5 cursor-pointer"
                  >
                    <span className="font-medium text-gray-800 text-sm sm:text-base">
                      {service.service_name}
                    </span>
                    <span className="text-xs text-gray-500">
                      {service.duration_minutes} min
                    </span>
                  </label>
                </div>
                <span className="font-semibold text-green-600 text-sm sm:text-base">
                  ${service.price}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Sticky Footer */}
        <div className="p-4 sm:p-6 border-t border-gray-200 bg-white">
          <button
            onClick={onUpdateServices}
            disabled={loading}
            className="w-full py-3 sm:py-4 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-xl font-semibold shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none text-sm sm:text-base"
          >
            {loading ? "Updating..." : "Update Services"}
          </button>
        </div>
      </div>
    </>
  )
}

export default ServicesModal
