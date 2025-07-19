import React, { useState } from 'react';
import { assets } from '../../../../assets/assets';
import EditableField from '../../../../components/EditableField/EditableField'; 
import './DashBoardHeader.css';

const DashBoardHeader = () => {
    const [salonTitle, setSalonTitle] = useState("Liyo Saloon");
    const [description, setDescription] = useState(
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s..."
    );
    const [salonCategory, setSalonCategory] = useState("Hair Salon");
    const [salonLogo, setSalonLogo] = useState(assets.salonLogo);

    const handleLogoChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setSalonLogo(e.target.result);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="salon-header">
            <div className="salon-logo-section">
                <div className="logo-container">
                    <img src={salonLogo} alt="Liyo Saloon Logo" className="salon-logo" />
                    <div className="logo-overlay">
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleLogoChange}
                            className="logo-input"
                            id="logo-upload"
                        />
                        <label htmlFor="logo-upload" className="logo-edit-btn">
                            ✏️ Edit Logo
                        </label>
                    </div>
                </div>
            </div>

            <div className="salon-info-section">
                <div className="salon-title-row">
                    <EditableField
                        value={salonTitle}
                        onSave={setSalonTitle}
                    />
                </div>

               <div className='salon-category'><EditableField value={salonCategory} onSave={setSalonCategory} isTextarea={true} className="salon-category" /></div>

                <div className="salon-description">
                    <EditableField
                        value={description}
                        onSave={setDescription}
                        isTextarea={true}
                        className="editable-description"
                    />
                </div>
            </div>
        </div>
    );
};

export default DashBoardHeader;