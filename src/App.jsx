import { Route, Routes, BrowserRouter as Router } from "react-router-dom";

import SuperAdminDashboard from "./pages/SuperAdminDashboard/SuperAdminDashboard";
import SalonDashboard from "./pages/SalonDashboard/SalonDashboard";
import SalonProfile from "./pages/User/homeProfile";
import AppointmentPage from "./pages/User/appointmentpage";
import Login from "./pages/Login/Login";
import AllSalonsPage from "./pages/SuperAdminDashboard/AllSalonsPage";
import SalonDetailsPage from "./pages/SuperAdminDashboard/SalonDetailsPage";
import MyBookingsPage from "./pages/User/bookings";
import SalonRegister from "./pages/SalonDashboard/SalonRegister";
import Schedule from "./pages/User/schedule";
import BookingConfirm from "./pages/User/booking-confirm";
import RegisterCustomerForm from "./pages/User/signup";
import UserProfile from "./pages/User/profile";
import SalonInfo from "./pages/SalonDashboard/SalonInfo";
import OpeningDays from "./pages/SalonDashboard/OpeningDays";
import PhotoSection from "./pages/SalonDashboard/PhotoSection";
import ServiceManagement from "./pages/SalonDashboard/ServiceManagement";
import StylistManagement from "./pages/SalonDashboard/StylistManagement";
import WorkStationManagement from "./pages/SalonDashboard/WorkStationManagement";
import SchedulingInterface from "./pages/SalonDashboard/components/SchedulingInterface/SchedulingInterface";
//import Page from "./pages/SalonDashboard/components/SchedulingInterface/app/page";
import OAuthHandler from "./components/OAuthCallback";
import ProtectedRoute from "./components/ProtectedRoute";
import PublicCustomerRoute from "./components/PublicCustomerRoute";
import About from "./pages/User/components/about";
//
function App() {
  return (
    <div className="w-full min-h-screen">
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<RegisterCustomerForm />} />
        <Route path="/salon-register" element={<SalonRegister />} />
        <Route path="/oauth-callback" element={<OAuthHandler />} />
        <Route path="/about" element={<About />} />



        {/* PublicCustomerRoute Pages */}
        <Route path="/" element={
          <PublicCustomerRoute>
            <SalonProfile />
          </PublicCustomerRoute>
        } />
        <Route path="/appointment/:salonId" element={
          <PublicCustomerRoute>
            <AppointmentPage />
          </PublicCustomerRoute>
        } />
        <Route path="/schedule" element={
          <PublicCustomerRoute>
            <Schedule />
          </PublicCustomerRoute>
        } />

        {/* Customer Only */}
        <Route element={<ProtectedRoute allowedRoles={["customer"]} />}>
          <Route path="/profile" element={<UserProfile />} />
          <Route path="/booking-confirm" element={<BookingConfirm />} />
          <Route path="/my-bookings" element={<MyBookingsPage />} />
        </Route>

        {/* Salon Admin Only */}
        <Route element={<ProtectedRoute allowedRoles={["salon_admin"]} />}>
          <Route path="/admin" element={<SalonDashboard />}>
            <Route path="salon-info" element={<SalonInfo />} />
            <Route path="opening-hours" element={<OpeningDays />} />
            <Route path="gallery" element={<PhotoSection />} />
            <Route path="services" element={<ServiceManagement />} />
            <Route path="stylists" element={<StylistManagement />} />
            <Route path="workstations" element={<WorkStationManagement />} />
            <Route path="booking-schedules" element={<SchedulingInterface />} />
          </Route>
        </Route>



        <Route element={<ProtectedRoute allowedRoles={["super_admin"]} />}>
          <Route path="/super-admin" element={<SuperAdminDashboard />}>
            <Route path="all-salons" element={<AllSalonsPage />} />
            <Route path="booking/:salonid" element={<SalonDetailsPage />} />
          </Route>
        </Route>
     
        
      </Routes>
    </div>
  );
}

export default App;
