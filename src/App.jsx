import {Route, Routes} from 'react-router-dom';
import SuperAdminDashboard from './pages/SuperAdminDashboard/SuperAdminDashboard';
import SalonDashboard from './pages/SalonDashboard/SalonDashboard';
import SalonProfile from './pages/User/salonprofile';

function App() {

  return (
    <div>
      <Routes>
        <Route path="/" element={<SalonProfile />} />
        <Route path="/super-admin" element={<SuperAdminDashboard />} />
        <Route path="/admin" element={<SalonDashboard />} />
      </Routes>
    </div>
  )
}

export default App
