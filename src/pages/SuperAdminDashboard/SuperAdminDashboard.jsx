import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../../utils/api';
import ChartCard from './componenets/ChartCard';
import StatCard from './componenets/StatCard';
import SalonVerifyModal from './componenets/SalonVerifyModal';

import './SuperAdminDashboard.css';

const SuperAdminDashboard = () => {
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState('');
  const [chartData, setChartData] = useState({
    customers: [],
    salons: [],
    bookings: [],
  });
  const [counts, setCounts] = useState({
    totalCustomers: 0,
    totalSalons: 0,
    totalBookings: 0,
  });

  const [allSalons, setAllSalons] = useState([]); // for original data
  const [salons, setSalons] = useState([]); // filtered list

  const [selectedSalon, setSelectedSalon] = useState(null);


  useEffect(() => {
    const fetchChartData = async (endpoint, key) => {
      try {
        const res = await API.get(endpoint);
        const sortedData = res.data.sort((a, b) => new Date(a.date) - new Date(b.date));
        setChartData((prev) => ({ ...prev, [key]: sortedData }));
      } catch (err) {
        console.error(`Error fetching ${key} chart data:`, err);
      }
    };

    const fetchCounts = async () => {
      try {
        const [userRes, salonRes, bookingRes] = await Promise.all([
          API.get('/super-admin/customer-count'),
          API.get('/super-admin/salon-count'),
          API.get('/super-admin/booking-count'),
        ]);
        setCounts({
          totalCustomers: userRes.data.total_customers,
          totalSalons: salonRes.data.total_salons,
          totalBookings: bookingRes.data.total_bookings,
        });
      } catch (err) {
        console.error('Error fetching dashboard counts:', err);
      }
    };

    const fetchSalons = async () => {
      try {
        const res = await API.get('/super-admin/salons-unapproved');
        setAllSalons(res.data);       // store original
        setSalons(res.data);          // initialize filtered
      } catch (err) {
        console.error('Error fetching salons:', err);
      }
    };

    fetchChartData('/super-admin/customersPerDay', 'users');
    fetchChartData('/super-admin/salonsPerDay', 'salons');
    fetchChartData('/super-admin/customersPerDay', 'bookings');
    fetchCounts();
    fetchSalons();
  }, []);

  // Update filtered salons when search term changes
  useEffect(() => {
    const filtered = allSalons.filter((salon) =>
      salon.salon_name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setSalons(filtered);
  }, [searchTerm, allSalons]);

  const handleSalonClick = async (salonId) => {
  try {
    const res = await API.get(`/super-admin/salons/${salonId}`);
    setSelectedSalon(res.data); // assuming res.data is salon object
  } catch (err) {
    console.error('Failed to load salon details', err);
  }
};

const handleModalAction = async (actionType, salonId) => {
  try {
    await API.put(`/super-admin/salonsStatus/${salonId}`, {
      is_approved: actionType === 'accept', // true for accept, false for decline
    });

    if (actionType === 'accept') {
      // Remove from list only if approved
      setAllSalons(prev => prev.filter(s => s.salon_id !== salonId));
    }

    setSelectedSalon(null); // Close modal
  } catch (err) {
    console.error(`Failed to ${actionType} salon`, err);
  }
};


  return (
    <div className="dashboard-container">
      <h2 className="dashboard-title">Super Admin Dashboard</h2>

      <div className="charts-section">
        <ChartCard title="User Analysis" data={chartData.users} />
        <ChartCard title="Company Analysis" data={chartData.salons} />
        <ChartCard title="Bookings" data={chartData.bookings} />
      </div>

      <div className="charts-section">
        <StatCard label="Total Users" value={counts.totalCustomers} />
        <StatCard label="Total Salons" value={counts.totalSalons} />
        <StatCard label="Total Bookings" value={counts.totalBookings} />
      </div>

      <div className="verify-salons-header">
        <h3>Verify Salons</h3>
        <button className="view-all-button" onClick={() => navigate('/all-salons')}>
          View All Registered Salons
        </button>
      </div>

      <input
        type="text"
        className="search-bar"
        placeholder="Search salons..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <div className="salon-list-wrapper">
        <button className="scroll-btn left">◀</button>
        <div className="salon-list">
          {salons.map((salon) => (
            <div
              className="salon-card"
              key={salon.salon_id}
              onClick={() => handleSalonClick(salon.salon_id)}
            >
              <img
                src={salon.salon_logo_link}
                alt={salon.salon_name}
                className="salon-image"
              />
              <div className="salon-info">
                <h4>{salon.salon_name}</h4>
                <p>{salon.salon_address}</p>
              </div>
            </div>
                ))}
              </div>
              <button className="scroll-btn right">▶</button>
            </div>
            <SalonVerifyModal
        salon={selectedSalon}
        onClose={() => setSelectedSalon(null)}
        onAction={handleModalAction}
      />
    </div>
  );
};

export default SuperAdminDashboard;
