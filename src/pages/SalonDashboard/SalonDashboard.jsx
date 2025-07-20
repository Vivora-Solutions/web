import React from 'react';
import './SalonDashboard.css';
import Header from '../../components/Header/Header';
import DashBoardHeader from './components/DashboardHeader/DashBoardHeader';
import OpeningDays from './components/OpeningDays/OpeningDays';
import { assets } from '../../assets/assets'; 
import ServicesEditor from './components/ServicesEditor/ServicesEditor';
import EmployeesEditor from './components/EmployeesEditor/EmployeesEditor';
import PhotoSection from './components/PhotoSection/PhotoSection'; 

const SalonDashboard = () => {
  return (
    <div>
        <Header />
        <div className="salon-dashboard-container">
            <DashBoardHeader />
            <div className="dashboard-content">
                <OpeningDays />
                <PhotoSection />
            </div>
            <div className='services-employees-container'>
                <ServicesEditor className='services-container' />
                <EmployeesEditor className='services-container' />
            </div>
        </div>
    </div>
  );
};

export default SalonDashboard;