import { useEffect, useState } from "react";
import EditableField from "./components/EditableField";
import { ProtectedAPI }  from "../../utils/api";

const SalonInfo = () => {
  const [salon, setSalon] = useState(null);
  const [formData, setFormData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);

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

  const handleLogoUpload = async (base64Image) => {
    const updated = { ...formData, salon_logo_link: base64Image };
    setFormData(updated);
    await handleUpdate(updated);
  };

  if (loading || !formData) {
    return (
      <div className="flex items-center justify-center min-h-[400px] bg-slate-100">
        <div className="text-center">
          <div className="animate-spin h-12 w-12 border-b-2 border-indigo-600 rounded-full mx-auto mb-4"></div>
          <p className="text-slate-600 font-medium">Loading salon information...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header */}
        <div className="rounded-2xl shadow-xl border bg-white border-slate-200">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-8 py-6 rounded-t-2xl">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
              <div>
                <h1 className="text-3xl font-bold text-white mb-1">Salon Management</h1>
                <p className="text-indigo-100">Manage your salon’s profile and public information</p>
              </div>
              <div className="flex gap-3">
                {!isEditing ? (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="btn border border-indigo-500 bg-white text-indigo-600 hover:bg-indigo-50"
                  >
                    Edit Profile
                  </button>
                ) : (
                  <>
                    <button
                      onClick={() => setIsEditing(false)}
                      className="btn bg-slate-500 hover:bg-slate-600 text-white"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleUpdate}
                      className="btn bg-emerald-500 hover:bg-emerald-600 text-white"
                    >
                      Save Changes
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="rounded-2xl shadow-xl border border-slate-200 bg-white">
          <div className="p-8 space-y-10">
            {/* Logo Upload */}
            <div className="flex flex-col lg:flex-row items-start gap-6 bg-slate-50 p-6 rounded-xl border border-slate-200">
              <div className="shrink-0">
                {formData.salon_logo_link ? (
                  <div className="relative group w-24 h-24">
                    <img
                      src={formData.salon_logo_link}
                      alt="Salon Logo"
                      className="w-full h-full object-cover rounded-full border-4 border-white shadow ring-2 ring-indigo-100"
                    />
                    {isEditing && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 rounded-full opacity-0 group-hover:opacity-100 transition cursor-pointer">
                        <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z M3 9a2 2 0 012-2h14a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                        </svg>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center border-4 border-white shadow">
                    <svg className="w-10 h-10 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12z" />
                    </svg>
                  </div>
                )}
              </div>
              <div className="flex-1">
                <label className="block text-sm font-semibold text-slate-700 mb-2">Salon Logo</label>
                <EditableField
                  value={formData.salon_logo_link}
                  onSave={(v) => handleChange("salon_logo_link", v)}
                  disabled={!isEditing}
                  placeholder="Paste image URL"
                  className="text-sm text-slate-600"
                />
                <p className="text-xs text-slate-500 mt-1">Recommended: 200x200px, square format</p>
              </div>
            </div>

            {/* Info Fields */}
            <div className="grid gap-6">
              {/* Salon Name */}
              <FieldGroup
                label="Salon Name"
                icon="🏠"
                value={formData.salon_name}
                onChange={(v) => handleChange("salon_name", v)}
                disabled={!isEditing}
              />

              {/* Description */}
              <FieldGroup
                label="Description"
                icon="📝"
                value={formData.salon_description}
                onChange={(v) => handleChange("salon_description", v)}
                disabled={!isEditing}
                multiline
              />

              <div className="grid md:grid-cols-2 gap-6">
                {/* Address */}
                <FieldGroup
                  label="Address"
                  icon="📍"
                  value={formData.salon_address}
                  onChange={(v) => handleChange("salon_address", v)}
                  disabled={!isEditing}
                />

                {/* Contact Number */}
                <FieldGroup
                  label="Contact Number"
                  icon="📞"
                  value={formData.salon_contact_number}
                  onChange={(v) => handleChange("salon_contact_number", v)}
                  disabled={!isEditing}
                />
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-slate-50 border-t border-slate-200 px-6 py-4 flex items-center justify-between text-sm text-slate-600">
            <div className="flex items-center gap-2">
              <svg className="h-4 w-4 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4" />
              </svg>
              Profile information is automatically saved
            </div>
            <div className="text-xs">Last updated: {new Date().toLocaleDateString()}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper Component
const FieldGroup = ({ label, icon, value, onChange, disabled, multiline = false }) => (
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
