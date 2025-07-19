import React, { useState } from 'react';
import { FaRegEdit, FaTrashAlt } from 'react-icons/fa';
import './ServicesEditor.css';

const ServicesEditor = () => {
  const [services, setServices] = useState([
    { name: 'Hair Cutting and Shaving', price: 1400, time: '15 minutes' },
    { name: 'Hair Cutting and Shaving', price: 1400, time: '15 minutes' },
    { name: 'Hair Cutting and Shaving', price: 1400, time: '15 minutes' },
  ]);

  const [showPrices, setShowPrices] = useState(true);

  const handleDelete = (index) => {
    const updated = [...services];
    updated.splice(index, 1);
    setServices(updated);
  };

  const addNewService = () => {
    console.log("Add new service clicked");
  }

  return (
    <div className="services-container">
      <div className="services-header">
        <h3>Services</h3>
        <label className="show-prices">
          <input
            type="checkbox"
            checked={showPrices}
            onChange={() => {setShowPrices(!showPrices); console.log("Toggle prices visibility")}}
          />
          Show Prices
        </label>
      </div>

      <table className="services-table">
        <thead>
          <tr>
            <th>Service</th>
            <th>Price</th>
            <th>Time</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr className="add-service-row">
            <td colSpan={4}>
              <button className="add-service-btn" onclick={addNewService}>
                + Add Service
              </button>
            </td>
          </tr>
          {services.map((service, index) => (
            <tr key={index}>
              <td>{service.name}</td>
              <td>Rs. {service.price}</td>
              <td>{service.time}</td>
              <td className="action-buttons">
                <button className="edit-btn">
                  <FaRegEdit />
                </button>
                <button className="delete-btn" onClick={() => handleDelete(index)}>
                  <FaTrashAlt />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <button className="save-update-btn" onClick={() => {console.log("Services saved")}}>Save and Update</button>
    </div>
  );
};

export default ServicesEditor;
