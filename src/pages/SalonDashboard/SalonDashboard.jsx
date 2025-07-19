import React from 'react';
import './SalonDashboard.css';
import Header from '../../components/Header/Header';
import DashBoardHeader from './components/DashboardHeader/DashBoardHeader';
import OpeningDays from './components/OpeningDays/OpeningDays';
import { assets } from '../../assets/assets'; 
import ServicesEditor from './components/ServicesEditor/ServicesEditor';
import EmployeesEditor from './components/EmployeesEditor/EmployeesEditor';

const SalonDashboard = () => {
  return (
    <div>
        <Header />
        <div className="salon-dashboard-container">
        <DashBoardHeader />

        <div className="dashboard-content">
            {/* Opening Days Section */}
           <OpeningDays />

            {/* Photos Section */}
            <div className="card photos-card">
            <h2>Photos</h2>
            <div className="photos-grid">
                <div className="add-photos-placeholder">
                <span className="plus-icon">+</span>
                <p>Add Photos</p>
                </div>
                {[...Array(4)].map((_, index) => (
                <img
                    key={index}
                    src={assets.salonImage}
                    alt="Salon Interior"
                    className="salon-photo-thumbnail"
                />
                ))}
                <button className="next-button">&gt;</button> {/* Next button for slider */}
            </div>
            </div>


            <div className='services-employees-container'>
                <ServicesEditor className='services-container' />
                <EmployeesEditor className='services-container' />
            </div>

        </div>
        </div>
    </div>
  );
};

export default SalonDashboard;