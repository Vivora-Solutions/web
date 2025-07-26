import React, { useState } from 'react';
import './EditEmployeePopup.css';

const EditEmployeePopup = ({ employee, onClose, onSave }) => {
  const [formData, setFormData] = useState(employee);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="popup-overlay">
      <div className="popup-content">
        <h3>Edit Employee</h3>

        <div className="profile-upload">
          <img src={formData.profilePic} alt="Profile" className="employee-avatar" />
          <label htmlFor="edit-profile-upload">✏️</label>
          <input
            id="edit-profile-upload"
            type="file"
            className="profile-input"
            onChange={(e) => {
              const file = e.target.files[0];
              const reader = new FileReader();
              reader.onload = (ev) => handleChange('profilePic', ev.target.result);
              reader.readAsDataURL(file);
            }}
          />
        </div>

        <div className="form-group">
          <label>Name</label>
          <input value={formData.name} onChange={(e) => handleChange('name', e.target.value)} />
        </div>

        <div className="form-group">
          <label>Contact Number</label>
          <input value={formData.contact_no} onChange={(e) => handleChange('contact_no', e.target.value)} />
        </div>

        <div className="form-group">
          <label>Email</label>
          <input value={formData.email || ''} onChange={(e) => handleChange('email', e.target.value)} />
        </div>

        <div className="form-group">
          <label>Bio</label>
          <textarea value={formData.bio || ''} onChange={(e) => handleChange('bio', e.target.value)} />
        </div>

        <div className="form-group">
          <label>Services Possible</label>
          <div className="services-checkboxes">
            <label><input type="checkbox" /> Hair Cutting and Shaving - M</label>
            <label><input type="checkbox" /> Oil Massage - U</label>
            <label><input type="checkbox" /> Beard Trimming - M</label>
          </div>
        </div>

        <div className="popup-buttons">
          <button onClick={onClose}>Cancel</button>
          <button className="save-btn" onClick={() => onSave(formData)}>Save and Update</button>
        </div>
      </div>
    </div>
  );
};

export default EditEmployeePopup;
