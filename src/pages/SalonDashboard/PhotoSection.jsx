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
      <div className="p-6 bg-white rounded-xl shadow">Loading photos...</div>
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
