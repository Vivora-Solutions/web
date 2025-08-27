import { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Info, Calendar, Image, Scissors, Users, Monitor } from "lucide-react";
import { ProtectedAPI } from "../../utils/api";
import Header from "./components/Header";
import Sidebar from "../../components/Sidebar";
import SalonInfo from "./SalonInfo";

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
      <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50">
        <div className="w-10 h-10 border-4 border-gray-300 border-t-black rounded-full animate-spin mb-4"></div>
        <p className="text-black text-lg font-medium">Loading your salon dashboard...</p>
        
        {/* Optional: Themed loading buttons */}
        <div className="mt-6 flex space-x-4">
          <button className="px-4 py-2 border border-black text-black bg-white rounded">
            Edit Booking
          </button>
          <button className="px-4 py-2 bg-red-600 text-white rounded">
            Cancel Booking
          </button>
          <button className="px-4 py-2 bg-black text-white rounded">
            Confirm
          </button>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-white to-gray-100">
        <Header />
        <div className="flex-1 flex flex-col items-center justify-center text-center px-4 py-12">
          <h1 className="text-5xl font-extrabold text-indigo-600 mb-4 drop-shadow-sm">
            Welcome to <span className="text-gray-800">Salon Booking Platform</span>
          </h1>
          <p className="text-gray-600 mb-8 max-w-2xl text-lg">
            Discover and manage your salon services, bookings, and more. Log in to get started.
          </p>
          <div className="relative w-full max-w-5xl">
            <img
              src="https://images.unsplash.com/photo-1588776814546-ec7d3fc94238?ixlib=rb-4.0.3&auto=format&fit=crop&w=1400&q=80"
              alt="Banner"
              className="rounded-3xl shadow-2xl w-full h-96 object-cover"
            />
            <div className="absolute inset-0 rounded-3xl ring-2 ring-indigo-200 blur-xl opacity-40"></div>
          </div>
        </div>
      </div>
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
      </div>
  );
};

export default SalonDashboard;