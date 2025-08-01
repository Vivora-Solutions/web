import React, { useEffect, useState } from "react";
import "./SalonDashboard.css";
import { Info, Calendar, Image, Scissors, Users, Monitor } from "lucide-react";

import API from "../../utils/api";
import Header from "../../components/Header/Header";
import Sidebar from "../../components/Sidebar/Sidebar";
import SalonInfo from "./components/DashboardHeader/SalonInfo";
import OpeningDays from "./components/OpeningDays/OpeningDays";
import PhotoSection from "./components/PhotoSection/PhotoSection";
import ServiceManagement from "./components/ServiceManagement/ServiceManagement";
import StylistManagement from "./components/StylistManagement/StylistManagement";
import WorkStationManagement from "./components/WorkStationManagement/WorkStationManagement";
import SchedulingInterface from "./components/SchedulingInterface/SchedulingInterface";

const SECTIONS = [
  { label: "Salon Info", icon: <Info size={20} />, component: <SalonInfo /> },
  {
    label: "Opening Hours",
    icon: <Calendar size={20} />,
    component: <OpeningDays />,
  },
  { label: "Gallery", icon: <Image size={20} />, component: <PhotoSection /> },
  {
    label: "Services",
    icon: <Scissors size={20} />,
    component: <ServiceManagement />,
  },
  {
    label: "Stylists",
    icon: <Users size={20} />,
    component: <StylistManagement />,
  },
  {
    label: "Workstations",
    icon: <Monitor size={20} />,
    component: <WorkStationManagement />,
  },
  {
    label: "Booking Schedules",
    icon: <Calendar size={20} />,
    component: <SchedulingInterface />,
  }
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
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading your salon dashboard...</p>
      </div>
    );
  }

  return (
    <div className="dashboard-layout">
      <Header />
      <div className="dashboard-body">
        <Sidebar
          items={SECTIONS}
          activeIndex={activeSection}
          setActiveIndex={setActiveSection}
        />
        <main className="main-panel">{SECTIONS[activeSection].component}</main>
      </div>
    </div>
  );
};

export default SalonDashboard;
