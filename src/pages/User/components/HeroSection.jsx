"use client"
"use client";
import HeaderWithSearchBar from "./HeaderWithSearchBar";

const HeroSection = ({ searchTerm, setSearchTerm, salonCount }) => {
  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-white via-[#fdfbfb] to-gray-200">
      {/* Subtle dark overlay for contrast */}
    <div className="absolute inset-0 bg-black md:bg-black/10"></div>

      <div className="relative px-6 py-1 lg:py-16 z-10">
        {/* Desktop/Tablet Content */}
        <div className="hidden md:block max-w-4xl mx-auto text-center">
          {/* Status Indicator */}
          <div className="inline-flex items-center gap-2 bg-black/10 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-black text-sm font-medium">
              {salonCount} salons available now
            </span>
          </div>

          {/* Main Heading */}
          <h1 className="text-3xl lg:text-5xl font-bold text-black mb-4 leading-tight">
            Discover Your Perfect
            <span className="block text-white px-4 py-2 rounded bg-gradient-to-r from-black via-gray-900 to-black shadow-md mt-2">
              Beauty Experience
            </span>
          </h1>

          {/* Description */}
          <p className="text-gray-700 text-lg lg:text-xl mb-8 max-w-2xl mx-auto">
            Find and book appointments at the best salons near you with just a few clicks.
          </p>
        </div>

        {/* Search Bar - always visible */}
        <div className="max-w-2xl mx-auto">
          <HeaderWithSearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        </div>
      </div>

      {/* Animated Blobs - only visible on md+ */}
      <div className="hidden md:block absolute top-0 left-0 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
      <div className="hidden md:block absolute top-0 right-0 w-72 h-72 bg-red-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
      <div className="hidden md:block absolute -bottom-8 left-20 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>

      <style jsx>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
};

export default HeroSection;
