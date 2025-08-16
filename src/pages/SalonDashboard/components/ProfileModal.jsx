import React, { useState } from "react";
import supabase from "../../../utils/supabaseClient"; // Add this import

const ProfileModal = ({
  show,
  profileFormData,
  setProfileFormData,
  loading,
  onClose,
  onSubmit,
}) => {
  const [uploading, setUploading] = useState(false); // Add uploading state

  if (!show) return null;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProfileFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
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
      setProfileFormData((prev) => ({
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-xl p-6 max-w-lg w-full shadow-xl space-y-5">
        <h2 className="text-xl font-semibold mb-2">Edit Stylist Profile</h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Name
            </label>
            <input
              type="text"
              name="stylist_name"
              value={profileFormData.stylist_name}
              onChange={handleChange}
              className="mt-1 p-2 w-full border rounded-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Contact Number
            </label>
            <input
              type="text"
              name="stylist_contact_number"
              value={profileFormData.stylist_contact_number}
              onChange={handleChange}
              className="mt-1 p-2 w-full border rounded-lg"
            />
          </div>

          {/* Updated Profile Picture Section */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Profile Picture
            </label>

            {/* Profile Picture Preview */}
            {profileFormData.profile_pic_link && (
              <div className="mb-3 flex justify-center">
                <img
                  src={profileFormData.profile_pic_link}
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
                id="profile-pic-upload"
                disabled={uploading || loading}
              />
              <label
                htmlFor="profile-pic-upload"
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

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Bio
            </label>
            <textarea
              name="bio"
              value={profileFormData.bio}
              onChange={handleChange}
              rows="3"
              className="mt-1 p-2 w-full border rounded-lg"
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              name="is_active"
              checked={profileFormData.is_active}
              onChange={handleChange}
              className="h-4 w-4"
            />
            <label className="text-gray-700 text-sm">Is Active</label>
          </div>
        </div>

        <div className="pt-4 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border text-gray-700 rounded-lg hover:bg-gray-50"
            disabled={loading || uploading}
          >
            Cancel
          </button>
          <button
            onClick={onSubmit}
            disabled={loading || uploading}
            className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-indigo-300"
          >
            {loading
              ? "Updating..."
              : uploading
              ? "Uploading..."
              : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileModal;
