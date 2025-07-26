// src/pages/SuperAdminDashboard/StatCard.jsx
import React from 'react';

const StatCard = ({ label, value }) => (
  <div className="chart-box">
    <div className="summary-box">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  </div>
);

export default StatCard;
