import React from 'react';
import './SalonDashboard.css';
import Header from '../../components/Header/Header';
import DashBoardHeader from './components/DashboardHeader/DashBoardHeader';
import { assets } from '../../assets/assets'; 
import { FaRegEdit } from "react-icons/fa";


const SalonDashboard = () => {
  return (
    <div>
        <Header />
        <div className="salon-dashboard-container">
        <DashBoardHeader />

        <div className="dashboard-content">
            {/* Opening Days Section */}
            <div className="card opening-days-card">
            <div className="opening-days-header">
                <h2>Opening Days</h2>
                <div className="time-controls">
                <h3>Time</h3>
                <select className="time-select">
                    <option>9:00</option>
                    <option>8:00</option>
                    <option>10:00</option>
                </select>
                <select className="period-select">
                    <option>am</option>
                    <option>pm</option>
                </select>
                <span className="time-separator">-</span>
                <select className="time-select">
                    <option>5:00</option>
                    <option>4:00</option>
                    <option>6:00</option>
                </select>
                <select className="period-select">
                    <option>pm</option>
                    <option>am</option>
                </select>
                </div>
            </div>
            
            <div className="opening-days-table">
                <div className="table-header">
                <span>Date</span>
                <span>Time</span>
                </div>
                
                {[
                { day: 'Monday', checked: true },
                { day: 'Tuesday', checked: true },
                { day: 'Wednesday', checked: true },
                { day: 'Thursday', checked: false },
                { day: 'Friday', checked: true },
                { day: 'Saturday', checked: true },
                { day: 'Sunday', checked: false }
                ].map((dayInfo, index) => (
                <div className="table-row" key={dayInfo.day}>
                    <div className="day-column">
                    <input 
                        type="checkbox" 
                        checked={dayInfo.checked}
                        className="day-checkbox"
                        onChange={() => {}}
                    />
                    <span className={`day-name ${!dayInfo.checked ? 'disabled' : ''}`}>
                        {dayInfo.day}
                    </span>
                    </div>
                    <div className="time-column">
                    <span className={`time-display ${!dayInfo.checked ? 'disabled' : ''}`}>
                        9:00 am - 5:00 pm
                    </span>
                    <span className="edit-icon"><FaRegEdit /></span>
                    </div>
                </div>
                ))}
            </div>
            
            <button className="save-update-button">Save and Update</button>
            </div>

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
            <div className="card services-card">
            <h2>Services</h2>
            <div className="show-prices-checkbox">
                <input type="checkbox" id="showPrices" defaultChecked />
                <label htmlFor="showPrices">Show Prices</label>
            </div>
            <div className="services-grid-header">
                <p>Service</p>
                <p>Price</p>
                <p>Time</p>
            </div>
            <button className="add-service-button">+ Add Service</button>
            {[...Array(3)].map((_, index) => (
                <div className="service-item" key={index}>
                <p className="service-name">Hair Cutting and Shaving</p>
                <div className="service-actions">
                    <span className="edit-icon"><FaRegEdit /></span>
                    <span className="delete-icon">&#128465;</span> {/* Unicode for trash can icon */}
                </div>
                <p className="service-price">Rs. 1400</p>
                <p className="service-time">15 minutes</p>
                </div>
            ))}
            <button className="save-update-button">Save and Update</button>
            </div>

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