import React, { useState, useEffect } from 'react';
import './PhotoSection.css';
import API from '../../../../utils/api';
import LoadingSpinner from '../../../../components/LoadingSpinner/LoadingSpinner';

const PhotoSection = () => {
  const [photos, setPhotos] = useState([]); // Now stores objects with image_link and image_id
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  // Fetch images on component mount
  useEffect(() => {
    const fetchImages = async () => {
      setIsLoading(true);
      try {
        const response = await API.get('/salon-admin/images');
        setPhotos(response.data.images);
      } catch (error) {
        console.error('Error fetching images:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchImages();
  }, []);

  const handleAddPhoto = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;
    
    setUploading(true);
    
    try {
      for (const file of files) {
        if (file && file.type.startsWith('image/')) {
          const base64Image = await convertToBase64(file);
          
          const response = await API.post('/salon-admin/images', {
            image_link: base64Image
          });
          
          // Add the new image with its ID to the photos array
          setPhotos(prev => [...prev, {
            image_link: response.data.image_link,
            image_id: response.data.image_id // Assuming API returns the ID
          }]);
        }
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  };

  const handleRemovePhoto = async (index) => {
    if (!photos[index]?.image_id) return;
    
    try {
      await API.delete(`/salon-admin/images/${photos[index].image_id}`);
      
      // Update local state
      const updatedPhotos = photos.filter((_, i) => i !== index);
      setPhotos(updatedPhotos);
      
      // Adjust current index if needed
      if (currentIndex >= updatedPhotos.length) {
        setCurrentIndex(Math.max(0, updatedPhotos.length - 1));
      }
    } catch (error) {
      console.error('Error deleting image:', error);
      alert('Failed to delete image');
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

  if (isLoading) return <LoadingSpinner message="Loading photos..." />;

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
              disabled={uploading}
            />
            <label htmlFor="photo-upload" className="add-photo-label">
              {uploading ? (
                <span className="uploading-text">Uploading...</span>
              ) : (
                <>
                  <span className="plus-icon">+</span>
                  <p>Add Photos</p>
                </>
              )}
            </label>
          </div>

          {/* Thumbnails */}
          {photos.map((photo, index) => (
            <div key={photo.image_id} className="photo-thumbnail-container">
              <img
                src={photo.image_link}
                alt={`Salon ${index}`}
                className={`salon-photo-thumbnail ${index === currentIndex ? 'active' : ''}`}
                onClick={() => goToSlide(index)}
              />
              <button 
                className="remove-photo-btn" 
                onClick={() => handleRemovePhoto(index)}
                disabled={uploading}
              >
                ×
              </button>
            </div>
          ))}
        </div>

        {/* Main Photo Viewer */}
        {photos.length > 0 && (
          <div className="photo-slider">
            <button 
              className="prev-button" 
              onClick={prevSlide}
              disabled={uploading}
            >
              ‹
            </button>
            <div className="slider-main">
              <img
                src={photos[currentIndex]?.image_link}
                alt={`Main Salon ${currentIndex}`}
                className="main-photo"
              />
            </div>
            <button 
              className="next-button" 
              onClick={nextSlide}
              disabled={uploading}
            >
              ›
            </button>
          </div>
        )}

        {/* Slider Dots */}
        {photos.length > 1 && (
          <div className="slider-dots">
            {photos.map((_, idx) => (
              <button
                key={photos[idx].image_id}
                className={`dot ${currentIndex === idx ? 'active' : ''}`}
                onClick={() => goToSlide(idx)}
                disabled={uploading}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PhotoSection;