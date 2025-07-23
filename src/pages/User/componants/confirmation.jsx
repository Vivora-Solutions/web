// src/componants/confirmationmodal.js
import React from 'react';
import './confirmation.css';

const ConfirmationModal = ({ message, onConfirm, onCancel }) => {
  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-content">
          <h3 className="modal-title">Are You Sure?</h3>
          <p className="modal-message">{message}</p>
          <div className="modal-actions">
            <button className="cancel-btn" onClick={onCancel}>
              Cancel
            </button>
            <button className="delete-btn" onClick={onConfirm}>
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;