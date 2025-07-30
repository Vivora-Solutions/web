import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import API from '../../utils/api';

const AllSalonsPage = () => {
  const [salons, setSalons] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate(); 

  useEffect(() => {
    const fetchSalons = async () => {
      try {
        const res = await API.get('/super-admin/salons');
        setSalons(res.data);
      } catch (err) {
        console.error('Error fetching salons:', err);
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
    <div className="min-h-screen bg-gray-50 px-6 py-8">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">Registered Salons</h2>

      <input
        type="text"
        placeholder="Search a Salon..."
        className="w-full md:w-1/3 mb-6 px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <div className="overflow-x-auto bg-white rounded-xl shadow-md">
        <table className="w-full text-left text-sm text-gray-700">
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
      </div>
    </div>
  );
};

export default AllSalonsPage;
