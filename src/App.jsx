import { Route, Routes, BrowserRouter as Router } from 'react-router-dom';

import SuperAdminDashboard from './pages/SuperAdminDashboard/SuperAdminDashboard';
import SalonDashboard from './pages/SalonDashboard/SalonDashboard';
import SalonProfile from './pages/User/homeProfile';
import AppointmentPage from './pages/User/appointmentpage';
import Login from './pages/Login/Login';
import AllSalonsPage from './pages/SuperAdminDashboard/AllSalonsPage';
import SalonDetailsPage from './pages/SuperAdminDashboard/SalonDetailsPage';
import MyBookingsPage from './pages/User/bookings';
import SalonRegister from './pages/SalonDashboard/SalonRegister';
import Schedule from './pages/User/schedule';
import BookingConfirm from './pages/User/booking-confirm';
import RegisterCustomerForm from './pages/User/signup';
import UserProfile from './pages/User/profile';
import SalonInfo from './pages/SalonDashboard/SalonInfo';
import OpeningDays from './pages/SalonDashboard/OpeningDays';
import PhotoSection from './pages/SalonDashboard/PhotoSection';
import ServiceManagement from './pages/SalonDashboard/ServiceManagement';
import StylistManagement from './pages/SalonDashboard/StylistManagement';
import WorkStationManagement from './pages/SalonDashboard/WorkStationManagement';
import SchedulingInterface from './pages/SalonDashboard/components/SchedulingInterface/SchedulingInterface';

function App() {

  return (
    <div className="w-full min-h-screen">
      <Routes>
        <Route path="/login" element={<Login/>} />
        <Route path="/" element={<SalonProfile />} />
        <Route path="/appointment/:salonId" element={<AppointmentPage />} />
        <Route path="/schedule" element={<Schedule />} />
        <Route path="/my-bookings" element={<MyBookingsPage />}  />
        <Route path="/booking-confirm" element={<BookingConfirm />} />
        <Route path="/signup" element={<RegisterCustomerForm/>} />
        <Route path="/profile" element={<UserProfile />} />
 
        <Route path="/salon-register" element={<SalonRegister />} />
        {/* -------- Salon Admin Dashboard -------- */}
          <Route path="/admin" element={<SalonDashboard />}>
            <Route path="salon-info" element={<SalonInfo />} />
            <Route path="opening-hours" element={<OpeningDays />} />
            <Route path="gallery" element={<PhotoSection />} />
            <Route path="services" element={<ServiceManagement />} />
            <Route path="stylists" element={<StylistManagement />} />
            <Route path="workstations" element={<WorkStationManagement />} />
            <Route path="booking-schedules" element={<SchedulingInterface />} />
          </Route>
        
        <Route path="/super-admin" element={<SuperAdminDashboard />} />
        <Route path="/all-salons" element={<AllSalonsPage />} />
         <Route path="/super-admin/booking/:salonid" element={<SalonDetailsPage />} />
      </Routes>
    </div>
  )
}

export default App
