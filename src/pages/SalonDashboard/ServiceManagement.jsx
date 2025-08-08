import { useState, useEffect } from 'react';
import { ProtectedAPI } from '../../utils/api';
import LoadingSpinner from '../../components/LoadingSpinner';

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

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    setLoading(true);
    try {
      const response = await ProtectedAPI.get('/salon-admin/services');
      setServices(response.data);
    } catch (error) {
      console.error('Error fetching services:', error);
    } finally {
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
      ...service,
      price: service?.price ?? 0,
      duration_minutes: service?.duration_minutes ?? 0
    });
  };

  const handleCancel = () => {
    setIsAdding(false);
    setEditingId(null);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleAddService = async () => {
    try {
      const payload = {
        ...formData,
        price: Number(formData.price),
        duration_minutes: Number(formData.duration_minutes)
      };
      await ProtectedAPI.post('/salon-admin/services', payload);
      await fetchServices(); 
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
        ...formData,
        price: Number(formData.price),
        duration_minutes: Number(formData.duration_minutes)
      };
      console.log('Updating service with payload:', payload);
      await ProtectedAPI.put(`/salon-admin/services/${serviceId}`, payload);
      await fetchServices(); // <<< refresh the table after update too
      setEditingId(null);
      alert('Service updated successfully!');
    } catch (error) {
      console.error('Error updating service:', error);
      alert('Failed to update service');
    }
  };

  if (loading) return <LoadingSpinner message="Loading services..." />;

  return (
    <div className="max-w-8xl mx-auto p-1">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Service Management</h2>
        <button
          className="bg-green-500 text-white px-4 py-2 rounded disabled:bg-gray-400"
          onClick={handleAddNewClick}
          disabled={isAdding || editingId !== null}
        >
          Add New Service
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300">
          <thead className="bg-gray-400">
            <tr>
              <th className="px-4 py-2 text-left">Name</th>
              <th className="px-4 py-2 text-left">Description</th>
              <th className="px-4 py-2 text-left">Price</th>
              <th className="px-4 py-2 text-left">Duration</th>
              <th className="px-4 py-2 text-left">Category</th>
              <th className="px-4 py-2 text-left">Available</th>
              <th className="px-4 py-2 text-left">Show Price</th>
              <th className="px-4 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {/* ADD NEW */}
            {isAdding && (
              <tr className="bg-green-50">
                {['service_name', 'service_description'].map((field) => (
                  <td className="px-4 py-2" key={field}>
                    <input
                      type="text"
                      name={field}
                      value={formData[field]}
                      onChange={handleInputChange}
                      className="w-full border rounded p-2"
                    />
                  </td>
                ))}
                <td className="px-4 py-2">
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    className="w-full border rounded p-2"
                  />
                </td>
                <td className="px-4 py-2">
                  <input
                    type="number"
                    name="duration_minutes"
                    value={formData.duration_minutes}
                    onChange={handleInputChange}
                    className="w-full border rounded p-2"
                  />
                </td>
                <td className="px-4 py-2">
                  <select
                    name="service_category"
                    value={formData.service_category}
                    onChange={handleInputChange}
                    className="w-full border rounded p-2"
                  >
                    <option value="unisex">Unisex</option>
                    <option value="men">Men</option>
                    <option value="women">Women</option>
                  </select>
                </td>
                <td className="px-4 py-2 text-center">
                  <input
                    type="checkbox"
                    name="is_available"
                    checked={formData.is_available}
                    onChange={handleInputChange}
                    className="scale-125"
                  />
                </td>
                <td className="px-4 py-2 text-center">
                  <input
                    type="checkbox"
                    name="show_price"
                    checked={formData.show_price}
                    onChange={handleInputChange}
                    className="scale-125"
                  />
                </td>
                <td className="px-4 py-2">
                  <button className="bg-green-500 text-white px-2 py-1 rounded mr-2" onClick={handleAddService}>Save</button>
                  <button className="bg-red-500 text-white px-2 py-1 rounded" onClick={handleCancel}>Cancel</button>
                </td>
              </tr>
            )}

            {/* EXISTING */}
            {services.map((service) => (
              <tr key={service.service_id} className="hover:bg-gray-50">
                {['service_name', 'service_description'].map((field) => (
                  <td className="px-4 py-2" key={field}>
                    {editingId === service.service_id ? (
                      <input
                        type="text"
                        name={field}
                        value={formData[field]}
                        onChange={handleInputChange}
                        className="w-full border rounded p-2"
                      />
                    ) : (
                      service[field] ?? ''
                    )}
                  </td>
                ))}
                <td className="px-4 py-2">
                  {editingId === service.service_id ? (
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleInputChange}
                      className="w-full border rounded p-2"
                    />
                  ) : (
                    service.price ?? 0
                  )}
                </td>
                <td className="px-4 py-2">
                  {editingId === service.service_id ? (
                    <input
                      type="number"
                      name="duration_minutes"
                      value={formData.duration_minutes}
                      onChange={handleInputChange}
                      className="w-full border rounded p-2"
                    />
                  ) : (
                    `${service.duration_minutes ?? 0} mins`
                  )}
                </td>
                <td className="px-4 py-2">{editingId === service.service_id ? (
                  <select
                    name="service_category"
                    value={formData.service_category}
                    onChange={handleInputChange}
                    className="w-full border rounded p-2"
                  >
                    <option value="unisex">Unisex</option>
                    <option value="men">Men</option>
                    <option value="women">Women</option>
                  </select>
                ) : (
                  service.service_category ?? ''
                )}
                </td>
                <td className="px-4 py-2 text-center">
                  {editingId === service.service_id ? (
                    <input
                      type="checkbox"
                      name="is_available"
                      checked={formData.is_available}
                      onChange={handleInputChange}
                      className="scale-125"
                    />
                  ) : (
                    service.is_available ? 'Yes' : 'No'
                  )}
                </td>
                <td className="px-4 py-2 text-center">
                  {editingId === service.service_id ? (
                    <input
                      type="checkbox"
                      name="show_price"
                      checked={formData.show_price}
                      onChange={handleInputChange}
                      className="scale-125"
                    />
                  ) : (
                    service.show_price ? 'Yes' : 'No'
                  )}
                </td>
                <td className="px-4 py-2">
                  {editingId === service.service_id ? (
                    <>
                      <button className="bg-green-500 text-white px-2 py-1 rounded mr-2"
                        onClick={() => handleUpdateService(service.service_id)}>Save</button>
                      <button className="bg-red-500 text-white px-2 py-1 rounded"
                        onClick={handleCancel}>Cancel</button>
                    </>
                  ) : (
                    <button
                      className="bg-blue-500 text-white px-2 py-1 rounded"
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
    </div>
  );
};

export default ServiceManagement;
