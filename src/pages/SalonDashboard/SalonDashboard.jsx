import React from 'react';
import './SalonDashboard.css';
import Header from '../../components/Header/Header';
import DashBoardHeader from './components/DashboardHeader/DashBoardHeader';
import OpeningDays from './components/OpeningDays/OpeningDays';
import { assets } from '../../assets/assets'; 
import { FaRegEdit } from "react-icons/fa";
import ServicesEditor from './components/ServicesEditor/ServicesEditor';

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

            {/* Services Section */}
            <ServicesEditor />

            {/* Employees Section */}
            <div className="card employees-card">
            <h2>Employees</h2>
            <button className="add-employee-button">+ Add Employee</button>
            {[...Array(2)].map((_, index) => (
                <div className="employee-item" key={index}>
                <img src={assets.noProfilepic} alt="Employee Avatar" className="employee-avatar" />
                <p className="employee-name">Ruwan</p>
                <span className="edit-icon"><FaRegEdit /></span>
                <span className="delete-icon">&#128465;</span>
                <p className="employee-contact">722225789v</p>
                </div>
            ))}
            <button className="save-update-button">Save and Update</button>
            </div>
        </div>
        </div>
    </div>
  );
};

export default SalonDashboard;