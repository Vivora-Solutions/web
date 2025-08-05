import React from "react";

const ProfileModal = ({
  show,
  profileFormData,
  setProfileFormData,
  loading,
  onClose,
  onSubmit,
}) => {
  if (!show) return null;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProfileFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
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

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Profile Picture Link
            </label>
            <input
              type="text"
              name="profile_pic_link"
              value={profileFormData.profile_pic_link}
              onChange={handleChange}
              className="mt-1 p-2 w-full border rounded-lg"
            />
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
            disabled={loading}
          >
            Cancel
          </button>
          <button
            onClick={onSubmit}
            disabled={loading}
            className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-indigo-300"
          >
            {loading ? "Updating..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileModal;
