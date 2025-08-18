import { useState, useEffect } from 'react';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import { ProtectedAPI } from '../../utils/api';
import ChartCard from './components/ChartCard';
import StatCard from './components/StatCard';
import SalonVerifyModal from './components/SalonVerifyModal';
import Header from "./components/Header";

const SuperAdminDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [searchTerm, setSearchTerm] = useState('');
  const [chartData, setChartData] = useState({ users: [], salons: [], bookings: [] });
  const [counts, setCounts] = useState({ totalCustomers: 0, totalSalons: 0, totalBookings: 0 });
  const [allSalons, setAllSalons] = useState([]);
  const [salons, setSalons] = useState([]);
  const [selectedSalon, setSelectedSalon] = useState(null);

  // ---- Fetch all chart data together ----
  const fetchAllCharts = async () => {
    try {
      const [userRes, salonRes, bookingRes] = await Promise.all([
        ProtectedAPI.get('/super-admin/customersPerDay'),
        ProtectedAPI.get('/super-admin/salonsPerDay'),
        ProtectedAPI.get('/super-admin/bookingsPerDay'),
      ]);

      const normalize = (data) =>
        data
          .filter((item) => item.booking_date !== null)
          .map((item) => ({
            date: item.date || item.booking_date,
            count: item.count,
          }))
          .sort((a, b) => new Date(a.date) - new Date(b.date));

      setChartData({
        users: normalize(userRes.data),
        salons: normalize(salonRes.data),
        bookings: normalize(bookingRes.data),
      });
    } catch (err) {
      console.error('Error fetching chart data:', err);
    }
  };

  // ---- Fetch counts ----
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

  // ---- Fetch salons ----
  const fetchSalons = async () => {
    try {
      const res = await ProtectedAPI.get('/super-admin/salons-unapproved');
      setAllSalons(res.data);
      setSalons(res.data);
    } catch (err) {
      console.error('Error fetching salons:', err);
    }
  };

  // ---- Initial fetch ----
  useEffect(() => {
    fetchAllCharts();
    fetchCounts();
    fetchSalons();
  }, []);

  // ---- Filter salons ----
  useEffect(() => {
    const filtered = allSalons.filter((salon) =>
      salon.salon_name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setSalons(filtered);
  }, [searchTerm, allSalons]);

  // ---- Salon click ----
  const handleSalonClick = async (salonId) => {
    try {
      const res = await ProtectedAPI.get(`/super-admin/salons/${salonId}`);
      setSelectedSalon(res.data);
    } catch (err) {
      console.error('Failed to load salon details', err);
    }
  };

  // ---- Approve/Reject salon ----
  const handleModalAction = async (actionType, salonId) => {
    try {
      await ProtectedAPI.put(`/super-admin/salonsStatus/${salonId}`, {
        is_approved: actionType === 'accept',
      });

      if (actionType === 'accept') {
        setAllSalons((prev) => prev.filter((s) => s.salon_id !== salonId));
      }

      setSelectedSalon(null);
    } catch (err) {
      console.error(`Failed to ${actionType} salon`, err);
    }
  };

  // ---- Check if at base route ----
  const isBaseRoute = location.pathname === "/super-admin";

  return (
    <div className="bg-white min-h-screen text-gray-900">
      <Header />
      <div className="px-4 md:px-6 pt-24"> {/* padding-top for fixed header */}
        <h2 className="text-2xl md:text-3xl font-bold mb-6 text-black">
          Super Admin Dashboard
        </h2>

        {isBaseRoute ? (
          <>
            {/* Charts */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-8">
              <ChartCard title="User Growth" data={chartData.users} type="line" color="#111" />
              <ChartCard title="Salon Registrations" data={chartData.salons} type="bar" color="#444" />
              <ChartCard title="Bookings Trend" data={chartData.bookings} type="area" color="#888" />
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-10">
              <StatCard label="Total Users" value={counts.totalCustomers} icon="users" />
              <StatCard label="Total Salons" value={counts.totalSalons} icon="store" />
              <StatCard label="Total Bookings" value={counts.totalBookings} icon="calendar-check" />
            </div>

            {/* Verify Salons */}
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-3">
              <h3 className="text-lg font-semibold text-gray-800">Verify Salons</h3>
              <button
                className="text-sm bg-black text-white px-4 py-2 rounded-lg shadow hover:bg-gray-800 transition"
                onClick={() => navigate('/super-admin/all-salons')}
              >
                View All Registered Salons
              </button>
            </div>

            <input
              type="text"
              placeholder="Search salons..."
              className="w-full md:w-1/3 p-2 border border-gray-300 rounded-lg mb-6 focus:outline-none focus:ring-2 focus:ring-black"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />

            {/* Scrollable Salon Cards */}
            <div className="relative">
              {/* Horizontal scroll only, no arrows on mobile */}
              <div className="overflow-x-auto whitespace-nowrap py-2 scrollbar-hide">
                <div className="inline-flex gap-4 md:gap-6 px-1 md:px-2">
                  {salons.map((salon) => (
                    <div
                      key={salon.salon_id}
                      className="bg-gray-50 border border-gray-200 shadow-sm rounded-xl w-56 md:w-64 shrink-0 cursor-pointer hover:shadow-md transition-transform hover:-translate-y-1"
                      onClick={() => handleSalonClick(salon.salon_id)}
                    >
                      <img
                        src={salon.salon_logo_link}
                        alt={salon.salon_name}
                        className="h-32 md:h-40 w-full object-cover rounded-t-xl"
                      />
                      <div className="p-3">
                        <h4 className="text-sm md:text-md font-semibold text-gray-800">
                          {salon.salon_name}
                        </h4>
                        <p className="text-xs md:text-sm text-gray-500 truncate">
                          {salon.salon_address}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal */}
            <SalonVerifyModal
              salon={selectedSalon}
              onClose={() => setSelectedSalon(null)}
              onAction={handleModalAction}
            />
          </>
        ) : (
          <Outlet />
        )}
      </div>
    </div>
  );
};

export default SuperAdminDashboard;
