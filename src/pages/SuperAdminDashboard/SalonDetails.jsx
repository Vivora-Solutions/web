import React, { useState } from 'react';
import Header from '../../components/Header/Header'; 
import './SalonDetails.css';

const RegisterSalons = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const salonsData = [
    { name: 'Salon ABC', address: '123 Main St, Colombo', date: '2025-07-01' },
    { name: 'Hair Haven', address: '456 Park Ave, Kandy', date: '2025-07-10' },
    { name: 'Style Studio', address: '789 Beach Rd, Galle', date: '2025-07-15' },
    { name: 'Glamour Spot', address: '321 Hill St, Negombo', date: '2025-07-18' },
    { name: 'Trendy Cuts', address: '654 River Rd, Matara', date: '2025-07-20' },
  ];

  const filteredSalons = salonsData.filter(salon =>
    salon.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="register-salons-page">
     <Header />
      <div className="salons-table-container">
        <h2>Register Salons</h2>
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search a Salon..."
            className="search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <table className="salons-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Address</th>
              <th>Registered Date</th>
            </tr>
          </thead>
          <tbody>
            {filteredSalons.map((salon, index) => (
              <tr key={index}>
                <td>
                  <div className="salon-entry">
                    <img src="https://via.placeholder.com/40" alt={`${salon.name} Logo`} className="salon-logo" />
                    <span>{salon.name}</span>
                  </div>
                </td>
                <td>{salon.address}</td>
                <td>{salon.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RegisterSalons;