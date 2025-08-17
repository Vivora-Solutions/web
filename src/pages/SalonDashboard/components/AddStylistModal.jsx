import { X } from "lucide-react";
import { useState } from "react";
import supabase from "../../../utils/supabaseClient";

const AddStylistModal = ({
  showAddForm,
  formData,
  setFormData,
  loading,
  onClose,
  onSubmit,
  onReset,
}) => {
  const [uploading, setUploading] = useState(false);

  if (!showAddForm) return null;

  const handleClose = () => {
    onClose();
    onReset();
  };

  // Add profile picture upload handler
  const handleProfilePicUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please select an image file");
      return;
    }

    setUploading(true);

    try {
      const fileName = `profile-${Date.now()}-${file.name}`;

      // Upload to Supabase bucket
      const { data, error } = await supabase.storage
        .from("salon-images")
        .upload(fileName, file);

      if (error) throw error;

      // Get public URL
      const { data: urlData } = supabase.storage
        .from("salon-images")
        .getPublicUrl(fileName);

      const imageUrl = urlData.publicUrl;

      // Update form data with new profile picture URL
      setFormData((prev) => ({
        ...prev,
        profile_pic_link: imageUrl,
      }));

      alert("Profile picture uploaded successfully!");
    } catch (error) {
      console.error("Error uploading profile picture:", error);
      alert("Failed to upload profile picture");
    } finally {
      setUploading(false);
    }
  };

  return (
    <>
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
        onClick={handleClose}
      />
      <div className="fixed right-0 top-0 h-screen w-[400px] bg-white shadow-2xl z-50 overflow-y-auto animate-slide-in">
        <div className="p-6 border-b-2 border-gray-200 bg-gradient-to-r from-indigo-500 to-purple-600 text-white flex justify-between items-center">
          <h2 className="text-xl font-bold">Add New Employee</h2>
          <button
            onClick={handleClose}
            className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-all"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6">
          <div className="mb-5">
            <label className="block font-semibold text-gray-700 mb-2 text-sm">
              Name
            </label>
            <input
              type="text"
              placeholder="Enter employee name"
              value={formData.stylist_name}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  stylist_name: e.target.value,
                }))
              }
              required
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg text-sm transition-all focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <div className="mb-5">
            <label className="block font-semibold text-gray-700 mb-2 text-sm">
              Contact Number
            </label>
            <input
              type="tel"
              placeholder="Enter contact number"
              value={formData.stylist_contact_number}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  stylist_contact_number: e.target.value,
                }))
              }
              required
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg text-sm transition-all focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          {/* Updated Profile Picture Section */}
          <div className="mb-5">
            <label className="block font-semibold text-gray-700 mb-2 text-sm">
              Profile Picture
            </label>

            {/* Profile Picture Preview */}
            {formData.profile_pic_link && (
              <div className="mb-3 flex justify-center">
                <img
                  src={formData.profile_pic_link}
                  alt="Profile Preview"
                  className="w-20 h-20 object-cover rounded-full border-2 border-gray-200"
                />
              </div>
            )}

            {/* Upload Button */}
            <div className="flex gap-2 mb-2">
              <input
                type="file"
                accept="image/*"
                onChange={handleProfilePicUpload}
                className="hidden"
                id="profile-pic-upload-add"
                disabled={uploading || loading}
              />
              <label
                htmlFor="profile-pic-upload-add"
                className={`px-3 py-2 text-sm rounded border cursor-pointer transition flex items-center gap-2 ${
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
                    <svg
                      className="h-4 w-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                      />
                    </svg>
                    Upload Image
                  </>
                )}
              </label>
            </div>

            <p className="text-xs text-gray-500">
              Recommended: 200x200px, square format
            </p>
          </div>

          <div className="mb-5">
            <label className="block font-semibold text-gray-700 mb-2 text-sm">
              Bio
            </label>
            <textarea
              placeholder="Enter bio (optional)"
              value={formData.bio}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, bio: e.target.value }))
              }
              rows={3}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg text-sm transition-all focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <button
            onClick={onSubmit}
            disabled={loading || uploading}
            className="w-full py-4 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-xl font-semibold shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none"
          >
            {loading
              ? "Adding..."
              : uploading
              ? "Uploading..."
              : "Add Employee"}
          </button>
        </div>
      </div>
    </>
  );
};

export default AddStylistModal;
