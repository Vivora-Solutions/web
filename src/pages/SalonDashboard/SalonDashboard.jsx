// // src/pages/SalonDashboard/SalonDashboard.jsx
// import React, { useEffect, useState } from "react";
// import "./SalonDashboard.css";
// import Header from "../../components/Header/Header";
// import OpeningDays from "./components/OpeningDays/OpeningDays";
// import { assets } from "../../assets/assets";
// import ServicesEditor from "./components/ServicesEditor/ServicesEditor";
// import PhotoSection from "./components/PhotoSection/PhotoSection";
// import API from "../../utils/api";
// import SalonInfo from "./components/DashboardHeader/SalonInfo";
// import ServiceManagement from "./components/ServiceManagement/ServiceManagement";
// import StylistManagement from "./components/StylistManagement/StylistManagement";
// import WorkStationManagement from "./components/WorkStationManagement/WorkStationManagement";

// const SalonDashboard = () => {
//   const [salonData, setSalonData] = useState(null);

//   useEffect(() => {
//     const fetchSalon = async () => {
//       try {
//         const res = await API.get("/salon-admin/my");
//         setSalonData(res.data);
//       } catch (err) {
//         console.error("Error fetching salon:", err);
//       }
//     };
//     fetchSalon();
//   }, []);

//   const handleUpdate = async (updatedData) => {
//     try {
//       const { is_approved, ...payload } = updatedData; // exclude is_approved
//       console.log(payload); // Optional: for debugging

//       // ✅ This is where it should go:
//       await API.put("/salon-admin/update", payload);

//       // ✅ Then update local state to reflect change
//       setSalonData((prev) => ({ ...prev, ...payload }));
//     } catch (err) {
//       console.error("Update failed:", err);
//     }
//   };

//   if (!salonData) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
//           <p className="text-gray-600 text-lg">
//             Loading your salon dashboard...
//           </p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
//       <Header />

//       {/* Dashboard Container */}
//       <div className="salon-dashboard-container">
//         {/* Dashboard Header */}
//         <div className="dashboard-header mb-8">
//           <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
//             <h1 className="text-3xl font-bold text-gray-800 mb-2">
//               Salon Dashboard
//             </h1>
//             <p className="text-gray-600">
//               Manage your salon's information, services, and team
//             </p>
//           </div>
//         </div>

//         {/* Main Content Grid */}
//         <div className="dashboard-grid">
//           {/* Salon Info Section */}
//           <div className="dashboard-card">
//             <SalonInfo />
//           </div>

//           {/* Opening Days Section */}
//           <div className="dashboard-card opening-days-section">
//             <div className="card-header">
//               <h2 className="card-title">Opening Hours</h2>
//               <p className="card-subtitle">
//                 Set your salon's operating schedule
//               </p>
//             </div>
//             <OpeningDays />
//           </div>

//           {/* Photo Section */}
//           <div className="dashboard-card photo-section">
//             <div className="card-header">
//               <h2 className="card-title">Salon Gallery</h2>
//               <p className="card-subtitle">
//                 Showcase your salon with beautiful photos
//               </p>
//             </div>
//             <PhotoSection bannerImages={salonData.banner_images || []} />
//           </div>

//           {/* Service Management Section */}
//           <div className="dashboard-card service-management-section">
//             <div className="card-header">
//               <h2 className="card-title">Service Management</h2>
//               <p className="card-subtitle">
//                 Manage your salon services and pricing
//               </p>
//             </div>
//             <ServiceManagement />
//           </div>

//           {/* Stylist Management Section */}
//           <div className="dashboard-card stylist-management-section">
//             <div className="card-header">
//               <h2 className="card-title">Team Management</h2>
//               <p className="card-subtitle">
//                 Manage your stylists and their schedules
//               </p>
//             </div>
//             <StylistManagement />
//           </div>

//           {/* Work Station Management Section */}
//           <div className="dashboard-card workstation-management-section">
//             <div className="card-header">
//               <h2 className="card-title">Work Station Management</h2>
//               <p className="card-subtitle">
//                 Organize salon layout and seating arrangements
//               </p>
//             </div>
//             <WorkStationManagement />
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

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
