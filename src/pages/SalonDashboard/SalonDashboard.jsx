

// src/pages/SalonDashboard/SalonDashboard.jsx
import React, { useEffect, useState } from 'react';
import './SalonDashboard.css';
import Header from '../../components/Header/Header';
import DashboardHeader from './components/DashboardHeader/DashBoardHeader';
import OpeningDays from './components/OpeningDays/OpeningDays';
import { assets } from '../../assets/assets';
import ServicesEditor from './components/ServicesEditor/ServicesEditor';
import EmployeesEditor from './components/EmployeesEditor/EmployeesEditor';
import PhotoSection from './components/PhotoSection/PhotoSection';
import API from '../../utils/api';
import SalonInfo from './components/DashboardHeader/SalonInfo';

const SalonDashboard = () => {
  const [salonData, setSalonData] = useState(null);

  useEffect(() => {
    const fetchSalon = async () => {
      try {
        const res = await API.get('/salon-admin/my');
        setSalonData(res.data);
        
      } catch (err) {
        console.error('Error fetching salon:', err);
      }
    };
    fetchSalon();
  }, []);

const handleUpdate = async (updatedData) => {
  try {
    const { is_approved, ...payload } = updatedData; // exclude is_approved
    console.log(payload); // Optional: for debugging

    // ✅ This is where it should go:
    await API.put('/salon-admin/update', payload);

    // ✅ Then update local state to reflect change
    setSalonData(prev => ({ ...prev, ...payload }));
  } catch (err) {
    console.error('Update failed:', err);
  }
};

  if (!salonData) return <p>Loading...</p>;

  return (
    <div>
      <Header />
      <div className="salon-dashboard-container">
        <SalonInfo/>
        {/* <DashboardHeader salon={salonData} onUpdate={handleUpdate} /> */}
        <div className="opening-days-container">
          <OpeningDays />
        </div>
        <PhotoSection bannerImages={salonData.banner_images || []} />
        <div className="services-employees-container">
          <ServicesEditor />
          <EmployeesEditor />
        </div>
      </div>
    </div>
  );
};

export default SalonDashboard;
