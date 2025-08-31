import { X, Upload } from "lucide-react";
import { useState } from "react";
import supabase from "../../../utils/supabaseClient";

const AddServiceModal = ({
  showModal,
  formData,
  setFormData,
  loading,
  isEditing,
  onClose,
  onSubmit,
  onReset,
}) => {
  const [uploading, setUploading] = useState(false);

  const DURATION_OPTIONS = Array.from({ length: 16 }, (_, i) => (i + 1) * 15);

  if (!showModal) return null;

  const handleClose = () => {
    onClose();
    onReset();
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Service image upload
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please select an image file");
      return;
    }

    setUploading(true);

    try {
      const fileName = `service-${Date.now()}-${file.name}`;
      const { error } = await supabase.storage
        .from("salon-images")
        .upload(fileName, file);

      if (error) throw error;

      const { data: urlData } = supabase.storage
        .from("salon-images")
        .getPublicUrl(fileName);

      setFormData((prev) => ({
        ...prev,
        service_image_link: urlData.publicUrl,
      }));

      alert("Service image uploaded successfully!");
    } catch (error) {
      console.error("Error uploading service image:", error);
      alert("Failed to upload service image");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = () => {
    if (!formData.service_name.trim()) {
      alert("Service name is required");
      return;
    }
    if (!formData.service_description.trim()) {
      alert("Service description is required");
      return;
    }
    if (formData.price <= 0) {
      alert("Please enter a valid price");
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
            {isEditing ? "Edit Service" : "Add New Service"}
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
          {/* Service Name */}
          <div>
            <label className="block font-semibold text-gray-700 mb-1 text-sm">
              Service Name
            </label>
            <input
              type="text"
              name="service_name"
              placeholder="Enter service name"
              value={formData.service_name}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg text-sm focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          {/* Service Description */}
          <div>
            <label className="block font-semibold text-gray-700 mb-1 text-sm">
              Description
            </label>
            <textarea
              name="service_description"
              placeholder="Enter service description"
              value={formData.service_description}
              onChange={handleInputChange}
              rows={3}
              required
              className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg text-sm focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          {/* Price */}
          <div>
            <label className="block font-semibold text-gray-700 mb-1 text-sm">
              Price (Rs.)
            </label>
            <input
              type="number"
              name="price"
              placeholder="Enter price"
              value={formData.price}
              onChange={handleInputChange}
              min="0"
              required
              className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg text-sm focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          {/* Duration */}
          <div>
            <label className="block font-semibold text-gray-700 mb-1 text-sm">
              Duration
            </label>
            <select
              name="duration_minutes"
              value={formData.duration_minutes}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg text-sm focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
            >
              {DURATION_OPTIONS.map((min) => (
                <option key={min} value={min}>
                  {min} minutes
                </option>
              ))}
            </select>
          </div>

          {/* Category */}
          <div>
            <label className="block font-semibold text-gray-700 mb-1 text-sm">
              Category
            </label>
            <select
              name="service_category"
              value={formData.service_category}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg text-sm focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
            >
              <option value="unisex">Unisex</option>
              <option value="men">Men</option>
              <option value="women">Women</option>
            </select>
          </div>

          {/* Service Image */}
          <div>
            <label className="block font-semibold text-gray-700 mb-1 text-sm">
              Service Image
            </label>

            {formData.service_image_link && (
              <div className="mb-3 flex justify-center">
                <img
                  src={formData.service_image_link}
                  alt="Service Preview"
                  className="w-20 h-20 object-cover rounded-lg border-2 border-gray-200"
                />
              </div>
            )}

            <div className="flex gap-2 mb-2">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                id="service-image-upload"
                disabled={uploading || loading}
              />
              <label
                htmlFor="service-image-upload"
                className={`px-3 py-2 text-sm rounded border cursor-pointer transition flex items-center gap-2 w-full justify-center sm:w-auto ${
                  uploading || loading
                    ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
                    : "bg-blue-50 text-blue-600 border-blue-200 hover:bg-blue-100"
                }`}
              >
                {uploading ? (
                  <>
                    <div className="animate-spin h-4 w-4 border-2 border-blue-600 border-t-transparent rounded-full"></div>
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload size={16} />
                    Upload Image
                  </>
                )}
              </label>
            </div>
            <p className="text-xs text-gray-500 text-center sm:text-left">
              Optional: Add an image to showcase your service
            </p>
          </div>

          {/* Options */}
          <div className="space-y-3">
            <label className="block font-semibold text-gray-700 text-sm">
              Service Options
            </label>
            
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <input
                type="checkbox"
                name="is_available"
                checked={formData.is_available}
                onChange={handleInputChange}
                className="w-4 h-4 accent-blue-500"
                id="is_available"
              />
              <label htmlFor="is_available" className="text-sm text-gray-700 cursor-pointer">
                Service is currently available for booking
              </label>
            </div>

            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <input
                type="checkbox"
                name="show_price"
                checked={formData.show_price}
                onChange={handleInputChange}
                className="w-4 h-4 accent-blue-500"
                id="show_price"
              />
              <label htmlFor="show_price" className="text-sm text-gray-700 cursor-pointer">
                Display price to customers
              </label>
            </div>
          </div>
        </div>

        {/* Footer Button (sticky) */}
        <div className="p-4 sm:p-6 border-t border-gray-100 sticky bottom-0 bg-white">
          <button
            onClick={handleSubmit}
            disabled={loading || uploading}
            className="w-full py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-xl font-semibold shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all disabled:opacity-60 disabled:cursor-not-allowed text-sm sm:text-base"
          >
            {loading 
              ? (isEditing ? "Updating..." : "Adding...") 
              : uploading 
                ? "Uploading..." 
                : (isEditing ? "Update Service" : "Add Service")
            }
          </button>
        </div>
      </div>
    </>
  );
};

export default AddServiceModal;
