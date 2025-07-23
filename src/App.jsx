import {Route, Routes} from 'react-router-dom';
import SuperAdminDashboard from './pages/SuperAdminDashboard/SuperAdminDashboard';
import SalonDashboard from './pages/SalonDashboard/SalonDashboard';
import SalonProfile from './pages/User/salonprofile';
import BookingsPage from './pages/User/bookingspage';
import BookingHistoryPage from './pages/User/bookinghistorypage';
import AuthPage from './pages/User/Login';
import Signup from './pages/User/Signup';
import BookingConfirm from './pages/User/bookingconfirm';
import RateUs from './pages/User/Rateus';
function App() {

  return (
    <div>
      <Routes>
        <Route path="/" element={<SalonProfile />} />
        <Route path="/bookings" element={<BookingsPage />} />
        <Route path="/booking-history" element={<BookingHistoryPage />} />
        <Route path="/super-admin" element={<SuperAdminDashboard />} />
        <Route path="/admin" element={<SalonDashboard />} />
        <Route path="/login" element={<AuthPage />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/booking-confirm" element={<BookingConfirm />} />
        <Route path="/rateus" element={<RateUs />} />

      </Routes>
    </div>
  )
}

export default App
