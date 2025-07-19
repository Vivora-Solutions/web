import React, { useState } from 'react';
import { FaRegEdit, FaCheck, FaTimes } from "react-icons/fa";
import './EditableField.css';

const EditableField = ({ value, onSave, isTextarea = false, className = "", placeholder = "" }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [tempValue, setTempValue] = useState(value);

    const handleEdit = () => {
        setTempValue(value);
        setIsEditing(true);
    };

    const handleSave = () => {
        onSave(tempValue);
        setIsEditing(false);
    };

    const handleCancel = () => {
        setTempValue(value);
        setIsEditing(false);
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !isTextarea) handleSave();
        else if (e.key === 'Escape') handleCancel();
    };

    return (
        <div className={`editable-field ${className}`}>
            {isEditing ? (
                <div className="edit-container">
                    {isTextarea ? (
                        <textarea
                            value={tempValue}
                            onChange={(e) => setTempValue(e.target.value)}
                            onKeyDown={handleKeyPress}
                            placeholder={placeholder}
                            className="edit-textarea"
                            autoFocus
                        />
                    ) : (
                        <input
                            type="text"
                            value={tempValue}
                            onChange={(e) => setTempValue(e.target.value)}
                            onKeyDown={handleKeyPress}
                            placeholder={placeholder}
                            className="edit-input"
                            autoFocus
                        />
                    )}
                    <button onClick={handleSave} className="save-icon"><FaCheck /></button>
                    <button onClick={handleCancel} className="cancel-icon"><FaTimes /></button>
                </div>
            ) : (
                <div className="view-container">
                    {isTextarea ? (
                        <p>{value}</p>
                    ) : (
                        <h1>{value}</h1>
                    )}
                    <button onClick={handleEdit} className="edit-icon"><FaRegEdit /></button>
                </div>
            )}
        </div>
    );
};

export default EditableField;
