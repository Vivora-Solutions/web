import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import { ProtectedAPI } from '../../utils/api';

const AllSalonsPage = () => {
  const [salons, setSalons] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate(); 

  useEffect(() => {
    const fetchSalons = async () => {
      try {
        const res = await ProtectedAPI.get('/super-admin/salons');
        setSalons(res.data);
      } catch (err) {
        console.error('Error fetching salons:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSalons();
  }, []);

  const filteredSalons = salons.filter((salon) =>
    salon.salon_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleRowClick = (salonId) => {
    navigate(`/super-admin/booking/${salonId}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 sm:px-6 py-8">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">Registered Salons</h2>

      <input
        type="text"
        placeholder="Search a Salon..."
        className="w-full md:w-1/3 mb-6 px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : filteredSalons.length === 0 ? (
        <p className="text-gray-500 text-center">No salons found.</p>
      ) : (
        <div className="overflow-x-auto bg-white rounded-xl shadow-md">
          {/* Desktop Table */}
          <table className="hidden md:table w-full text-left text-sm text-gray-700">
            <thead className="bg-gray-100 text-gray-600 text-sm uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4">Address</th>
                <th className="px-6 py-4">Registered Date</th>
              </tr>
            </thead>
            <tbody>
              {filteredSalons.map((salon) => (
                <tr
                  key={salon.salon_id}
                  onClick={() => handleRowClick(salon.salon_id)}
                  className="cursor-pointer hover:bg-indigo-50 transition"
                >
                  <td className="px-6 py-4 font-medium">{salon.salon_name}</td>
                  <td className="px-6 py-4">{salon.salon_address}</td>
                  <td className="px-6 py-4">
                    {new Date(salon.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Mobile Cards */}
          <div className="md:hidden divide-y">
            {filteredSalons.map((salon) => (
              <div
                key={salon.salon_id}
                onClick={() => handleRowClick(salon.salon_id)}
                className="p-4 cursor-pointer hover:bg-indigo-50 transition"
              >
                <p className="font-semibold text-gray-800">{salon.salon_name}</p>
                <p className="text-gray-600 text-sm">{salon.salon_address}</p>
                <p className="text-gray-500 text-xs mt-1">
                  {new Date(salon.created_at).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AllSalonsPage;
