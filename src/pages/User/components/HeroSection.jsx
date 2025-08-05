"use client"

import HeaderWithSearchBar from "./HeaderWithSearchBar"

const HeroSection = ({ searchTerm, setSearchTerm, salonCount }) => {
  return (
    <div className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600"></div>
      <div className="absolute inset-0 bg-black/20"></div>
      <div className="relative px-6 py-12 lg:py-16">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-white/90 text-sm font-medium">{salonCount} salons available now</span>
          </div>
          <h1 className="text-3xl lg:text-5xl font-bold text-white mb-4 leading-tight">
            Discover Your Perfect
            <span className="block bg-gradient-to-r from-yellow-300 to-pink-300 bg-clip-text text-transparent">
              Beauty Experience
            </span>
          </h1>
          <p className="text-white/80 text-lg lg:text-xl mb-8 max-w-2xl mx-auto">
            Find and book appointments at the best salons near you with just a few clicks
          </p>
        </div>
        <div className="max-w-2xl mx-auto">
          <HeaderWithSearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        </div>
      </div>
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
      <div className="absolute top-0 right-0 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-8 left-20 w-72 h-72 bg-indigo-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>

      <style jsx>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
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
  )
}

export default HeroSection
