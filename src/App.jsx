import { useState } from 'react';
import Header from './components/Header/Header';
import SuperAdminDashboard from './pages/SuperAdminDashboard/SuperAdminDashboard';

function App() {

  return (
    <div>
      <Header />
      <SuperAdminDashboard />
    </div>
  )
}

export default App
