import React, { useState } from 'react';
import { FaRegEdit, FaTrashAlt, FaCheck, FaTimes } from 'react-icons/fa';
import './ServicesEditor.css';

const ServicesEditor = () => {
  const [services, setServices] = useState([
    { name: 'Hair Cutting and Shaving', price: 1400, time: 15 },
    { name: 'Hair Cutting and Shaving', price: 1400, time: 15 },
    { name: 'Hair Cutting and Shaving', price: 1400, time: 15 },
  ]);

  const [showPrices, setShowPrices] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [newService, setNewService] = useState({ name: '', price: '', time: '' });

  const handleDelete = (index) => {
    const updated = [...services];
    updated.splice(index, 1);
    setServices(updated);
  };

  const addNewService = () => {
    setIsAdding(true);
    setNewService({ name: '', price: '', time: '' });
  };

  const handleSaveNewService = () => {
    if (newService.name && newService.price && newService.time) {
      setServices([...services, {
        name: newService.name,
        price: parseFloat(newService.price),
        time: newService.time
      }]);
      setIsAdding(false);
      setNewService({ name: '', price: '', time: '' });
    }
  };

  const handleCancelNewService = () => {
    setIsAdding(false);
    setNewService({ name: '', price: '', time: '' });
  };

  const handleNewServiceChange = (field, value) => {
    setNewService(prev => ({
      ...prev,
      [field]: value
    }));
  };

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
              <button 
                className="add-service-btn" 
                onClick={addNewService}
                disabled={isAdding}
              >
                + Add Service
              </button>
            </td>
          </tr>
          
          {isAdding && (
            <tr className="new-service-row">
              <td>
                <input
                  type="text"
                  placeholder="Service name"
                  value={newService.name}
                  onChange={(e) => handleNewServiceChange('name', e.target.value)}
                  className="service-input"
                />
              </td>
              <td>
                <input
                  type="number"
                  placeholder="Price"
                  value={newService.price}
                  onChange={(e) => handleNewServiceChange('price', e.target.value)}
                  className="service-input"
                />
              </td>
              <td>
                <input
                  type="text"
                  placeholder="Time in minutes"
                  value={newService.time}
                  onChange={(e) => handleNewServiceChange('time', e.target.value)}
                  className="service-input"
                />
              </td>
              <td className="action-buttons">
                <button className="save-btn" onClick={handleSaveNewService}>
                  <FaCheck />
                </button>
                <button className="cancel-btn" onClick={handleCancelNewService}>
                  <FaTimes />
                </button>
              </td>
            </tr>
          )}

          {services.map((service, index) => (
            <tr key={index}>
              <td>{service.name}</td>
              <td>Rs. {service.price}</td>
              <td>{service.time} minutes</td>
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