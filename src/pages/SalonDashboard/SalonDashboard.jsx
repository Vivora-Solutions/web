import { useEffect, useState } from "react";
import { Info, Calendar, Image, Scissors, Users, Monitor } from "lucide-react";

import API from "../../utils/api";
import Header from "../../components/Header/Header";
import Sidebar from "../../components/Sidebar/Sidebar";
import SalonInfo from "./components/SalonInfo";
import OpeningDays from "./components/OpeningDays";
import PhotoSection from "./components/PhotoSection";
import ServiceManagement from "./components/ServiceManagement";
import StylistManagement from "./components/StylistManagement";
import WorkStationManagement from "./components/WorkStationManagement";
import SchedulingInterface from "./components/SchedulingInterface/SchedulingInterface";
import StylistScheduleManager from "./components/ScheduleModal";

const SECTIONS = [
  { label: "Salon Info", icon: <Info size={20} />, component: <SalonInfo /> },
  { label: "Opening Hours", icon: <Calendar size={20} />, component: <OpeningDays /> },
  { label: "Gallery", icon: <Image size={20} />, component: <PhotoSection /> },
  { label: "Services", icon: <Scissors size={20} />, component: <ServiceManagement /> },
  { label: "Stylists", icon: <Users size={20} />, component: <StylistManagement /> },
  { label: "Workstations", icon: <Monitor size={20} />, component: <WorkStationManagement /> },
  { label: "Booking Schedules", icon: <Calendar size={20} />, component: <SchedulingInterface /> },
];

const SalonDashboard = () => {
  const [salonData, setSalonData] = useState(null);
  const [activeSection, setActiveSection] = useState(0);

  useEffect(() => {
    const fetchSalon = async () => {
      try {
        const res = await API.get("/salon-admin/my");
        setSalonData(res.data);
      } catch (err) {
        console.error("Error fetching salon:", err);
      }
    };
    fetchSalon();
  }, []);

  if (!salonData) {
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

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <div className="flex flex-1 h-[calc(100vh-60px)]">
        <Sidebar
          items={SECTIONS}
          activeIndex={activeSection}
          setActiveIndex={setActiveSection}
        />
        <main className="flex-1 p-8 overflow-y-auto">
          {SECTIONS[activeSection].component}
        </main>
      </div>
    </div>
  );
};

export default SalonDashboard;