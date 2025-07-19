import { useState } from 'react';
import {Route, Routes} from 'react-router-dom';
import SuperAdminDashboard from './pages/SuperAdminDashboard/SuperAdminDashboard';

function App() {

  return (
    <div>
      <Routes>
        <Route path="/super-admin" element={<SuperAdminDashboard />} />
      </Routes>
    </div>
  )
}

export default App
