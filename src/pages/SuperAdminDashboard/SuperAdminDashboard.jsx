import React from 'react';
import './SuperAdminDashboard.css';
import { IoLocationOutline } from "react-icons/io5";
import salonImage from '../../assets/salonImage.png'

const SuperAdminDashboard = () => {
  return (
    <div className="dashboard-container">
      <h2>Super Admin Dashboard</h2>

      <div className="analytics-section">
        <div className="card">
          <div className="graph-placeholder">
            {/* Placeholder for User Analysis Graph */}
            <p>Graph for User Analysis</p>
          </div>
          <h3>User Analysis</h3>
        </div>

        <div className="card">
          <div className="graph-placeholder">
            {/* Placeholder for Company Analysis Graph */}
            <p>Graph for Company Analysis</p>
          </div>
          <h3>Company Analysis</h3>
        </div>

        <div className="card">
          <div className="graph-placeholder">
            <p>Graph for Bookings</p>
          </div>
          <h3>Bookings</h3>
        </div>
      </div>

      <div className="total-counts-section">
        <div className="count-card">
          <p className="label">Total Users</p>
          <p className="value">1645</p>
        </div>
        <div className="count-card">
          <p className="label">Total Salons</p>
          <p className="value">1645</p>
        </div>
        <div className="count-card">
          <p className="label">Total Bookings</p>
          <p className="value">1645</p>
        </div>
      </div>

      <h2>Verify Salons</h2>
      <div className="verify-salons-section">
        {[...Array(4)].map((_, index) => (
          <div className="salon-card" key={index}>
            <img src={salonImage} alt="Salon" className="salon-image" />
            <p className="salon-name">Liyo Salons</p>
            <p className="salon-location"><IoLocationOutline className='react-icons' /> Colombo</p>
            <div className="salon-actions">
              <button className="verify-button">Verify</button>
              <button className="decline-button">Decline</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
  
}

export default SuperAdminDashboard
