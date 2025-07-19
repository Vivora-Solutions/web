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

    return (
        <div className="salon-header">
            <div className="salon-logo-section">
                <img src={assets.salonLogo} alt="Liyo Saloon Logo" className="salon-logo" />
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
