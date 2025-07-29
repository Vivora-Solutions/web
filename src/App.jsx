import {Route, Routes, BrowserRouter as Router} from 'react-router-dom';

import SuperAdminDashboard from './pages/SuperAdminDashboard/SuperAdminDashboard';
import SalonDashboard from './pages/SalonDashboard/SalonDashboard';
import SalonProfile from './pages/User/homeProfile';
import AppointmentPage from './pages/User/appointmentpage';
import SalonAdminLogin from './pages/Login/Login';  
import AllSalonsPage from './pages/SuperAdminDashboard/AllSalonsPage';
import SalonDetailsPage from './pages/SuperAdminDashboard/SalonDetailsPage';  

function App() {

  return (
    <div>
      
      <Routes>
        <Route path="/" element={<SalonProfile />} />
         <Route path="/appointment/:salonId" element={<AppointmentPage />} />
        <Route path="/super-admin" element={<SuperAdminDashboard />} />
        <Route path="/admin" element={<SalonDashboard />} />
        <Route path="/super-admin" element={<SuperAdminDashboard />} />
        <Route path="/admin" element={<SalonDashboard />} />
        <Route path="/login" element={<SalonAdminLogin/>} />
        <Route path="/all-salons" element={<AllSalonsPage />} />
        <Route path="/super-admin/booking/:salonid" element={<SalonDetailsPage />} />

      </Routes>
    </div>
  )
}

export default App
