import React, { useState } from 'react';
import { X, ChevronLeft, ChevronRight, ZoomIn, Download, Share2 } from 'lucide-react';
import './SalonGallery.css';

const SalonGallery = ({ images = [], salonName }) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  // API INTEGRATION POINT: Fetch salon images from backend
  // Example API call: GET /api/salons/{salonId}/gallery
  // Expected response format: { id, url, title, description, category, uploadDate }

  const openLightbox = (image, index) => {
    // API INTEGRATION POINT: Track image view analytics
    // Example API call: POST /api/analytics/image-view
    // Payload: { salonId, imageId: image.id, userId }
    console.log('Image viewed:', image.id);
    setSelectedImage(image);
    setCurrentIndex(index);
  };

  const closeLightbox = () => {
    setSelectedImage(null);
  };

  const navigateImage = (direction) => {
    const newIndex = direction === 'next' 
      ? (currentIndex + 1) % images.length 
      : (currentIndex - 1 + images.length) % images.length;
    
    setCurrentIndex(newIndex);
    setSelectedImage(images[newIndex]);
  };

  const handleDownload = async (imageUrl, imageName) => {
    // API INTEGRATION POINT: Log download activity
    // Example API call: POST /api/analytics/image-download
    // Payload: { salonId, imageId, userId }
    console.log('Image download requested:', imageName);
    
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = imageName || 'salon-image.jpg';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Download failed:', error);
    }
  };

  const handleShare = async (image) => {
    // API INTEGRATION POINT: Track sharing activity
    // Example API call: POST /api/analytics/image-share
    // Payload: { salonId, imageId: image.id, userId, platform }
    console.log('Image share requested:', image.id);
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${salonName} - ${image.title}`,
          text: image.description,
          url: image.url
        });
      } catch (error) {
        console.log('Sharing cancelled or failed:', error);
      }
    } else {
      // Fallback: copy to clipboard
      await navigator.clipboard.writeText(image.url);
      alert('Image URL copied to clipboard!');
    }
  };

  // Group images by category for organized display
  const categorizedImages = images.reduce((acc, image, index) => {
    const category = image.category || 'General';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push({ ...image, originalIndex: index });
    return acc;
  }, {});

  const categories = Object.keys(categorizedImages);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Gallery</h2>
        <div className="text-sm text-gray-500">
          {images.length} photos
        </div>
      </div>

      {/* Category Sections */}
      {categories.map((category) => (
        <div key={category} className="mb-8">
          <h3 className="text-lg font-medium text-gray-800 mb-4">{category}</h3>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {categorizedImages[category].map((image) => (
              <div
                key={image.id}
                className="group relative aspect-square overflow-hidden rounded-lg cursor-pointer gallery-item"
                onClick={() => openLightbox(image, image.originalIndex)}
              >
                <img
                  src={image.url}
                  alt={image.title || `${salonName} photo`}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  loading="lazy"
                />
                
                {/* Overlay */}
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
                  <ZoomIn className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                
                {/* Image title overlay */}
                {image.title && (
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-3 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                    <p className="text-white text-sm font-medium truncate">{image.title}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Empty State */}
      {images.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <p className="text-gray-500 text-lg">No photos available</p>
          <p className="text-gray-400 text-sm mt-2">Gallery images will appear here once uploaded</p>
        </div>
      )}

      {/* Lightbox Modal */}
      {selectedImage && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center p-4 lightbox-overlay">
          <div className="relative max-w-4xl max-h-full">
            {/* Close Button */}
            <button
              onClick={closeLightbox}
              className="absolute top-4 right-4 z-10 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-all"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Navigation Buttons */}
            {images.length > 1 && (
              <>
                <button
                  onClick={() => navigateImage('prev')}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-all"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={() => navigateImage('next')}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-all"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </>
            )}

            {/* Image */}
            <img
              src={selectedImage.url}
              alt={selectedImage.title || `${salonName} photo`}
              className="max-w-full max-h-full object-contain rounded-lg"
            />

            {/* Image Info */}
            <div className="absolute bottom-4 left-4 right-4 bg-black bg-opacity-50 text-white p-4 rounded-lg">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  {selectedImage.title && (
                    <h3 className="font-medium text-lg mb-1">{selectedImage.title}</h3>
                  )}
                  {selectedImage.description && (
                    <p className="text-gray-300 text-sm">{selectedImage.description}</p>
                  )}
                  <div className="flex items-center text-gray-400 text-sm mt-2">
                    <span>{currentIndex + 1} of {images.length}</span>
                    {selectedImage.uploadDate && (
                      <span className="ml-4">
                        {new Date(selectedImage.uploadDate).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>
                
                {/* Action Buttons */}
                <div className="flex space-x-2 ml-4">
                  <button
                    onClick={() => handleDownload(selectedImage.url, selectedImage.title)}
                    className="p-2 bg-white bg-opacity-20 rounded-full hover:bg-opacity-30 transition-all"
                    title="Download image"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleShare(selectedImage)}
                    className="p-2 bg-white bg-opacity-20 rounded-full hover:bg-opacity-30 transition-all"
                    title="Share image"
                  >
                    <Share2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SalonGallery;
