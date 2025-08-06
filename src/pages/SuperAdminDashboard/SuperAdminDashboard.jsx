import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ProtectedAPI } from '../../utils/api';
import ChartCard from './components/ChartCard';
import StatCard from './components/StatCard';
import SalonVerifyModal from './components/SalonVerifyModal';

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
        const res = await ProtectedAPI.get(endpoint);
        const sortedData = res.data.sort((a, b) => new Date(a.date) - new Date(b.date));
        setChartData((prev) => ({ ...prev, [key]: sortedData }));
      } catch (err) {
        console.error(`Error fetching ${key} chart data:`, err);
      }
    };

    const fetchCounts = async () => {
      try {
        const [userRes, salonRes, bookingRes] = await Promise.all([
          ProtectedAPI.get('/super-admin/customer-count'),
          ProtectedAPI.get('/super-admin/salon-count'),
          ProtectedAPI.get('/super-admin/booking-count'),
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
        const res = await ProtectedAPI.get('/super-admin/salons-unapproved');
        setAllSalons(res.data);       
        setSalons(res.data);         
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
    const res = await ProtectedAPI.get(`/super-admin/salons/${salonId}`);
    setSelectedSalon(res.data); // assuming res.data is salon object
  } catch (err) {
    console.error('Failed to load salon details', err);
  }
};

const handleModalAction = async (actionType, salonId) => {
  try {
    await ProtectedAPI.put(`/super-admin/salonsStatus/${salonId}`, {
      is_approved: actionType === 'accept', 
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
  <div className="p-6 bg-gray-50 min-h-screen">
    <h2 className="text-2xl font-semibold mb-6 text-gray-800">Super Admin Dashboard</h2>

    {/* Charts */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <ChartCard title="User Analysis" data={chartData.users} />
      <ChartCard title="Company Analysis" data={chartData.salons} />
      <ChartCard title="Bookings" data={chartData.bookings} />
    </div>

    {/* Stats */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
      <StatCard label="Total Users" value={counts.totalCustomers} />
      <StatCard label="Total Salons" value={counts.totalSalons} />
      <StatCard label="Total Bookings" value={counts.totalBookings} />
    </div>

    {/* Verify Salons */}
    <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
      <h3 className="text-lg font-semibold text-gray-700">Verify Salons</h3>
      <button
        className="text-sm bg-black text-white px-4 py-2 rounded hover:bg-gray-800 transition"
        onClick={() => navigate('/all-salons')}
      >
        View All Registered Salons
      </button>
    </div>

    <input
      type="text"
      placeholder="Search salons..."
      className="w-full md:w-1/3 p-2 border border-gray-300 rounded mb-6 focus:outline-none focus:ring-2 focus:ring-gray-500"
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
    />

    {/* Scrollable Salon Cards */}
    <div className="relative">
      <button className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-white shadow-md p-2 rounded-full">
        ◀
      </button>

      <div className="overflow-x-auto whitespace-nowrap px-8">
        <div className="inline-flex gap-4">
          {salons.map((salon) => (
            <div
              key={salon.salon_id}
              className="bg-white shadow-md rounded-lg w-60 shrink-0 cursor-pointer hover:shadow-xl transition duration-300"
              onClick={() => handleSalonClick(salon.salon_id)}
            >
              <img
                src={salon.salon_logo_link}
                alt={salon.salon_name}
                className="h-36 w-full object-cover rounded-t-lg"
              />
              <div className="p-3">
                <h4 className="text-md font-semibold text-gray-700">{salon.salon_name}</h4>
                <p className="text-sm text-gray-500">{salon.salon_address}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <button className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-white shadow-md p-2 rounded-full">
        ▶
      </button>
    </div>

    {/* Modal */}
    <SalonVerifyModal
      salon={selectedSalon}
      onClose={() => setSelectedSalon(null)}
      onAction={handleModalAction}
    />
  </div>
);

};

export default SuperAdminDashboard;
