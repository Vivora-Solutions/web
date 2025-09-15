import { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Info, Calendar, Image, Scissors, Users, Monitor, LogIn } from "lucide-react";
import { ProtectedAPI } from "../../utils/api";
import Header from "./components/Header";
import Footer from "../User/components/Footer";
import Sidebar from "../../components/Sidebar";
import SalonInfo from "./SalonInfo";
import Login from "../Login/Login";

const SECTIONS = [
  { label: "Salon Info", icon: <Info size={20} />, path: "/admin" },
  { label: "Opening Hours", icon: <Calendar size={20} />, path: "/admin/opening-hours" },
  { label: "Gallery", icon: <Image size={20} />, path: "/admin/gallery" },
  { label: "Services", icon: <Scissors size={20} />, path: "/admin/services" },
  { label: "Stylists", icon: <Users size={20} />, path: "/admin/stylists" },
  { label: "Workstations", icon: <Monitor size={20} />, path: "/admin/workstations" },
  { label: "Booking Schedules", icon: <Calendar size={20} />, path: "/admin/booking-schedules" },
];

const SalonDashboard = () => {
  const [salonData, setSalonData] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const location = useLocation();
  const activeIndex = SECTIONS.findIndex((section) =>
    section.path === "/admin"
      ? location.pathname === "/admin"
      : location.pathname.startsWith(section.path)
  );


  useEffect(() => {
    const checkAuthAndFetchSalon = async () => {
      try {
        const res = await ProtectedAPI.get("/salon-admin/my");
        setSalonData(res.data);
        setIsAuthenticated(true);
      } catch (err) {
        setIsAuthenticated(false);
      }
    };

    checkAuthAndFetchSalon();
  }, []);

  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-50 via-orange-50 to-amber-50 flex items-center justify-center p-4">
        <div className="w-full max-w-7xl mx-auto bg-white/80 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-white/20">
          
          {/* Loading Header */}
          <div className="mb-8 text-center">
            <div className="relative inline-block">
              {/* Animated Salon Dashboard Icon */}
              <div className="w-24 h-24 mx-auto mb-4 relative">
                <div className="absolute inset-0 bg-gradient-to-r from-rose-400 via-orange-400 to-amber-500 rounded-full animate-pulse"></div>
                <div className="absolute inset-2 bg-white rounded-full flex items-center justify-center">
                  {/* Salon Building Icon */}
                  <svg className="w-12 h-12 text-orange-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 3L2 12h3v8h14v-8h3L12 3zm0 2.3l6 5.4v8.3h-3v-6H9v6H6v-8.3l6-5.4z"/>
                  </svg>
                </div>
                
                {/* Rotating border */}
                <div className="absolute inset-0 border-4 border-transparent border-t-rose-500 rounded-full animate-spin"></div>
              </div>
              
              {/* Floating dashboard-related icons */}
              <div className="absolute -top-6 -left-6 w-10 h-10 bg-rose-100 rounded-full flex items-center justify-center animate-bounce" style={{animationDelay: '0s'}}>
                🏢
              </div>
              <div className="absolute -top-6 -right-6 w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center animate-bounce" style={{animationDelay: '0.5s'}}>
                📊
              </div>
              <div className="absolute -bottom-6 -left-6 w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center animate-bounce" style={{animationDelay: '1s'}}>
                ⚙️
              </div>
              <div className="absolute -bottom-6 -right-6 w-10 h-10 bg-rose-100 rounded-full flex items-center justify-center animate-bounce" style={{animationDelay: '1.5s'}}>
                👥
              </div>
            </div>
            
            <h1 className="text-3xl font-bold text-gray-800 mb-3 animate-fade-in">
              Loading Salon Dashboard
            </h1>
            <p className="text-gray-600 text-lg animate-fade-in-delay">
              Preparing your complete salon management system...
            </p>
            
            {/* Dashboard sections preview */}
            <div className="flex flex-wrap justify-center gap-3 mt-6 animate-fade-in-delay-2">
              {[
                { name: 'Salon Info', emoji: 'ℹ️', color: 'bg-rose-100 text-rose-600' },
                { name: 'Opening Hours', emoji: '🕐', color: 'bg-orange-100 text-orange-600' },
                { name: 'Gallery', emoji: '🖼️', color: 'bg-amber-100 text-amber-600' },
                { name: 'Services', emoji: '✂️', color: 'bg-emerald-100 text-emerald-600' },
                { name: 'Staff', emoji: '👥', color: 'bg-blue-100 text-blue-600' },
                { name: 'Workstations', emoji: '🖥️', color: 'bg-purple-100 text-purple-600' },
                { name: 'Bookings', emoji: '📅', color: 'bg-pink-100 text-pink-600' }
              ].map((section, index) => (
                <div 
                  key={section.name} 
                  className={`px-4 py-2 rounded-full text-sm font-medium ${section.color} animate-pulse shadow-sm`}
                  style={{animationDelay: `${index * 0.15}s`}}
                >
                  <span className="mr-2">{section.emoji}</span>
                  {section.name}
                </div>
              ))}
            </div>
          </div>

          {/* Dashboard Layout Preview */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
            
            {/* Sidebar Preview */}
            <div className="lg:col-span-1 space-y-3">
              <div className="bg-white/95 backdrop-blur rounded-xl p-4 shadow-lg">
                <div className="h-6 bg-gray-200 rounded w-32 mb-4 animate-pulse"></div>
                {[...Array(7)].map((_, index) => (
                  <div key={index} className="flex items-center space-x-3 p-2 mb-2 animate-pulse" style={{animationDelay: `${index * 0.1}s`}}>
                    <div className="w-5 h-5 bg-gray-200 rounded"></div>
                    <div className="h-4 bg-gray-200 rounded flex-1"></div>
                  </div>
                ))}
              </div>
            </div>

            {/* Main Content Preview */}
            <div className="lg:col-span-3 space-y-6">
              
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { icon: '📈', title: 'Daily Revenue', color: 'bg-green-100', iconColor: 'bg-green-200' },
                  { icon: '👥', title: 'Active Clients', color: 'bg-blue-100', iconColor: 'bg-blue-200' },
                  { icon: '📅', title: 'Today\'s Bookings', color: 'bg-purple-100', iconColor: 'bg-purple-200' }
                ].map((stat, index) => (
                  <div key={index} className={`${stat.color} rounded-xl p-6 shadow-lg animate-pulse`} style={{animationDelay: `${index * 0.2}s`}}>
                    <div className="flex items-center justify-between mb-4">
                      <div className={`w-12 h-12 ${stat.iconColor} rounded-full flex items-center justify-center text-2xl animate-bounce`}>
                        {stat.icon}
                      </div>
                      <div className="h-8 bg-white/70 rounded w-16 animate-shimmer"></div>
                    </div>
                    <div className="h-4 bg-white/60 rounded w-24 animate-shimmer"></div>
                  </div>
                ))}
              </div>

              {/* Main Content Area */}
              <div className="bg-white/95 backdrop-blur rounded-xl p-6 shadow-lg">
                <div className="flex justify-between items-center mb-6">
                  <div className="space-y-2">
                    <div className="h-8 bg-gray-200 rounded w-48 animate-pulse"></div>
                    <div className="h-4 bg-gray-200 rounded w-64 animate-pulse"></div>
                  </div>
                  <div className="h-10 bg-gradient-to-r from-rose-200 to-orange-200 rounded-lg w-32 animate-pulse"></div>
                </div>

                {/* Content Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[...Array(4)].map((_, index) => (
                    <div key={index} className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-4 animate-pulse" style={{animationDelay: `${index * 0.1}s`}}>
                      <div className="flex items-center mb-3">
                        <div className="w-10 h-10 bg-gray-200 rounded-full mr-3"></div>
                        <div className="flex-1">
                          <div className="h-4 bg-gray-200 rounded w-3/4 mb-1"></div>
                          <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="h-3 bg-gray-200 rounded w-full"></div>
                        <div className="h-3 bg-gray-200 rounded w-4/5"></div>
                        <div className="h-3 bg-gray-200 rounded w-3/5"></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Loading Status */}
          <div className="text-center py-8">
            <div className="relative w-32 h-32 mx-auto mb-6">
              <div className="absolute inset-0 bg-gradient-to-br from-rose-200 to-amber-200 rounded-full animate-pulse"></div>
              <div className="absolute inset-4 bg-white rounded-full flex items-center justify-center">
                <div className="text-4xl animate-bounce">🏪</div>
              </div>
              {/* Surrounding management icons */}
              <div className="absolute -top-3 -left-3 w-10 h-10 bg-rose-100 rounded-full flex items-center justify-center text-lg animate-bounce" style={{animationDelay: '0.2s'}}>
                ✂️
              </div>
              <div className="absolute -top-3 -right-3 w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center text-lg animate-bounce" style={{animationDelay: '0.4s'}}>
                💅
              </div>
              <div className="absolute -bottom-3 -left-3 w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center text-lg animate-bounce" style={{animationDelay: '0.6s'}}>
                💇‍♀️
              </div>
              <div className="absolute -bottom-3 -right-3 w-10 h-10 bg-rose-100 rounded-full flex items-center justify-center text-lg animate-bounce" style={{animationDelay: '0.8s'}}>
                🧴
              </div>
            </div>
            
            <div className="h-6 bg-gradient-to-r from-rose-200 to-orange-200 rounded-lg w-64 mx-auto mb-3 animate-shimmer"></div>
            <div className="h-4 bg-gray-200 rounded w-80 mx-auto mb-6 animate-shimmer" style={{animationDelay: '0.1s'}}></div>
            
            {/* Loading progress */}
            <div className="w-80 mx-auto bg-gray-200 rounded-full h-2 mb-4">
              <div className="bg-gradient-to-r from-rose-400 to-orange-400 h-2 rounded-full animate-pulse" style={{width: '60%'}}></div>
            </div>
            
            <p className="text-sm text-gray-500 animate-fade-in-delay">
              Setting up your salon management workspace...
            </p>
          </div>

          {/* Progress Indicators */}
          <div className="flex justify-center space-x-3 mt-8">
            <div className="w-3 h-3 bg-rose-400 rounded-full animate-bounce" style={{animationDelay: '0s'}}></div>
            <div className="w-3 h-3 bg-orange-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
            <div className="w-3 h-3 bg-amber-400 rounded-full animate-bounce" style={{animationDelay: '0.4s'}}></div>
            <div className="w-3 h-3 bg-emerald-400 rounded-full animate-bounce" style={{animationDelay: '0.6s'}}></div>
            <div className="w-3 h-3 bg-blue-400 rounded-full animate-bounce" style={{animationDelay: '0.8s'}}></div>
          </div>

          {/* Custom animations */}
          <style jsx>{`
            @keyframes fade-in {
              from { opacity: 0; transform: translateY(15px); }
              to { opacity: 1; transform: translateY(0); }
            }
            
            @keyframes fade-in-delay {
              0% { opacity: 0; transform: translateY(15px); }
              50% { opacity: 0; transform: translateY(15px); }
              100% { opacity: 1; transform: translateY(0); }
            }
            
            @keyframes fade-in-delay-2 {
              0% { opacity: 0; transform: translateY(15px); }
              66% { opacity: 0; transform: translateY(15px); }
              100% { opacity: 1; transform: translateY(0); }
            }
            
            @keyframes shimmer {
              0% { 
                background-position: -200% 0;
                opacity: 0.7;
              }
              100% { 
                background-position: 200% 0;
                opacity: 1;
              }
            }
            
            .animate-fade-in {
              animation: fade-in 1.2s ease-out;
            }
            
            .animate-fade-in-delay {
              animation: fade-in-delay 2.4s ease-out;
            }
            
            .animate-fade-in-delay-2 {
              animation: fade-in-delay-2 3.6s ease-out;
            }
            
            .animate-shimmer {
              background: linear-gradient(90deg, transparent, rgba(255,255,255,0.9), transparent);
              background-size: 200% 100%;
              animation: shimmer 2.5s ease-in-out infinite;
            }
          `}</style>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <Login />
    );
  }

  // Logged in - show dashboard with conditional content
  const isRootPath = location.pathname === "/admin";

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
    <Header /> 
    <div className="flex flex-1 pt-[70px] h-[calc(100vh-60px)]">
          <Sidebar items={SECTIONS} activeIndex={activeIndex} />
          <main className="flex-1 p-1 overflow-y-auto">
            {isRootPath ? <SalonInfo /> : <Outlet />}
          </main>
        </div>
        <Footer />
      </div>
  );
};

export default SalonDashboard;