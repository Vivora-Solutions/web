"use client";
import { useState } from "react";

// Mock HeaderWithSearchBar component for demo
const HeaderWithSearchBar = ({ searchTerm, setSearchTerm }) => (
  <div className="relative">
    <div className="relative flex items-center">
      <input
        type="text"
        placeholder="Search salons, services, or locations..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full px-6 py-4 pl-14 text-base bg-white/95 backdrop-blur-sm border-0 rounded-2xl shadow-xl focus:outline-none focus:ring-4 focus:ring-red-500/20 transition-all duration-300 placeholder-gray-500"
      />
      <div className="absolute left-5 text-gray-400">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m21 21-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>
      <button className="absolute right-2 bg-red-600 hover:bg-red-700 text-white px-6 py-2.5 rounded-xl font-medium transition-all duration-300 hover:shadow-lg">
        Search
      </button>
    </div>
  </div>
);

const HeroSection = ({ searchTerm = "", setSearchTerm = () => {}, salonCount = 247 }) => {
  return (
    <div className="relative min-h-[70vh] overflow-hidden bg-gradient-to-br from-white via-gray-50 to-red-50">
      {/* Sophisticated overlay with gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/5 via-transparent to-red-600/10"></div>
      
      {/* Premium geometric patterns */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-10 w-32 h-32 border border-red-600 rotate-45"></div>
        <div className="absolute bottom-32 right-20 w-24 h-24 border border-red-600 rotate-12"></div>
        <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-red-600 rotate-45"></div>
      </div>
      
      <div className="relative px-6 py-8 lg:py-20 z-10">
        {/* Desktop/Tablet Content */}
        <div className="hidden md:block max-w-5xl mx-auto text-center">
          {/* Premium status badge */}
          <div className="inline-flex items-center gap-3 bg-white/80 backdrop-blur-md rounded-full px-6 py-3 mb-8 shadow-lg border border-red-100">
            <div className="flex items-center gap-2">
              <div className="relative">
                <div className="w-3 h-3 bg-red-600 rounded-full"></div>
                <div className="absolute inset-0 w-3 h-3 bg-red-600 rounded-full animate-ping opacity-75"></div>
              </div>
              <span className="text-gray-800 font-semibold text-sm tracking-wide uppercase">
                {salonCount}+ Premium Salons
              </span>
            </div>
            <div className="w-1 h-4 bg-gray-300"></div>
            <span className="text-gray-600 text-sm font-medium">Available Now</span>
          </div>

          {/* Main heading with enhanced typography */}
          <div className="mb-6">
            <h1 className="text-4xl lg:text-6xl xl:text-7xl font-black text-gray-900 mb-4 leading-none tracking-tight">
              Discover Your
              <span className="block bg-gradient-to-r from-red-600 via-red-700 to-red-800 bg-clip-text text-transparent mt-2">
                Perfect Beauty
              </span>
              <span className="text-gray-900 block">Experience</span>
            </h1>
          </div>

          {/* Enhanced description */}
          <p className="text-gray-700 text-xl lg:text-2xl mb-12 max-w-3xl mx-auto font-light leading-relaxed">
            Connect with premium salons and skilled professionals. Book appointments instantly and transform your beauty routine with confidence.
          </p>

          {/* Trust indicators */}
          <div className="flex justify-center items-center gap-8 mb-12 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18l-8-8 8-8 8 8-8 8zm0-14.5L3.5 10 10 16.5 16.5 10 10 3.5z" />
              </svg>
              <span className="font-medium">Verified Professionals</span>
            </div>
            <div className="w-1 h-4 bg-gray-300"></div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="font-medium">Instant Booking</span>
            </div>
            <div className="w-1 h-4 bg-gray-300"></div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" />
              </svg>
              <span className="font-medium">Satisfaction Guaranteed</span>
            </div>
          </div>
        </div>

        {/* Mobile optimized heading */}
        <div className="md:hidden text-center mb-8">
          <h1 className="text-3xl font-black text-gray-900 mb-3 leading-tight">
            Your Perfect
            <span className="block text-red-600">Beauty Experience</span>
          </h1>
          <p className="text-gray-600 text-lg font-light">
            Premium salons at your fingertips
          </p>
        </div>

        {/* Enhanced search bar */}
        <div className="max-w-2xl mx-auto">
          <HeaderWithSearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
          
          {/* Quick action buttons below search */}
          <div className="flex flex-wrap justify-center gap-3 mt-6">
            {["Hair Styling", "Nail Care", "Facial", "Massage"].map((service, idx) => (
              <button
                key={idx}
                className="px-4 py-2 bg-white/70 hover:bg-white border border-red-100 rounded-xl text-gray-700 text-sm font-medium transition-all duration-300 hover:border-red-300 hover:shadow-md backdrop-blur-sm"
              >
                {service}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Premium animated elements */}
      <div className="hidden lg:block absolute top-20 left-10 w-96 h-96 opacity-10">
        <div className="w-full h-full bg-gradient-to-br from-red-400 to-red-600 rounded-full mix-blend-multiply filter blur-3xl animate-float"></div>
      </div>
      <div className="hidden lg:block absolute bottom-20 right-10 w-80 h-80 opacity-10">
        <div className="w-full h-full bg-gradient-to-br from-red-500 to-red-700 rounded-full mix-blend-multiply filter blur-3xl animate-float-delayed"></div>
      </div>
      <div className="hidden lg:block absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 opacity-5">
        <div className="w-full h-full bg-gradient-to-br from-gray-400 to-gray-600 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) rotate(5deg);
          }
        }
        
        @keyframes float-delayed {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(15px) rotate(-3deg);
          }
        }
        
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        
        .animate-float-delayed {
          animation: float-delayed 8s ease-in-out infinite 2s;
        }
      `}</style>
    </div>
  );
};

export default HeroSection;