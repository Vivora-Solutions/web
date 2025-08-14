import React, { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const SalonImageGallery = ({ banner_images = [] }) => {
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const goToNextImage = () => {
    setActiveImageIndex((prevIndex) => (prevIndex + 1) % banner_images.length);
  };

  const goToPreviousImage = () => {
    setActiveImageIndex(
      (prevIndex) => (prevIndex - 1 + banner_images.length) % banner_images.length
    );
  };

  if (banner_images.length === 0) {
    return (
      <div className="flex items-center justify-center w-full h-72 md:h-[36rem] bg-gray-100 rounded-2xl shadow-lg overflow-hidden">
        <img
          src="https://via.placeholder.com/1200x300"
          alt="Default Banner"
          className="w-full h-full object-cover"
        />
      </div>
    );
  }

  if (banner_images.length === 1) {
    return (
      <div className="flex items-center justify-center w-full h-72 md:h-[36rem] bg-gray-100 rounded-2xl shadow-lg overflow-hidden">
        <img
          src={banner_images[0].image_link}
          alt="Salon Banner"
          className="w-full h-full object-cover rounded-2xl"
        />
      </div>
    );
  }

  return (
    <div className="relative bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-gray-100 p-4 flex flex-col md:flex-row gap-4 w-full h-auto md:h-[36rem] overflow-hidden">
      {/* Left: Main Image */}
      <div className="w-full md:w-2/3 relative flex items-center justify-center h-72 md:h-full rounded-2xl overflow-hidden group">
        <img
          src={banner_images[activeImageIndex].image_link}
          alt={`Banner ${activeImageIndex + 1}`}
          className="w-full h-full object-cover transition-all duration-500 ease-in-out transform group-hover:scale-105 rounded-2xl"
        />

        {/* Navigation Arrows */}
        <button
          onClick={goToPreviousImage}
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-black/70 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-75"
          aria-label="Previous image"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button
          onClick={goToNextImage}
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-black/70 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-75"
          aria-label="Next image"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>

      {/* Right: Thumbnails (Scrollable) */}
      <div className="w-full md:w-1/3 flex flex-col gap-3 h-72 md:h-full overflow-y-auto pr-2">
        {banner_images.map((img, index) => (
          <div key={index} className="flex-1 min-h-0">
            <img
              src={img.image_link}
              alt={`Thumbnail ${index + 1}`}
              onClick={() => setActiveImageIndex(index)}
              className={`cursor-pointer object-cover rounded-xl border-2 w-full h-full transition-all duration-300 transform hover:scale-[1.02] hover:shadow-md ${
                activeImageIndex === index
                  ? "border-gray-800 ring-2 ring-gray-800 shadow-lg"
                  : "border-gray-200 hover:border-gray-400"
              }`}
              style={{
                objectPosition: "center",
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default SalonImageGallery;
