import {Route, Routes, BrowserRouter as Router} from 'react-router-dom';

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

function App() {

  return (
    <div>
      <Routes>
        <Route path="/login" element={<Login/>} />
        <Route path="/" element={<SalonProfile />} />
        <Route path="/appointment/:salonId" element={<AppointmentPage />} />
        <Route path="/schedule" element={<Schedule />} />
        <Route path="/my-bookings" element={<MyBookingsPage />}  />
        <Route path="/booking-confirm" element={<BookingConfirm />} />
        <Route path="/signup" element={<RegisterCustomerForm/>} />
        <Route path="/profile" element={<UserProfile />} />

        <Route path="/admin" element={<SalonDashboard />} />  
        <Route path="/salon-register" element={<SalonRegister />} />
        
        <Route path="/super-admin" element={<SuperAdminDashboard />} />
        <Route path="/all-salons" element={<AllSalonsPage />} />
         <Route path="/super-admin/booking/:salonid" element={<SalonDetailsPage />} />
      </Routes>
    </div>
  )
}

export default App
