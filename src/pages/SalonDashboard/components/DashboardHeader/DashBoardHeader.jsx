// import React, { useState } from 'react';
// import { assets } from '../../../../assets/assets';
// import EditableField from '../../../../components/EditableField/EditableField'; 
// import './DashBoardHeader.css';

// const DashBoardHeader = () => {
//     const [salonTitle, setSalonTitle] = useState("Liyo Saloon");
//     const [description, setDescription] = useState(
//         "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s..."
//     );
//     const [salonCategory, setSalonCategory] = useState("Hair Salon");
//     const [salonLogo, setSalonLogo] = useState(assets.salonLogo);

//     const handleLogoChange = (event) => {
//         const file = event.target.files[0];
//         if (file) {
//             const reader = new FileReader();
//             reader.onload = (e) => {
//                 setSalonLogo(e.target.result);
//             };
//             reader.readAsDataURL(file);
//         }
//     };

//     return (
//         <div className="salon-header">
//             <div className="salon-logo-section">
//                 <div className="logo-container">
//                     <img src={salonLogo} alt="Liyo Saloon Logo" className="salon-logo" />
//                     <div className="logo-overlay">
//                         <input
//                             type="file"
//                             accept="image/*"
//                             onChange={handleLogoChange}
//                             className="logo-input"
//                             id="logo-upload"
//                         />
//                         <label htmlFor="logo-upload" className="logo-edit-btn">
//                             ✏️ Edit Logo
//                         </label>
//                     </div>
//                 </div>
//             </div>

//             <div className="salon-info-section">
//                 <div className="salon-title-row">
//                     <EditableField
//                         value={salonTitle}
//                         onSave={setSalonTitle}
//                     />
//                 </div>

//                <div className='salon-category'><EditableField value={salonCategory} onSave={setSalonCategory} isTextarea={true} className="salon-category" /></div>

//                 <div className="salon-description">
//                     <EditableField
//                         value={description}
//                         onSave={setDescription}
//                         isTextarea={true}
//                         className="editable-description"
//                     />
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default DashBoardHeader;


// src/pages/SalonDashboard/components/DashboardHeader.jsx
import React, { useState, useEffect } from 'react';
import EditableField from '../../../../components/EditableField/EditableField';
import './DashBoardHeader.css';

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
      salon_name: salon.salon_name,
      salon_description: salon.salon_description,
      salon_address: salon.salon_address,
      salon_contact_number: salon.salon_contact_number,
      salon_logo_link: salon.salon_logo_link
    });
    setSalonLogo(salon.salon_logo_link);
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
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      handleChange('salon_logo_link', reader.result);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="salon-header">
      <div className="salon-logo-section">
        <div className="logo-container">
          <img src={salonLogo} alt="Salon Logo" className="salon-logo" />
          <div className="logo-overlay">
            <input type="file" accept="image/*" onChange={handleLogoChange} className="logo-input" id="logo-upload" />
            <label htmlFor="logo-upload" className="logo-edit-btn">✏️ Edit Logo</label>
          </div>
        </div>
      </div>
      <div className="salon-info-section">
        <EditableField value={formData.salon_name} onSave={(v) => handleChange('salon_name', v)} onBlur={handleBlur} />
        <EditableField value={formData.salon_description} onSave={(v) => handleChange('salon_description', v)} isTextarea onBlur={handleBlur} />
        <EditableField value={formData.salon_address} onSave={(v) => handleChange('salon_address', v)} onBlur={handleBlur} />
        <EditableField value={formData.salon_contact_number} onSave={(v) => handleChange('salon_contact_number', v)} onBlur={handleBlur} />
      </div>
    </div>
  );
};

export default DashboardHeader;
