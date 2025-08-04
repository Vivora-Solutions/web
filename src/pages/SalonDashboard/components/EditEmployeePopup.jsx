import React, { useState } from 'react';

const EditEmployeePopup = ({ employee, onClose, onSave }) => {
  const [formData, setFormData] = useState(employee);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl w-80 max-h-[95vh] overflow-y-auto shadow-lg">
        <h3 className="text-base font-semibold mb-5">Edit Employee</h3>

        {/* Profile Upload */}
        <div className="flex justify-center items-center relative mb-5">
          <img
            src={formData.profilePic}
            alt="Profile"
            className="w-[70px] h-[70px] rounded-full object-cover border-2 border-gray-300"
          />
          <label
            htmlFor="edit-profile-upload"
            className="absolute bottom-1 right-[calc(50%-35px)] bg-white rounded-full p-1 border text-xs cursor-pointer"
          >
            ✏️
          </label>
          <input
            id="edit-profile-upload"
            type="file"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files[0];
              const reader = new FileReader();
              reader.onload = (ev) => handleChange('profilePic', ev.target.result);
              reader.readAsDataURL(file);
            }}
          />
        </div>

        {/* Form Fields */}
        <div className="flex flex-col gap-4">
          <FormGroup
            label="Name"
            value={formData.name}
            onChange={(e) => handleChange('name', e.target.value)}
          />
          <FormGroup
            label="Contact Number"
            value={formData.contact_no}
            onChange={(e) => handleChange('contact_no', e.target.value)}
          />
          <FormGroup
            label="Email"
            value={formData.email || ''}
            onChange={(e) => handleChange('email', e.target.value)}
          />
          <FormGroup
            label="Bio"
            isTextarea
            value={formData.bio || ''}
            onChange={(e) => handleChange('bio', e.target.value)}
          />
        </div>

        {/* Services */}
        <div className="mt-4">
          <label className="text-sm font-medium text-gray-600 mb-2 block">Services Possible</label>
          <div className="bg-gray-100 p-3 rounded-lg max-h-32 overflow-y-auto text-sm">
            <label className="block mb-2 cursor-pointer">
              <input type="checkbox" className="mr-2" />
              Hair Cutting and Shaving - M
            </label>
            <label className="block mb-2 cursor-pointer">
              <input type="checkbox" className="mr-2" />
              Oil Massage - U
            </label>
            <label className="block mb-2 cursor-pointer">
              <input type="checkbox" className="mr-2" />
              Beard Trimming - M
            </label>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm bg-gray-300 rounded-md hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            onClick={() => onSave(formData)}
            className="px-4 py-2 text-sm bg-black text-white rounded-md hover:bg-gray-900"
          >
            Save and Update
          </button>
        </div>
      </div>
    </div>
  );
};

// Reusable form input/textarea group
const FormGroup = ({ label, value, onChange, isTextarea }) => (
  <div className="flex flex-col text-sm">
    <label className="mb-1 text-gray-600">{label}</label>
    {isTextarea ? (
      <textarea
        value={value}
        onChange={onChange}
        className="p-2 rounded-md border border-gray-300 bg-gray-100 resize-none"
      />
    ) : (
      <input
        type="text"
        value={value}
        onChange={onChange}
        className="p-2 rounded-md border border-gray-300 bg-gray-100"
      />
    )}
  </div>
);

export default EditEmployeePopup;
