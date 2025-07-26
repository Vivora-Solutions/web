import React, { useState, useEffect } from 'react';
import API from '../../../../utils/api';
import './ServiceManagement.css';

const ServiceManagement = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState({
    service_name: '',
    service_description: '',
    service_image_link: '',
    price: 0,
    duration_minutes: 30,
    is_available: true,
    service_category: 'unisex',
    show_price: false
  });

  // Fetch services on mount
  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const response = await API.get('/salon-admin/service');
      setServices(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching services:', error);
      setLoading(false);
    }
  };

  const handleAddNewClick = () => {
    setIsAdding(true);
    setEditingId(null);
    setFormData({
      service_name: '',
      service_description: '',
      service_image_link: '',
      price: 0,
      duration_minutes: 30,
      is_available: true,
      service_category: 'unisex',
      show_price: false
    });
  };

  const handleEditClick = (service) => {
    setIsAdding(false);
    setEditingId(service.service_id);
    setFormData({
      service_name: service.service_name,
      service_description: service.service_description,
      service_image_link: service.service_image_link,
      price: service.price,
      duration_minutes: service.duration_minutes,
      is_available: service.is_available,
      service_category: service.service_category,
      show_price: service.show_price
    });
  };

  const handleCancel = () => {
    setIsAdding(false);
    setEditingId(null);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleAddService = async () => {
    try {
      const payload = {
        service_name: formData.service_name,
        service_description: formData.service_description,
        service_image_link: formData.service_image_link,
        price: Number(formData.price),
        duration_minutes: Number(formData.duration_minutes),
        service_category: formData.service_category,
        show_price: formData.show_price
      };

      const response = await API.post('/salon-admin/service', payload);
      
      // Add the new service to the list
      setServices([...services, response.data]);
      setIsAdding(false);
      alert('Service added successfully!');
    } catch (error) {
      console.error('Error adding service:', error);
      alert('Failed to add service');
    }
  };

  const handleUpdateService = async (serviceId) => {
    try {
      const payload = {
        service_name: formData.service_name,
        service_description: formData.service_description,
        service_image_link: formData.service_image_link,
        price: Number(formData.price),
        duration_minutes: Number(formData.duration_minutes),
        is_available: formData.is_available,
        service_category: formData.service_category,
        show_price: formData.show_price
      };

      await API.put(`/salon-admin/service/${serviceId}`, payload);
      
      // Update local state
      setServices(services.map(service => 
        service.service_id === serviceId ? { ...service, ...payload } : service
      ));
      
      setEditingId(null);
      alert('Service updated successfully!');
    } catch (error) {
      console.error('Error updating service:', error);
      alert('Failed to update service');
    }
  };

  if (loading) return <div className="service-management-container">Loading services...</div>;

  return (
    <div className="service-management-container">
      <div className="header-section">
        <h2>Service Management</h2>
        <button 
          className="add-new-btn"
          onClick={handleAddNewClick}
          disabled={isAdding || editingId !== null}
        >
          Add New Service
        </button>
      </div>

      <table className="service-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Description</th>
            <th>Price</th>
            <th>Duration</th>
            <th>Category</th>
            <th>Available</th>
            <th>Show Price</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {/* Add New Service Row */}
          {isAdding && (
            <tr className="adding-row">
              <td>
                <input
                  type="text"
                  name="service_name"
                  value={formData.service_name}
                  onChange={handleInputChange}
                  placeholder="Service name"
                  required
                />
              </td>
              <td>
                <input
                  type="text"
                  name="service_description"
                  value={formData.service_description}
                  onChange={handleInputChange}
                  placeholder="Description"
                />
              </td>
              <td>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  min="0"
                />
              </td>
              <td>
                <input
                  type="number"
                  name="duration_minutes"
                  value={formData.duration_minutes}
                  onChange={handleInputChange}
                  min="1"
                />
              </td>
              <td>
                <select
                  name="service_category"
                  value={formData.service_category}
                  onChange={handleInputChange}
                >
                  <option value="unisex">Unisex</option>
                  <option value="men">Men</option>
                  <option value="women">Women</option>
                </select>
              </td>
              <td>
                <input
                  type="checkbox"
                  name="is_available"
                  checked={formData.is_available}
                  onChange={handleInputChange}
                />
              </td>
              <td>
                <input
                  type="checkbox"
                  name="show_price"
                  checked={formData.show_price}
                  onChange={handleInputChange}
                />
              </td>
              <td>
                <button 
                  className="save-btn"
                  onClick={handleAddService}
                >
                  Save
                </button>
                <button 
                  className="cancel-btn"
                  onClick={handleCancel}
                >
                  Cancel
                </button>
              </td>
            </tr>
          )}

          {/* Existing Services */}
          {services.map(service => (
            <tr key={service.service_id}>
              <td>
                {editingId === service.service_id ? (
                  <input
                    type="text"
                    name="service_name"
                    value={formData.service_name}
                    onChange={handleInputChange}
                  />
                ) : (
                  service.service_name
                )}
              </td>
              <td>
                {editingId === service.service_id ? (
                  <input
                    type="text"
                    name="service_description"
                    value={formData.service_description}
                    onChange={handleInputChange}
                  />
                ) : (
                  service.service_description
                )}
              </td>
              <td>
                {editingId === service.service_id ? (
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                  />
                ) : (
                  service.price
                )}
              </td>
              <td>
                {editingId === service.service_id ? (
                  <input
                    type="number"
                    name="duration_minutes"
                    value={formData.duration_minutes}
                    onChange={handleInputChange}
                  />
                ) : (
                  `${service.duration_minutes} mins`
                )}
              </td>
              <td>
                {editingId === service.service_id ? (
                  <select
                    name="service_category"
                    value={formData.service_category}
                    onChange={handleInputChange}
                  >
                    <option value="unisex">Unisex</option>
                    <option value="men">Men</option>
                    <option value="women">Women</option>
                  </select>
                ) : (
                  service.service_category
                )}
              </td>
              <td>
                {editingId === service.service_id ? (
                  <input
                    type="checkbox"
                    name="is_available"
                    checked={formData.is_available}
                    onChange={handleInputChange}
                  />
                ) : (
                  service.is_available ? 'Yes' : 'No'
                )}
              </td>
              <td>
                {editingId === service.service_id ? (
                  <input
                    type="checkbox"
                    name="show_price"
                    checked={formData.show_price}
                    onChange={handleInputChange}
                  />
                ) : (
                  service.show_price ? 'Yes' : 'No'
                )}
              </td>
              <td>
                {editingId === service.service_id ? (
                  <>
                    <button 
                      className="save-btn"
                      onClick={() => handleUpdateService(service.service_id)}
                    >
                      Save
                    </button>
                    <button 
                      className="cancel-btn"
                      onClick={handleCancel}
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <button 
                    className="edit-btn"
                    onClick={() => handleEditClick(service)}
                    disabled={isAdding}
                  >
                    Edit
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ServiceManagement;