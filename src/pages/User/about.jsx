import React, { useState, useEffect } from 'react';
import { Scissors, Users, Shield, Heart, Sparkles, Clock, Star, TrendingUp } from 'lucide-react';
import Header from './components/Header';
import Footer from './components/Footer';
export default function About() {
  const [activeCard, setActiveCard] = useState(null);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const aboutPoints = [
    {
      icon: <Scissors className="w-8 h-8" />,
      title: "Premium Salon Network",
      subtitle: "Curated Excellence",
      text: "Connect with Sri Lanka's most trusted salons through our carefully vetted network. Every partner salon undergoes rigorous quality checks to ensure you receive exceptional service every time. From luxury spas to neighborhood favorites, discover your perfect beauty destination.",
      stats: "10+ Verified Salons",
      gradient: "from-gray-900 to-gray-700"
    },
    {
      icon: <Clock className="w-8 h-8" />,
      title: "Effortless Booking Experience", 
      subtitle: "Book in Seconds",
      text: "Say goodbye to busy phone lines and uncertain availability. Our intelligent booking system lets you reserve appointments 24/7, choose your preferred stylist, and even reschedule with ease. Get instant confirmations and never miss your beauty appointment again.",
      stats: "100+ Happy Bookings",
      gradient: "from-gray-800 to-black"
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: "Salon Success Platform",
      subtitle: "Grow Your Business",
      text: "Empower your salon with cutting-edge management tools. Track appointments, manage staff schedules, analyze customer preferences, and boost revenue with our comprehensive dashboard. We're not just a booking platform - we're your growth partner.",
      stats: "300% Average Growth",
      gradient: "from-black to-gray-900"
    },
    {
      icon: <Heart className="w-8 h-8" />,
      title: "Built by Beauty Enthusiasts",
      subtitle: "Passion Meets Innovation",
      text: "Founded by university students who experienced the frustration of unreliable salon bookings firsthand. We're not just solving a problem - we're revolutionizing how Sri Lanka experiences beauty services. Every feature is crafted with genuine care for both customers and salon owners.",
      stats: "Founded with ❤️",
      gradient: "from-gray-700 to-gray-900"
    }
  ];

  const floatingElements = Array.from({ length: 6 }, (_, i) => (
    <div
      key={i}
      className="absolute opacity-10"
      style={{
        left: `${20 + (i * 15)}%`,
        top: `${10 + (i * 20)}%`,
        transform: `translateY(${Math.sin(scrollY * 0.01 + i) * 20}px)`,
        animation: `float-${i} ${3 + i * 0.5}s ease-in-out infinite`
      }}
    >
      <Sparkles className="w-6 h-6 text-gray-300" />
    </div>
  ));

  return (
    <div>
      <Header />
    <section className="relative min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 overflow-hidden">
      {/* Floating Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        {floatingElements}
      </div>
      
      {/* Animated Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-900/5 to-transparent animate-pulse" />
      
      <div className="relative max-w-7xl mx-auto px-6 py-20">
        {/* Header Section */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-3 bg-black text-white px-8 py-3 rounded-full mb-8 shadow-2xl">
            <Sparkles className="w-5 h-5 animate-spin" />
            <span className="font-semibold tracking-wide">ABOUT SALONDORA</span>
          </div>
          
          <h2 className="text-6xl md:text-7xl font-black mb-6 leading-tight">
            <span className="bg-gradient-to-r from-gray-900 via-black to-gray-700 bg-clip-text text-transparent">
              Redefining
            </span>
            <br />
            <span className="text-gray-600">Beauty Experiences</span>
          </h2>
          
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Where cutting-edge technology meets traditional beauty care. 
            We're not just connecting you with salons – we're crafting the future of beauty services in Sri Lanka.
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {aboutPoints.map((point, index) => (
            <div
              key={index}
              className={`group relative bg-white rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 ${
                activeCard === index ? 'scale-105' : ''
              }`}
              onMouseEnter={() => setActiveCard(index)}
              onMouseLeave={() => setActiveCard(null)}
            >
              {/* Gradient Background */}
              <div className={`absolute inset-0 bg-gradient-to-br ${point.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />
              
              {/* Content */}
              <div className="relative p-8">
                {/* Icon & Stats */}
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <div className="p-4 bg-gradient-to-br from-gray-900 to-black text-white rounded-2xl shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300">
                      {point.icon}
                    </div>
                    <div>
                      <div className="text-sm font-bold text-gray-500 uppercase tracking-wider">
                        {point.subtitle}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold text-gray-900 bg-gray-100 px-3 py-1 rounded-full">
                      {point.stats}
                    </div>
                  </div>
                </div>

                {/* Title */}
                <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-black transition-colors">
                  {point.title}
                </h3>

                {/* Description */}
                <p className="text-gray-600 leading-relaxed text-lg">
                  {point.text}
                </p>

                {/* Animated Bottom Border */}
                <div className="absolute bottom-0 left-8 right-8 h-1 bg-gradient-to-r from-transparent via-gray-900 to-transparent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 rounded-full" />
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA Section */}
        <div className="text-center bg-gradient-to-r from-gray-900 via-black to-gray-900 text-white rounded-3xl p-12 shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-pulse" />
          <div className="relative">
            <div className="flex justify-center gap-4 mb-6">
              <Users className="w-8 h-8" />
              <Shield className="w-8 h-8" />
              <Star className="w-8 h-8" />
            </div>
            <h3 className="text-3xl font-bold mb-4">
              Ready to Transform Your Beauty Journey?
            </h3>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Join thousands of satisfied customers and hundreds of thriving salons. 
              Experience the future of beauty booking today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
             <a href='/'>
              <button className="bg-white text-gray-900 px-8 py-4 rounded-full font-bold hover:bg-gray-100 transform hover:scale-105 transition-all duration-300 shadow-lg">
                Book Your Appointment
              </button>
             </a>
              
              <a href='/salon-register  '>
              
              <button className="border-2 border-white text-white px-8 py-4 rounded-full font-bold hover:bg-white hover:text-gray-900 transform hover:scale-105 transition-all duration-300">
                Partner With Us
              </button>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Custom Animations */}
      <style jsx>{`
        @keyframes float-0 { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-20px); } }
        @keyframes float-1 { 0%, 100% { transform: translateY(-10px); } 50% { transform: translateY(-30px); } }
        @keyframes float-2 { 0%, 100% { transform: translateY(-5px); } 50% { transform: translateY(-25px); } }
        @keyframes float-3 { 0%, 100% { transform: translateY(-15px); } 50% { transform: translateY(-35px); } }
        @keyframes float-4 { 0%, 100% { transform: translateY(-8px); } 50% { transform: translateY(-28px); } }
        @keyframes float-5 { 0%, 100% { transform: translateY(-12px); } 50% { transform: translateY(-32px); } }
      `}</style>
    </section>
    <Footer />
    </div>
  );
}