import React, { useState, useEffect } from "react";
import { ProtectedAPI } from "../../utils/api";
import supabase from "../../utils/supabaseClient"; // Adjust the import path as needed

const PhotoSection = () => {
  const [photos, setPhotos] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  // central fetch function (can be reused)
  const fetchImages = async () => {
    setIsLoading(true);
    try {
      const response = await ProtectedAPI.get("/salon-admin/images");
      setPhotos(response.data.images);
    } catch (error) {
      console.error("Error fetching images:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchImages();
  }, []);

  const handleAddPhoto = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    setUploading(true);

    try {
      for (const file of files) {
        if (file && file.type.startsWith("image/")) {
          const fileName = `${Date.now()}-${file.name}`;

          // Upload to Supabase bucket
          const { error } = await supabase.storage
            .from("salon-images")
            .upload(fileName, file);

          if (error) throw error;

          // Get public URL
          const { data: urlData } = supabase.storage
            .from("salon-images")
            .getPublicUrl(fileName);

          const imageUrl = urlData.publicUrl;

          // Save to your backend DB
          await ProtectedAPI.post("/salon-admin/images", {
            image_link: imageUrl,
          });
        }
      }

      // ✅ reload gallery from backend after upload
      await fetchImages();
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Failed to upload image");
    } finally {
      setUploading(false);
    }
  };

  const handleRemovePhoto = async (index) => {
    if (!photos[index]?.image_id) return;

    // ✅ confirmation popup
    const confirmDelete = window.confirm("Are you sure you want to delete this photo?");
    if (!confirmDelete) return;

    try {
      await ProtectedAPI.delete(`/salon-admin/images/${photos[index].image_id}`);

      const updatedPhotos = photos.filter((_, i) => i !== index);
      setPhotos(updatedPhotos);
      if (currentIndex >= updatedPhotos.length) {
        setCurrentIndex(Math.max(0, updatedPhotos.length - 1));
      }
    } catch (error) {
      console.error("Error deleting image:", error);
      alert("Failed to delete image");
    }
  };

  const goToSlide = (index) => setCurrentIndex(index);
  const nextSlide = () => setCurrentIndex((currentIndex + 1) % photos.length);
  const prevSlide = () => setCurrentIndex((currentIndex - 1 + photos.length) % photos.length);

  if (isLoading) {
    return (
      <div className="p-6 bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 rounded-xl shadow-lg border border-gray-200">
        {/* Loading Header */}
        <div className="mb-8 text-center">
          <div className="relative inline-block">
            {/* Animated Camera Icon */}
            <div className="w-16 h-16 mx-auto mb-4 relative">
              <div className="absolute inset-0 bg-gradient-to-r from-pink-400 to-purple-500 rounded-xl animate-pulse"></div>
              <div className="absolute inset-1 bg-white rounded-xl flex items-center justify-center">
                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              
              {/* Rotating border */}
              <div className="absolute inset-0 border-4 border-transparent border-t-pink-500 rounded-xl animate-spin"></div>
            </div>
            
            {/* Floating photo indicators */}
            <div className="absolute -top-2 -left-2 w-3 h-3 bg-pink-400 rounded-full animate-bounce" style={{animationDelay: '0s'}}></div>
            <div className="absolute -top-2 -right-2 w-3 h-3 bg-purple-400 rounded-full animate-bounce" style={{animationDelay: '0.5s'}}></div>
            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-indigo-400 rounded-full animate-bounce" style={{animationDelay: '1s'}}></div>
          </div>
          
          <h2 className="text-xl font-semibold text-gray-800 mb-2 animate-fade-in">
            Loading Your Photos
          </h2>
          <p className="text-gray-600 animate-fade-in-delay">
            Fetching your salon's gallery...
          </p>
        </div>

        {/* Upload Section Skeleton */}
        <div className="mb-6">
          <div className="flex overflow-x-auto gap-4 pb-4">
            {/* Upload button skeleton */}
            <div className="w-28 h-28 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center flex-shrink-0 animate-pulse">
              <div className="text-center">
                <div className="w-8 h-8 bg-gray-300 rounded-full mx-auto mb-2"></div>
                <div className="h-3 bg-gray-300 rounded w-16"></div>
              </div>
            </div>

            {/* Photo thumbnail skeletons */}
            {[...Array(5)].map((_, index) => (
              <div key={index} className="relative flex-shrink-0 p-1">
                <div 
                  className="w-28 h-28 bg-gray-200 rounded-lg animate-pulse" 
                  style={{animationDelay: `${index * 0.2}s`}}
                ></div>
                <div className="absolute top-1 right-1 w-6 h-6 bg-gray-300 rounded-full animate-pulse"></div>
              </div>
            ))}
          </div>
        </div>

        {/* Main Preview Skeleton */}
        <div className="mb-6">
          <div className="relative flex items-center bg-gray-100 rounded-lg p-4">
            <div className="w-10 h-10 rounded-full bg-gray-300 animate-pulse"></div>
            <div className="flex-1 flex justify-center mx-4">
              <div className="w-full max-w-md h-48 bg-gray-200 rounded-md animate-pulse"></div>
            </div>
            <div className="w-10 h-10 rounded-full bg-gray-300 animate-pulse"></div>
          </div>
        </div>

        {/* Dots Skeleton */}
        <div className="flex justify-center gap-2 mb-6">
          {[...Array(5)].map((_, index) => (
            <div 
              key={index} 
              className="w-3 h-3 bg-gray-300 rounded-full animate-pulse" 
              style={{animationDelay: `${index * 0.1}s`}}
            ></div>
          ))}
        </div>

        {/* Progress Indicators */}
        <div className="flex justify-center space-x-2 mt-8">
          <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce" style={{animationDelay: '0s'}}></div>
          <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
          <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{animationDelay: '0.4s'}}></div>
          <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce" style={{animationDelay: '0.6s'}}></div>
        </div>

        {/* Custom animations */}
        <style jsx>{`
          @keyframes fade-in {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
          
          @keyframes fade-in-delay {
            0% { opacity: 0; transform: translateY(10px); }
            50% { opacity: 0; transform: translateY(10px); }
            100% { opacity: 1; transform: translateY(0); }
          }
          
          .animate-fade-in {
            animation: fade-in 1s ease-out;
          }
          
          .animate-fade-in-delay {
            animation: fade-in-delay 2s ease-out;
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white rounded-xl shadow">
      <h2 className="text-xl font-semibold mb-4">Your Photos</h2>
      <div className="flex flex-col gap-6">
        {/* Upload */}
        <div className="flex overflow-x-auto gap-4 pb-4">
          <div className="w-28 h-28 border-2 border-dashed rounded-lg flex items-center justify-center text-gray-500 flex-shrink-0 relative hover:border-blue-500 hover:text-blue-500 transition">
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleAddPhoto}
              className="hidden"
              id="photo-upload"
              disabled={uploading}
            />
            <label
              htmlFor="photo-upload"
              className="w-full h-full flex flex-col items-center justify-center cursor-pointer"
            >
              {uploading ? (
                <div className="animate-spin h-12 w-12 border-b-2 border-indigo-600 rounded-full mx-auto mt-8 mb-4"></div>
              ) : (
                <>
                  <span className="text-3xl mb-1">+</span>
                  <p className="text-xs">Add Photos</p>
                </>
              )}
            </label>
          </div>

          {/* Thumbnails */}
          {photos.map((photo, index) => (
            <div key={photo.image_id} className="relative flex-shrink-0 p-1">
              <img
                src={photo.image_link}
                alt={`Salon ${index}`}
                className={`w-28 h-28 object-cover rounded-lg cursor-pointer transition border-2 ${
                  index === currentIndex
                    ? "border-blue-500 shadow-lg"
                    : "border-transparent"
                }`}
                onClick={() => goToSlide(index)}
              />
              <button
                className="absolute top-1 right-1 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold shadow"
                onClick={() => handleRemovePhoto(index)}
                disabled={uploading}
              >
                ×
              </button>
            </div>
          ))}
        </div>

        {/* Main preview */}
        {photos.length > 0 && (
          <div className="relative flex items-center bg-gray-100 rounded-lg p-4">
            <button
              onClick={prevSlide}
              className="w-10 h-10 rounded-full bg-black bg-opacity-60 text-white flex items-center justify-center text-lg"
              disabled={uploading}
            >
              ‹
            </button>
            <div className="flex-1 flex justify-center">
              <img
                src={photos[currentIndex]?.image_link}
                alt={`Main Salon ${currentIndex}`}
                className="max-w-full max-h-[300px] object-contain rounded-md shadow"
              />
            </div>
            <button
              onClick={nextSlide}
              className="w-10 h-10 rounded-full bg-black bg-opacity-60 text-white flex items-center justify-center text-lg"
              disabled={uploading}
            >
              ›
            </button>
          </div>
        )}

        {/* Dots */}
        {photos.length > 1 && (
          <div className="flex justify-center gap-2">
            {photos.map((_, idx) => (
              <button
                key={photos[idx].image_id}
                onClick={() => goToSlide(idx)}
                disabled={uploading}
                className={`w-3 h-3 rounded-full ${
                  currentIndex === idx ? "bg-blue-500" : "bg-gray-300"
                } transition`}
              ></button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PhotoSection;
