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

      console.log('Sending update payload:', payload);

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

  if (!formData) return <LoadingSpinner message="Loading salon info..." />;

  return (
    <div className="w-full px-6 py-4 bg-transparent">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Salon Information</h2>
        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Edit
          </button>
        ) : (
          <button
            onClick={handleUpdate}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Update
          </button>
        )}
      </div>

      <div className="mb-4">
        <label className="block text-gray-600">Salon Name</label>
        <EditableField
          value={formData.salon_name}
          onSave={(v) => handleChange('salon_name', v)}
          disabled={!isEditing}
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-600">Description</label>
        <EditableField
          value={formData.salon_description}
          onSave={(v) => handleChange('salon_description', v)}
          disabled={!isEditing}
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-600">Address</label>
        <EditableField
          value={formData.salon_address}
          onSave={(v) => handleChange('salon_address', v)}
          disabled={!isEditing}
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-600">Contact Number</label>
        <EditableField
          value={formData.salon_contact_number}
          onSave={(v) => handleChange('salon_contact_number', v)}
          disabled={!isEditing}
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-600 mb-2">Logo</label>
        {/* <UploadImage
          defaultImage={formData.salon_logo_link}
          onChange={handleLogoUpload}
        /> */}
        <EditableField
          value={formData.salon_logo_link}
          onSave={(v) => handleChange('salon_logo_link', v)}
          disabled={!isEditing}
        />
      </div>
    </div>
  );
};

export default SalonInfo;