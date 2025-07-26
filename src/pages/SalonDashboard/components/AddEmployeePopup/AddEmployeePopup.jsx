import React, { useState } from 'react';
import './AddEmployeePopup.css'; // You can reuse EditEmployeePopup.css

const AddEmployeePopup = ({ onSave, onClose, defaultPic }) => {
  const [formData, setFormData] = useState({
    name: '',
    contact_no: '',
    profilePic: defaultPic,
    email: '',
    bio: '',
  });

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        handleChange('profilePic', event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = () => {
    if (formData.name && formData.contact_no) {
      onSave(formData);
    }
  };

  return (
    <div className="popup-overlay">
      <div className="popup-content">
        <h3>Add Employee</h3>

        <div className="profile-upload">
          <img src={formData.profilePic} alt="Profile" className="employee-avatar" />
          <label htmlFor="add-profile-upload">📷</label>
          <input
            id="add-profile-upload"
            type="file"
            className="profile-input"
            accept="image/*"
            onChange={handleImageUpload}
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
          <input value={formData.email} onChange={(e) => handleChange('email', e.target.value)} />
        </div>

        <div className="form-group">
          <label>Bio</label>
          <textarea value={formData.bio} onChange={(e) => handleChange('bio', e.target.value)} />
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
          <button className="save-btn" onClick={handleSubmit}>Save and Add</button>
        </div>
      </div>
    </div>
  );
};

export default AddEmployeePopup;
