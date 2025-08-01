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
      <div className="flex items-center justify-center min-h-[300px]">
        <LoadingSpinner message="Loading salon info..." />
      </div>
    );
  }

  return (
    <div className="w-full max-w-3xl mx-auto px-6 py-8 bg-white rounded-xl shadow-md overflow-hidden">
      {/* Header with edit buttons */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 pb-6 border-b border-gray-100">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Salon Information</h2>
          <p className="text-gray-500 text-sm mt-1">
            Manage your salon's public profile information
          </p>
        </div>

        <div className="flex gap-3">
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg shadow hover:bg-indigo-700 transition-all duration-200 flex items-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
              </svg>
              Edit
            </button>
          ) : (
            <button
              onClick={handleUpdate}
              className="px-4 py-2 bg-emerald-600 text-white rounded-lg shadow hover:bg-emerald-700 transition-all duration-200 flex items-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              Save Changes
            </button>
          )}
        </div>
      </div>

      {/* Form Fields */}
      <div className="space-y-6">
        {/* Salon Name */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <label className="block text-sm font-medium text-gray-700 mb-1">Salon Name</label>
          <EditableField
            value={formData.salon_name}
            onSave={(v) => handleChange('salon_name', v)}
            disabled={!isEditing}
            className="text-lg font-semibold text-gray-800"
          />
        </div>

        {/* Description */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <EditableField
            value={formData.salon_description}
            onSave={(v) => handleChange('salon_description', v)}
            disabled={!isEditing}
            multiline
            className="text-gray-600"
          />
          <p className="text-xs text-gray-400 mt-1">Tell customers about your salon</p>
        </div>

        {/* Address */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
          <EditableField
            value={formData.salon_address}
            onSave={(v) => handleChange('salon_address', v)}
            disabled={!isEditing}
            className="text-gray-600"
          />
        </div>

        {/* Contact Number */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <label className="block text-sm font-medium text-gray-700 mb-1">Contact Number</label>
          <EditableField
            value={formData.salon_contact_number}
            onSave={(v) => handleChange('salon_contact_number', v)}
            disabled={!isEditing}
            className="text-gray-600"
          />
        </div>

        {/* Logo */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <label className="block text-sm font-medium text-gray-700 mb-2">Logo</label>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            {formData.salon_logo_link ? (
              <div className="relative group">
                <img
                  src={formData.salon_logo_link}
                  alt="Salon Logo"
                  className="w-20 h-20 rounded-full object-cover border-2 border-white shadow-sm"
                />
                {isEditing && (
                  <div className="absolute inset-0 bg-black bg-opacity-30 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-white text-xs font-medium">Change</span>
                  </div>
                )}
              </div>
            ) : (
              <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            )}

            <div className="flex-1">
              {/* <UploadImage
                defaultImage={formData.salon_logo_link}
                onChange={handleLogoUpload}
              /> */}
              <EditableField
                value={formData.salon_logo_link}
                onSave={(v) => handleChange('salon_logo_link', v)}
                disabled={!isEditing}
                placeholder="Paste image URL here"
                className="text-sm"
              />
              <p className="text-xs text-gray-400 mt-1">Recommended size: 200x200px</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalonInfo;