import HeaderWithSearchBar from "./HeaderWithSearchBar";
import { Star } from "lucide-react";

const HeroSection = ({ searchTerm, setSearchTerm, salonCount }) => {
  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-[#fff9f9] via-[#fdfbfb] to-gray-200">
      {/* Gradient overlay for depth */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/80 to-white/40"></div>

      <div className="relative z-10 px-4 sm:px-6 lg:px-8 py-4 md:py-16">
        {/* Desktop/Tablet Hero */}
        <div className="hidden md:flex flex-col items-center text-center max-w-5xl mx-auto">
     

          {/* Main Headline */}
          <h1 className="text-4xl lg:text-6xl font-extrabold text-gray-900 leading-tight">
            Elevate Your Look with  
            <span className="block mt-2 bg-gradient-to-r from-red-500 via-pink-500 to-orange-400 text-transparent bg-clip-text">
              Top-Rated Salons
            </span>
          </h1>

          {/* Subtext */}
          <p className="text-gray-700 text-lg lg:text-xl mt-4 max-w-2xl">
            Book your appointment in seconds, skip the waiting, and enjoy the beauty you deserve.
          </p>

          {/* Customer Trust */}
          {/* <div className="flex items-center gap-2 mt-6 pb-6">
            <div className="flex text-yellow-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-5 h-5 fill-current" />
              ))}
            </div>
            <span className="text-gray-600 text-sm">Rated 4.9/5 by 1,200+ happy clients</span>
          </div> */}

          {/* CTA */}
          <button className="mt-8 px-8 py-3 bg-gradient-to-r from-red-500 via-pink-500 to-orange-400 text-white rounded-full font-semibold shadow-lg hover:scale-105 transition-transform duration-200">
            Explore Salons
          </button>

               {/* Status Badge */}
          <div className="inline-flex items-center gap-2 bg-black/5 backdrop-blur-sm rounded-full px-5 py-2 shadow-md m-6 border border-gray-200">
            <div className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-gray-700 text-sm font-medium">
              {salonCount} salons available now
            </span>
          </div>
        </div>

        {/* Search Bar - Always Visible */}
        <div className="max-w-2xl mx-auto mt-4 md:mt-10">
          <HeaderWithSearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        </div>
      </div>

      {/* Animated Decorative Elements (Desktop Only) */}
      <div className="hidden md:block absolute top-0 left-0 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-2xl opacity-20 animate-blob"></div>
      <div className="hidden md:block absolute top-0 right-0 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-2xl opacity-20 animate-blob animation-delay-2000"></div>
      <div className="hidden md:block absolute -bottom-10 left-20 w-72 h-72 bg-red-300 rounded-full mix-blend-multiply filter blur-2xl opacity-20 animate-blob animation-delay-4000"></div>

      <style >{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob { animation: blob 7s infinite; }
        .animation-delay-2000 { animation-delay: 2s; }
        .animation-delay-4000 { animation-delay: 4s; }
      `}</style>
    </div>
  );
};

export default HeroSection;
