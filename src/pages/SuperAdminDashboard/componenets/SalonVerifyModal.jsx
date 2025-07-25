// components/SalonVerifyModal.jsx
import React from 'react';
import './SalonVerifyModal.css';

const SalonVerifyModal = ({ salon, onClose, onAction }) => {
  if (!salon) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Verify Salon</h2>

        <div className="modal-body">
          <div className="salon-details">
            <img src={salon.salon_logo_link} alt={salon.salon_name} className="salon-logo" />
            <h3>{salon.salon_name}</h3>
            <p>{salon.salon_type}</p>
            <p>📍 {salon.salon_address}</p>
            <p>{salon.salon_description || 'No description available.'}</p>
            <p>📞 {salon.salon_contact_number}</p>
            <p>✉️ {salon.salon_email}</p>
          </div>

          <div className="salon-map">
            <img src="https://via.placeholder.com/400x300?text=Map" alt="Map placeholder" />
          </div>
        </div>

        <div className="owner-info">
          <p><strong>Owner - {salon.owner_name}</strong></p>
          <p>📞 {salon.owner_phone}</p>
        </div>

        <div className="modal-actions">
          <button onClick={() => onAction('accept', salon.salon_id)}>Accept</button>
          <button className="decline" onClick={() => onAction('decline', salon.salon_id)}>Decline</button>
          <button onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default SalonVerifyModal;
