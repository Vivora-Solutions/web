import React, { useState } from 'react';
import { FaRegEdit, FaTrashAlt, FaCheck, FaTimes } from 'react-icons/fa';
import EditableField from '../../../../components/EditableField/EditableField';
import './ServicesEditor.css';

const ServicesEditor = () => {
  const [services, setServices] = useState([
    { name: 'Hair Cutting and Shaving', price: 1400, time: 15, category: 'men' },
    { name: 'Hair Cutting and Shaving', price: 1400, time: 15, category: 'women' },
    { name: 'Hair Cutting and Shaving', price: 1400, time: 15, category: 'unisex' },
  ]);

  const [showPrices, setShowPrices] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [newService, setNewService] = useState({ name: '', price: '', time: '', category: 'unisex' });
  const [editingIndex, setEditingIndex] = useState(-1);

  const categoryOptions = [
    { value: 'men', label: 'Men' },
    { value: 'women', label: 'Women' },
    { value: 'unisex', label: 'Unisex' }
  ];

  const handleDelete = (index) => {
    const updated = [...services];
    updated.splice(index, 1);
    setServices(updated);
  };

  const addNewService = () => {
    setIsAdding(true);
    setNewService({ name: '', price: '', time: '', category: 'unisex' });
  };

  const handleSaveNewService = () => {
    if (newService.name && newService.price && newService.time) {
      setServices([...services, {
        name: newService.name,
        price: parseFloat(newService.price),
        time: newService.time,
        category: newService.category
      }]);
      setIsAdding(false);
      setNewService({ name: '', price: '', time: '', category: 'unisex' });
    }
  };

  const handleCancelNewService = () => {
    setIsAdding(false);
    setNewService({ name: '', price: '', time: '', category: 'unisex' });
  };

  const handleNewServiceChange = (field, value) => {
    setNewService(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleEditService = (index) => {
    setEditingIndex(index);
  };

  const handleSaveService = (index, field, value) => {
    const updated = [...services];
    updated[index] = {
      ...updated[index],
      [field]: field === 'price' ? parseFloat(value) : value
    };
    setServices(updated);
  };

  const handleCancelEdit = () => {
    setEditingIndex(-1);
  };

  const handleCategoryChange = (index, category) => {
    handleSaveService(index, 'category', category);
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
            <th>Category</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr className="add-service-row">
            <td colSpan={5}>
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
              <td>
                <select
                  value={newService.category}
                  onChange={(e) => handleNewServiceChange('category', e.target.value)}
                  className="service-select"
                >
                  {categoryOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
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
            <tr key={index} className={editingIndex === index ? 'editing-row' : ''}>
              <td>
                <EditableField
                  value={service.name}
                  onSave={(value) => handleSaveService(index, 'name', value)}
                  className={`table-editable ${editingIndex === index ? 'editing-enabled' : 'editing-disabled'}`}
                />
              </td>
              <td>
                <EditableField
                  value={`Rs. ${service.price}`}
                  onSave={(value) => handleSaveService(index, 'price', value.replace('Rs. ', ''))}
                  className={`table-editable ${editingIndex === index ? 'editing-enabled' : 'editing-disabled'}`}
                />
              </td>
              <td>
                <EditableField
                  value={`${service.time} minutes`}
                  onSave={(value) => handleSaveService(index, 'time', value.replace(' minutes', ''))}
                  className={`table-editable ${editingIndex === index ? 'editing-enabled' : 'editing-disabled'}`}
                />
              </td>
              <td>
                <select
                  value={service.category}
                  onChange={(e) => handleCategoryChange(index, e.target.value)}
                  className="category-select"
                  disabled={editingIndex !== -1 && editingIndex !== index}
                >
                  {categoryOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </td>
              <td className="action-buttons">
                {editingIndex === index ? (
                  <button className="cancel-edit-btn" onClick={handleCancelEdit}>
                    <FaTimes />
                  </button>
                ) : (
                  <>
                    <button className="edit-btn" onClick={() => handleEditService(index)}>
                      <FaRegEdit />
                    </button>
                    <button className="delete-btn" onClick={() => handleDelete(index)}>
                      <FaTrashAlt />
                    </button>
                  </>
                )}
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