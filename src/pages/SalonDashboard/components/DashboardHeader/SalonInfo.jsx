import { useEffect, useState } from 'react';
import EditableField from './EditableField';
// import UploadImage from '../UploadImage';
import API from '../../../../utils/api';
import LoadingSpinner from '../../../../components/LoadingSpinner/LoadingSpinner';

const SalonInfo = () => {
  const [salon, setSalon] = useState(null);
  const [formData, setFormData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSalon = async () => {
      setLoading(true);
      try {
        const res = await API.get('/salon-admin/my');
        setSalon(res.data);
        setFormData(res.data);
      } catch (err) {
        console.error('Failed to fetch salon info:', err);
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

      await API.put('/salon-admin/update', payload);
      setSalon((prev) => ({ ...prev, ...payload }));
      setIsEditing(false);
      alert('Salon updated successfully!');
    } catch (err) {
      console.error('Update failed:', err.response?.data || err.message);
      alert('Failed to update salon');
    }
  };

  const handleLogoUpload = async (base64Image) => {
    const updated = { ...formData, salon_logo_link: base64Image };
    setFormData(updated);
    await handleUpdate(updated);
  };

  if (loading || !formData) {
    return (
      <div className="flex items-center justify-center min-h-[400px] bg-gradient-to-br from-indigo-50 via-white to-purple-50">
        <div className="text-center space-y-4">
          <LoadingSpinner message="Loading salon info..." />
          <p className="text-gray-600 font-medium">Preparing your salon dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-[80vh] bg-transparent overflow-hidden flex flex-col gap-8 p-8">
      {/* Header with edit buttons */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-10 pb-8 border-b-2 border-gradient-to-r from-indigo-200 via-purple-200 to-pink-200">
        <div className="space-y-2">
          <h2 className="text-3xl font-extrabold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            Salon Information
          </h2>
          <p className="text-gray-600 text-base font-medium">
            Manage your salon&apos;s public profile information
          </p>
        </div>
        <div className="flex gap-4">
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="group relative px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center gap-3 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 relative z-10"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
              </svg>
              <span className="font-semibold relative z-10">Edit Profile</span>
            </button>
          ) : (
            <div className="flex gap-3">
              <button
                onClick={() => setIsEditing(false)}
                className="px-5 py-3 bg-gray-100 text-gray-700 rounded-xl shadow-md hover:bg-gray-200 hover:shadow-lg transition-all duration-300 flex items-center gap-2 font-medium"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
                Cancel
              </button>
              <button
                onClick={handleUpdate}
                className="group relative px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center gap-3 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-teal-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 relative z-10"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="font-semibold relative z-10">Save Changes</span>
              </button>
            </div>
          )}
        </div>
      </div>
      {/* Form Fields */}
      <div className="grid gap-8">
        {/* Salon Name */}
        <div className="group bg-white p-6  hover:shadow-xl transition-all duration-300  hover:border-indigo-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-white"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm3 1h6v4H7V5zm8 8v2a1 1 0 01-1 1H6a1 1 0 01-1-1v-2h8z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <label className="text-lg font-bold text-gray-800 group-hover:text-indigo-600 transition-colors duration-300">
              Salon Name
            </label>
          </div>
          <EditableField
            value={formData.salon_name}
            onSave={(v) => handleChange('salon_name', v)}
            disabled={!isEditing}
            className="text-xl font-bold text-gray-800 bg-gray-50 p-4 rounded-xl"
          />
        </div>

        {/* Description */}
        <div className="group bg-white p-6 hover:shadow-xl transition-all duration-300  hover:border-purple-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-white"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <label className="text-lg font-bold text-gray-800 group-hover:text-purple-600 transition-colors duration-300">
              Description
            </label>
          </div>
          <EditableField
            value={formData.salon_description}
            onSave={(v) => handleChange('salon_description', v)}
            disabled={!isEditing}
            multiline
            className="text-gray-700 bg-gray-50 p-4 rounded-xl min-h-[100px]"
          />
          <p className="text-sm text-gray-500 mt-3 italic">
            ✨ Tell customers what makes your salon special
          </p>
        </div>

        {/* Address */}
        <div className="group bg-white p-6  hover:shadow-xl transition-all duration-300  hover:border-emerald-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-lg">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-white"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <label className="text-lg font-bold text-gray-800 group-hover:text-emerald-600 transition-colors duration-300">
              Address
            </label>
          </div>
          <EditableField
            value={formData.salon_address}
            onSave={(v) => handleChange('salon_address', v)}
            disabled={!isEditing}
            className="text-gray-700 bg-gray-50 p-4 rounded-xl"
          />
        </div>

        {/* Contact Number */}
        <div className="group bg-white p-6  hover:shadow-xl transition-all duration-300  hover:border-blue-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-lg">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-white"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
              </svg>
            </div>
            <label className="text-lg font-bold text-gray-800 group-hover:text-blue-600 transition-colors duration-300">
              Contact Number
            </label>
          </div>
          <EditableField
            value={formData.salon_contact_number}
            onSave={(v) => handleChange('salon_contact_number', v)}
            disabled={!isEditing}
            className="text-gray-700 bg-gray-50 p-4 rounded-xl"
          />
        </div>

        {/* Logo */}
        <div className="group bg-white p-6  hover:shadow-xl transition-all duration-300  hover:border-rose-200">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-gradient-to-r from-rose-500 to-pink-600 rounded-lg">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-white"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <label className="text-lg font-bold text-gray-800 group-hover:text-rose-600 transition-colors duration-300">
              Salon Logo
            </label>
          </div>

          <div className="flex flex-col lg:flex-row items-start lg:items-center gap-6">
            {/* Logo Preview */}
            <div className="relative">
              {formData.salon_logo_link ? (
                <div className="relative group/logo">
                  <div className="w-24 h-24 rounded-2xl overflow-hidden border-4 border-white shadow-xl ring-2 ring-gray-100">
                    <img
                      src={formData.salon_logo_link}
                      alt="Salon Logo"
                      className="w-full h-full object-cover group-hover/logo:scale-110 transition-transform duration-300"
                    />
                  </div>
                  {isEditing && (
                    <div className="absolute inset-0 bg-black bg-opacity-40 rounded-2xl flex items-center justify-center opacity-0 group-hover/logo:opacity-100 transition-all duration-300 cursor-pointer">
                      <div className="text-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-6 w-6 text-white mx-auto mb-1"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                        </svg>
                        <span className="text-white text-xs font-semibold">
                          Change
                        </span>
                      </div>
                    </div>
                  )}
                  <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-gradient-to-r from-rose-500 to-pink-600 rounded-full flex items-center justify-center shadow-lg">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 text-white"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                </div>
              ) : (
                <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center border-4 border-white shadow-xl ring-2 ring-gray-100 group-hover:ring-rose-200 transition-all duration-300">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-10 w-10 text-gray-400 group-hover:text-rose-400 transition-colors duration-300"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
              )}
            </div>

            {/* Logo URL Input */}
            <div className="flex-1 w-full">
              <EditableField
                value={formData.salon_logo_link}
                onSave={(v) => handleChange('salon_logo_link', v)}
                disabled={!isEditing}
                placeholder="Paste your logo image URL here..."
                className="text-gray-700 bg-gray-50 p-4 rounded-xl w-full"
              />
              <div className="flex items-center gap-2 mt-3">
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                  <span className="text-xs text-gray-500">Recommended: 200x200px</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                  <span className="text-xs text-gray-500">Square format</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalonInfo;