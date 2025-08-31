import { X, CheckCircle, Circle } from "lucide-react";

const AddWorkstationModal = ({
  showAddForm,
  formData,
  setFormData,
  services,
  selectedServices,
  setSelectedServices,
  loading,
  onClose,
  onSubmit,
  onReset,
}) => {
  if (!showAddForm) return null;

  const handleClose = () => {
    onClose();
    onReset();
  };

  const handleServiceToggle = (serviceId) => {
    setSelectedServices((prev) =>
      prev.includes(serviceId)
        ? prev.filter((id) => id !== serviceId)
        : [...prev, serviceId]
    );
  };

  const handleSubmit = () => {
    if (!formData.workstation_name.trim()) {
      alert("Workstation name is required");
      return;
    }
    onSubmit();
  };

  return (
    <>
      {/* Background overlay */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
        onClick={handleClose}
      />

      {/* Responsive Modal */}
      <div className="fixed inset-y-0 right-0 w-full sm:w-[400px] bg-white shadow-2xl z-50 flex flex-col h-screen animate-slide-in">
        {/* Header (sticky) */}
        <div className="p-4 sm:p-6 border-b border-gray-200 bg-gradient-to-r from-indigo-500 to-purple-600 text-white flex justify-between items-center sticky top-0">
          <h2 className="text-base sm:text-lg md:text-xl font-bold">
            Add New Workstation
          </h2>
          <button
            onClick={handleClose}
            className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-all"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form (scrollable area) */}
        <div className="p-4 sm:p-6 flex-1 overflow-y-auto space-y-5">
          {/* Workstation Name */}
          <div>
            <label className="block font-semibold text-gray-700 mb-1 text-sm">
              Workstation Name
            </label>
            <input
              type="text"
              placeholder="Enter workstation name"
              value={formData.workstation_name}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  workstation_name: e.target.value,
                }))
              }
              required
              className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg text-sm focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          {/* Services Selection */}
          <div>
            <label className="block font-semibold text-gray-700 mb-3 text-sm">
              Available Services ({selectedServices.length} selected)
            </label>
            <div className="border-2 border-gray-200 rounded-lg divide-y divide-gray-100 max-h-80 overflow-y-auto">
              {services.map((service) => (
                <div
                  key={service.service_id}
                  className="flex items-center justify-between p-3 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-3 flex-1">
                    <button
                      type="button"
                      onClick={() => handleServiceToggle(service.service_id)}
                      className="text-emerald-500"
                    >
                      {selectedServices.includes(service.service_id) ? (
                        <CheckCircle size={20} />
                      ) : (
                        <Circle size={20} />
                      )}
                    </button>
                    <div className="flex flex-col gap-0.5">
                      <span className="font-medium text-gray-800 text-sm">
                        {service.service_name}
                      </span>
                      <span className="text-xs text-gray-500">
                        {service.duration_minutes} min
                      </span>
                    </div>
                  </div>
                  <span className="font-semibold text-green-600 text-sm">
                    Rs. {service.price}
                  </span>
                </div>
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Select services available at this workstation. You can modify
              these later if needed.
            </p>
          </div>
        </div>

        {/* Footer Button (sticky) */}
        <div className="p-4 sm:p-6 border-t border-gray-100 sticky bottom-0 bg-white">
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-xl font-semibold shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all disabled:opacity-60 disabled:cursor-not-allowed text-sm sm:text-base"
          >
            {loading
              ? "Adding..."
              : selectedServices.length > 0
              ? `Add Workstation with ${selectedServices.length} Services`
              : "Add Workstation"}
          </button>
        </div>
      </div>
    </>
  );
};

export default AddWorkstationModal;
