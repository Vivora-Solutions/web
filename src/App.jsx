import {Route, Routes, BrowserRouter as Router} from 'react-router-dom';

import SuperAdminDashboard from './pages/SuperAdminDashboard/SuperAdminDashboard';
import SalonDashboard from './pages/SalonDashboard/SalonDashboard';
import SalonProfile from './pages/User/salonprofile';
import AppointmentPage from './pages/User/appointmentpage';
// import BookingsPage from './pages/User/bookingspage';
// import BookingHistoryPage from './pages/User/bookinghistorypage';
import AuthPage from './pages/User/Login';
import Signup from './pages/User/Signup';
// import BookingConfirm from './pages/User/bookingconfirm';
import Bookings from './pages/User/bookings';
import RateUs from './pages/User/Rateus';
import SalonDetails from './pages/SuperAdminDashboard/SalonDetails';
import SalonPage from './pages/SuperAdminDashboard/SalonPage';
import SalonAdminLogin from './pages/Login/Login';  
import AllSalonsPage from './pages/SuperAdminDashboard/AllSalonsPage';
import SalonDetailsPage from './pages/SuperAdminDashboard/SalonDetailsPage';  
import SelectProviderPage from './pages/User/selectProvider';

function App() {

  return (
    <div>
      
      <Routes>

        <Route path="/" element={<SalonProfile />} />
         <Route path="/appointment/:salonId" element={<AppointmentPage />} />
         <Route path="/bookings" element={<Bookings />} />

        <Route path="/select-provider" element={<SelectProviderPage />} />
        
        <Route path="/super-admin" element={<SuperAdminDashboard />} />
        <Route path="/admin" element={<SalonDashboard />} />
        <Route path="/login" element={<AuthPage />} />
        <Route path="/signup" element={<Signup />} />
        {/* <Route path="/booking-confirm" element={<BookingConfirm />} /> */}
        <Route path="/rateus" element={<RateUs />} />
        <Route path="/" element={<SuperAdminDashboard />} />
        <Route path="/super-admin" element={<SuperAdminDashboard />} />
        <Route path="/admin" element={<SalonDashboard />} />
        <Route path="/details" element={<SalonDetails/>} />
        <Route path="/salonpage" element={<SalonPage/>} />
        <Route path="/salonlogin" element={<SalonAdminLogin/>} />
        <Route path="/all-salons" element={<AllSalonsPage />} />
        <Route path="/super-admin/booking/:salonid" element={<SalonDetailsPage />} />

      </Routes>
    </div>
  )
}

export default App
