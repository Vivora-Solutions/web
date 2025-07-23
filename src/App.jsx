import {Route, Routes} from 'react-router-dom';
import SuperAdminDashboard from './pages/SuperAdminDashboard/SuperAdminDashboard';
import SalonDashboard from './pages/SalonDashboard/SalonDashboard';
import SalonDetails from './pages/SuperAdminDashboard/SalonDetails';
import SalonPage from './pages/SuperAdminDashboard/SalonPage';

function App() {

  return (
    <div>
      <Routes>
        <Route path="/" element={<SuperAdminDashboard />} />
        <Route path="/super-admin" element={<SuperAdminDashboard />} />
        <Route path="/admin" element={<SalonDashboard />} />
        <Route path="/details" element={<SalonDetails/>} />
        <Route path="/salonpage" element={<SalonPage/>} />
      </Routes>
    </div>
  )
}

export default App
