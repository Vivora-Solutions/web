import { useEffect, useState } from "react";
import EditableField from "./components/EditableField";
import { ProtectedAPI } from "../../utils/api";
import supabase from "../../utils/supabaseClient"; // Add this import

const SalonInfo = () => {
  const [salon, setSalon] = useState(null);
  const [formData, setFormData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false); // Add uploading state

  useEffect(() => {
    const fetchSalon = async () => {
      try {
        const res = await ProtectedAPI.get("/salon-admin/my");
        setSalon(res.data);
        setFormData(res.data);
      } catch (err) {
        console.error("Failed to fetch salon info:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchSalon();
  }, []);

  const handleChange = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  // Add logo upload handler
  const handleLogoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please select an image file");
      return;
    }

    setUploading(true);

    try {
      const fileName = `logo-${Date.now()}-${file.name}`;

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

      // Update form data with new logo URL
      handleChange("salon_logo_link", imageUrl);

      alert("Logo uploaded successfully!");
    } catch (error) {
      console.error("Error uploading logo:", error);
      alert("Failed to upload logo");
    } finally {
      setUploading(false);
    }
  };

  const handleUpdate = async () => {
    try {
      const payload = {
        salon_id: formData.salon_id,
        salon_name: formData.salon_name,
        salon_description: formData.salon_description,
        salon_address: formData.salon_address,
        salon_contact_number: formData.salon_contact_number,
        salon_logo_link: formData.salon_logo_link,
      };
      await ProtectedAPI.put("/salon-admin/update", payload);
      setSalon((prev) => ({ ...prev, ...payload }));
      setIsEditing(false);
      alert("Salon updated successfully!");
    } catch (err) {
      console.error("Update failed:", err.response?.data || err.message);
      alert("Failed to update salon");
    }
  };

  if (loading || !formData) {
    return (
      <div className="flex items-center justify-center min-h-[400px] bg-slate-100">
        <div className="text-center">
          <div className="animate-spin h-12 w-12 border-b-2 border-indigo-600 rounded-full mx-auto mb-4"></div>
          <p className="text-slate-600 font-medium">
            Loading salon information...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-10 p-0 md:p-4 flex justify-center items-start">
      <div className="relative w-full rounded-2xl shadow-xl border border-slate-200 bg-white p-4 pb-20">
        {/* pb-20 adds space at bottom for buttons */}

        {/* Title & subtitle */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-1">
            Salon Management
          </h1>
          <p className="text-indigo-600">
            Manage your salon's profile and public information
          </p>
        </div>

        {/* Logo Upload - Updated section */}
        <div className="flex flex-col lg:flex-row items-start gap-6 bg-slate-50 p-6 rounded-xl border border-slate-200 mb-10">
          <div className="shrink-0 relative group w-24 h-24">
            {formData.salon_logo_link ? (
              <>
                <img
                  src={formData.salon_logo_link}
                  alt="Salon Logo"
                  className="w-full h-full object-cover rounded-full border-4 border-white shadow ring-2 ring-indigo-100"
                />
                {isEditing && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 rounded-full opacity-0 group-hover:opacity-100 transition cursor-pointer">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleLogoUpload}
                      className="hidden"
                      id="logo-upload"
                      disabled={uploading}
                    />
                    <label
                      htmlFor="logo-upload"
                      className="w-full h-full flex items-center justify-center cursor-pointer"
                    >
                      {uploading ? (
                        <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                      ) : (
                        <svg
                          className="h-6 w-6 text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 13a3 3 0 11-6 0 3 3 0 016 0z M3 9a2 2 0 012-2h14a2 2 0 012 2v9a2 2 0 01-2-2H5a2 2 0 01-2-2z"
                          />
                        </svg>
                      )}
                    </label>
                  </div>
                )}
              </>
            ) : (
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center border-4 border-white shadow relative">
                <svg
                  className="w-10 h-10 text-slate-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12z"
                  />
                </svg>
                {isEditing && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 rounded-full opacity-0 group-hover:opacity-100 transition cursor-pointer">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleLogoUpload}
                      className="hidden"
                      id="logo-upload-empty"
                      disabled={uploading}
                    />
                    <label
                      htmlFor="logo-upload-empty"
                      className="w-full h-full flex items-center justify-center cursor-pointer"
                    >
                      {uploading ? (
                        <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                      ) : (
                        <svg
                          className="h-6 w-6 text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                          />
                        </svg>
                      )}
                    </label>
                  </div>
                )}
              </div>
            )}
          </div>
          <div className="flex-1">
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Salon Logo
            </label>
            <div className="flex gap-2 items-center mb-2">
              {isEditing && (
                <div className="flex gap-2">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    className="hidden"
                    id="logo-upload-btn"
                    disabled={uploading}
                  />
                  <label
                    htmlFor="logo-upload-btn"
                    className={`px-3 py-1 text-sm rounded border cursor-pointer transition ${
                      uploading
                        ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
                        : "bg-blue-50 text-blue-600 border-blue-200 hover:bg-blue-100"
                    }`}
                  >
                    {uploading ? "Uploading..." : "Upload Image"}
                  </label>
                </div>
              )}
            </div>
            {/* <EditableField
              value={formData.salon_logo_link}
              onSave={(v) => handleChange("salon_logo_link", v)}
              disabled={!isEditing}
              placeholder="Paste image URL or upload an image"
              className="text-sm text-slate-600"
            /> */}
            <p className="text-xs text-slate-500 mt-1">
              Recommended: 200x200px, square format
            </p>
          </div>
        </div>

        {/* ...existing code... */}
        {/* Info Fields */}
        <div className="grid gap-6">
          <FieldGroup
            label="Salon Name"
            icon="🏠"
            value={formData.salon_name}
            onChange={(v) => handleChange("salon_name", v)}
            disabled={!isEditing}
          />

          <FieldGroup
            label="Description"
            icon="📝"
            value={formData.salon_description}
            onChange={(v) => handleChange("salon_description", v)}
            disabled={!isEditing}
            multiline
          />

          <div className="grid md:grid-cols-2 gap-6">
            <FieldGroup
              label="Address"
              icon="📍"
              value={formData.salon_address}
              onChange={(v) => handleChange("salon_address", v)}
              disabled={!isEditing}
            />

            <FieldGroup
              label="Contact Number"
              icon="📞"
              value={formData.salon_contact_number}
              onChange={(v) => handleChange("salon_contact_number", v)}
              disabled={!isEditing}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-50 border-t border-slate-200 px-6 py-4 mt-10 flex items-center justify-between text-sm text-slate-600 rounded-b-2xl">
          <div className="flex items-center gap-2">
            <svg
              className="h-4 w-4 text-emerald-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4"
              />
            </svg>
            Profile information is automatically saved
          </div>
          <div className="text-xs">
            Last updated: {new Date().toLocaleDateString()}
          </div>
        </div>

        {/* Buttons fixed at bottom right inside card */}
        <div className="absolute bottom-6 right-6 flex gap-3">
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="btn border border-indigo-500 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 px-4 py-2 rounded"
            >
              Edit Profile
            </button>
          ) : (
            <>
              <button
                onClick={() => setIsEditing(false)}
                className="btn bg-slate-500 hover:bg-slate-600 text-white px-4 py-2 rounded"
                disabled={uploading}
              >
                Cancel
              </button>
              <button
                onClick={handleUpdate}
                className="btn bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded"
                disabled={uploading}
              >
                {uploading ? "Uploading..." : "Save Changes"}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

// ...existing code...
const FieldGroup = ({
  label,
  icon,
  value,
  onChange,
  disabled,
  multiline = false,
}) => (
  <div className="group">
    <label className="block text-sm font-semibold text-slate-700 mb-2">
      {icon} {label}
    </label>
    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 group-hover:border-indigo-200 transition-colors duration-200">
      <EditableField
        value={value}
        onSave={onChange}
        disabled={disabled}
        multiline={multiline}
        className="text-slate-700"
      />
    </div>
  </div>
);

export default SalonInfo;
