import React, { useState, useEffect } from 'react';
import EditableField from '../../../../components/EditableField/EditableField';
import './DashboardHeader.css';

const DashboardHeader = ({ salon, onUpdate }) => {
  const [salonLogo, setSalonLogo] = useState(salon.salon_logo_link);

  const [formData, setFormData] = useState({
    salon_name: '',
    salon_description: '',
    salon_address: '',
    salon_contact_number: '',
    salon_logo_link: ''
  });

  useEffect(() => {
    setFormData({
      salon_name: salon.salon_name || '',
      salon_description: salon.salon_description || '',
      salon_address: salon.salon_address || '',
      salon_contact_number: salon.salon_contact_number || '',
      salon_logo_link: salon.salon_logo_link || ''
    });
    setSalonLogo(salon.salon_logo_link || '');
  }, [salon]);

  const handleChange = (key, value) => {
    setFormData(prev => ({ ...prev, [key]: value }));
    if (key === 'salon_logo_link') {
      setSalonLogo(value);
    }
  };

  const handleBlur = () => {
    onUpdate(formData);
  };

  const handleLogoChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      handleChange('salon_logo_link', reader.result);
      onUpdate({ ...formData, salon_logo_link: reader.result });
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="flex flex-col md:flex-row items-center justify-between gap-6 p-6 bg-white rounded-2xl shadow-md">
      {/* Logo Section */}
      <div className="relative w-36 h-36 shrink-0">
        <img
          src={salonLogo}
          alt="Salon Logo"
          className="w-full h-full object-cover rounded-full border border-gray-300"
        />
        <div className="absolute bottom-0 right-0">
          <input
            type="file"
            accept="image/*"
            onChange={handleLogoChange}
            className="hidden"
            id="logo-upload"
          />
          <label
            htmlFor="logo-upload"
            className="cursor-pointer bg-blue-600 text-white text-xs px-3 py-1 rounded-full shadow hover:bg-blue-700 transition"
          >
            ✏️ Edit Logo
          </label>
        </div>
      </div>

      {/* Info Section */}
      <div className="flex-1 w-full space-y-4">
        <div className="text-xl font-bold text-gray-800">
          <EditableField
            value={formData.salon_name}
            onSave={(v) => handleChange('salon_name', v)}
            onBlur={handleBlur}
          />
        </div>

        <div className="text-sm text-gray-600">
          <EditableField
            value={formData.salon_description}
            onSave={(v) => handleChange('salon_description', v)}
            isTextarea
            onBlur={handleBlur}
          />
        </div>

        <div className="text-sm text-gray-500">
          <EditableField
            value={formData.salon_address}
            onSave={(v) => handleChange('salon_address', v)}
            onBlur={handleBlur}
          />
        </div>

        <div className="text-sm text-gray-500">
          <EditableField
            value={formData.salon_contact_number}
            onSave={(v) => handleChange('salon_contact_number', v)}
            onBlur={handleBlur}
          />
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;
