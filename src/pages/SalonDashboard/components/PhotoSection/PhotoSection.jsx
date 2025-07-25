// import React, { useState } from 'react';
// import { assets } from '../../../../assets/assets';
// import './PhotoSection.css';

// const PhotoSection = () => {
//   const [photos, setPhotos] = useState([
//     assets.salonImage,
//     assets.salonImage,
//     assets.salonImage,
//     assets.salonImage
//   ]);
//   const [currentIndex, setCurrentIndex] = useState(0);

//   const handleAddPhoto = (event) => {
//     const files = Array.from(event.target.files);
    
//     files.forEach(file => {
//       if (file && file.type.startsWith('image/')) {
//         const reader = new FileReader();
//         reader.onload = (e) => {
//           setPhotos(prev => [...prev, e.target.result]);
//         };
//         reader.readAsDataURL(file);
//       }
//     });
//   };

//   const handleRemovePhoto = (index) => {
//     setPhotos(prev => prev.filter((_, i) => i !== index));
//     if (currentIndex >= photos.length - 1) {
//       setCurrentIndex(Math.max(0, photos.length - 2));
//     }
//   };

//   const nextSlide = () => {
//     if (photos.length > 0) {
//       setCurrentIndex((prev) => (prev + 1) % photos.length);
//     }
//   };

//   const prevSlide = () => {
//     if (photos.length > 0) {
//       setCurrentIndex((prev) => (prev - 1 + photos.length) % photos.length);
//     }
//   };

//   const goToSlide = (index) => {
//     setCurrentIndex(index);
//   };

//   return (
//     <div className="card photos-card">
//       <h2>Photos</h2>
//       <div className="photos-container">
//         <div className="photos-grid">
//           <div className="add-photos-placeholder">
//             <input
//               type="file"
//               multiple
//               accept="image/*"
//               onChange={handleAddPhoto}
//               className="photo-input"
//               id="photo-upload"
//             />
//             <label htmlFor="photo-upload" className="add-photo-label">
//               <span className="plus-icon">+</span>
//               <p>Add Photos</p>
//             </label>
//           </div>
          
//           {photos.map((photo, index) => (
//             <div key={index} className="photo-thumbnail-container">
//               <img
//                 src={photo}
//                 alt={`Salon photo ${index + 1}`}
//                 className={`salon-photo-thumbnail ${index === currentIndex ? 'active' : ''}`}
//                 onClick={() => goToSlide(index)}
//               />
//               <button 
//                 className="remove-photo-btn"
//                 onClick={() => handleRemovePhoto(index)}
//               >
//                 ×
//               </button>
//             </div>
//           ))}
//         </div>

//         {photos.length > 0 && (
//           <div className="photo-slider">
//             <button className="prev-button" onClick={prevSlide}>
//               ‹
//             </button>
            
//             <div className="slider-main">
//               <img
//                 src={photos[currentIndex]}
//                 alt={`Salon photo ${currentIndex + 1}`}
//                 className="main-photo"
//               />
//             </div>
            
//             <button className="next-button" onClick={nextSlide}>
//               ›
//             </button>
//           </div>
//         )}

//         {photos.length > 1 && (
//           <div className="slider-dots">
//             {photos.map((_, index) => (
//               <button
//                 key={index}
//                 className={`dot ${index === currentIndex ? 'active' : ''}`}
//                 onClick={() => goToSlide(index)}
//               />
//             ))}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default PhotoSection;

// src/pages/SalonDashboard/components/PhotoSection.jsx
import React, { useState } from 'react';
import './PhotoSection.css';

const PhotoSection = ({ bannerImages }) => {
  const [photos, setPhotos] = useState(bannerImages.map(img => img.image_link));
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleAddPhoto = (e) => {
    const files = Array.from(e.target.files);
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setPhotos(prev => [...prev, ev.target.result]);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleRemovePhoto = (index) => {
    setPhotos(photos.filter((_, i) => i !== index));
    setCurrentIndex(prev => Math.max(0, prev - 1));
  };

  return (
    <div className="card photos-card">
      <h2>Photos</h2>
      <div className="photos-container">
        <div className="photos-grid">
          <div className="add-photos-placeholder">
            <input type="file" multiple accept="image/*" onChange={handleAddPhoto} className="photo-input" id="photo-upload" />
            <label htmlFor="photo-upload" className="add-photo-label">
              <span className="plus-icon">+</span><p>Add Photos</p>
            </label>
          </div>
          {photos.map((photo, index) => (
            <div key={index} className="photo-thumbnail-container">
              <img src={photo} alt={`Salon ${index}`} className={`salon-photo-thumbnail ${index === currentIndex ? 'active' : ''}`} onClick={() => setCurrentIndex(index)} />
              <button className="remove-photo-btn" onClick={() => handleRemovePhoto(index)}>×</button>
            </div>
          ))}
        </div>

        {photos.length > 0 && (
          <div className="photo-slider">
            <button className="prev-button" onClick={() => setCurrentIndex((currentIndex - 1 + photos.length) % photos.length)}>‹</button>
            <div className="slider-main">
              <img src={photos[currentIndex]} alt={`Main Salon ${currentIndex}`} className="main-photo" />
            </div>
            <button className="next-button" onClick={() => setCurrentIndex((currentIndex + 1) % photos.length)}>›</button>
          </div>
        )}

        <div className="slider-dots">
          {photos.map((_, idx) => (
            <button key={idx} className={`dot ${currentIndex === idx ? 'active' : ''}`} onClick={() => setCurrentIndex(idx)} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default PhotoSection;
