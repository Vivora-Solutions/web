import React, { useState } from 'react';
import './PhotoSection.css';

const PhotoSection = ({ bannerImages = [] }) => {
  const [photos, setPhotos] = useState(bannerImages.map(img => img.image_link));
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleAddPhoto = (e) => {
    const files = Array.from(e.target.files);
    files.forEach(file => {
      if (file && file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (ev) => {
          setPhotos(prev => [...prev, ev.target.result]);
        };
        reader.readAsDataURL(file);
      }
    });
  };

  const handleRemovePhoto = (index) => {
    const updatedPhotos = photos.filter((_, i) => i !== index);
    setPhotos(updatedPhotos);
    if (currentIndex >= updatedPhotos.length) {
      setCurrentIndex(Math.max(0, updatedPhotos.length - 1));
    }
  };

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  const nextSlide = () => {
    setCurrentIndex((currentIndex + 1) % photos.length);
  };

  const prevSlide = () => {
    setCurrentIndex((currentIndex - 1 + photos.length) % photos.length);
  };

  return (
    <div className="card photos-card">
      <h2>Photos</h2>
      <div className="photos-container">

        {/* Add Photo */}
        <div className="photos-grid">
          <div className="add-photos-placeholder">
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleAddPhoto}
              className="photo-input"
              id="photo-upload"
            />
            <label htmlFor="photo-upload" className="add-photo-label">
              <span className="plus-icon">+</span>
              <p>Add Photos</p>
            </label>
          </div>

          {/* Thumbnails */}
          {photos.map((photo, index) => (
            <div key={index} className="photo-thumbnail-container">
              <img
                src={photo}
                alt={`Salon ${index}`}
                className={`salon-photo-thumbnail ${index === currentIndex ? 'active' : ''}`}
                onClick={() => goToSlide(index)}
              />
              <button className="remove-photo-btn" onClick={() => handleRemovePhoto(index)}>×</button>
            </div>
          ))}
        </div>

        {/* Main Photo Viewer */}
        {photos.length > 0 && (
          <div className="photo-slider">
            <button className="prev-button" onClick={prevSlide}>‹</button>
            <div className="slider-main">
              <img
                src={photos[currentIndex]}
                alt={`Main Salon ${currentIndex}`}
                className="main-photo"
              />
            </div>
            <button className="next-button" onClick={nextSlide}>›</button>
          </div>
        )}

        {/* Slider Dots */}
        {photos.length > 1 && (
          <div className="slider-dots">
            {photos.map((_, idx) => (
              <button
                key={idx}
                className={`dot ${currentIndex === idx ? 'active' : ''}`}
                onClick={() => goToSlide(idx)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PhotoSection;
