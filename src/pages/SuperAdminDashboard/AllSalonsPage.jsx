import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // 👉 Import navigator
import API from '../../utils/api';
import './AllSalonsPage.css';

const AllSalonsPage = () => {
  const [salons, setSalons] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate(); // 👈 Initialize navigate

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
    navigate(`/super-admin/booking/${salonId}`); // 👈 Redirect with salon ID
  };

  return (
    <div className="all-salons-container">
      <h2 className="page-title">Registered Salons</h2>
      <input
        type="text"
        placeholder="Search a Salon..."
        className="search-bar"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <table className="salons-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Address</th>
            <th>Registered Date</th>
          </tr>
        </thead>
        <tbody>
          {filteredSalons.map((salon) => (
            <tr
              key={salon.salon_id}
              onClick={() => handleRowClick(salon.salon_id)} // 👈 Clickable row
              style={{ cursor: 'pointer' }} // 👈 Optional: visual feedback
            >
              <td>{salon.salon_name}</td>
              <td>{salon.salon_address}</td>
              <td>{new Date(salon.created_at).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AllSalonsPage;
