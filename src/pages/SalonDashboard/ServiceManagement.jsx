import { useState, useEffect } from 'react';
import { Plus } from "lucide-react";
import { ProtectedAPI } from '../../utils/api';
import LoadingSpinner from '../../components/LoadingSpinner';
import AddServiceModal from './components/AddServiceModal';

const ServiceManagement = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);

  const DURATION_OPTIONS = Array.from({ length: 16 }, (_, i) => (i + 1) * 15);

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

  const resetForm = () => {
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

  const handleAddNewClick = () => {
    setEditingId(null);
    resetForm();
    setShowModal(true);
  };

  const handleEditClick = (service) => {
    setEditingId(service.service_id);
    setFormData({
      ...service,
      price: service?.price ?? 0,
      duration_minutes: service?.duration_minutes ?? 0
    });
    setShowModal(true);
  };

  const handleCancel = () => {
    setEditingId(null);
    setShowModal(false);
    resetForm();
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
      setModalLoading(true);
      const payload = {
        ...formData,
        price: Number(formData.price),
        duration_minutes: Number(formData.duration_minutes)
      };
      await ProtectedAPI.post('/salon-admin/services', payload);
      await fetchServices();
      setShowModal(false);
      resetForm();
      alert('Service added successfully!');
    } catch (error) {
      console.error('Error adding service:', error);
      alert('Failed to add service');
    } finally {
      setModalLoading(false);
    }
  };

  const handleUpdateService = async () => {
    try {
      setModalLoading(true);
      const payload = {
        ...formData,
        price: Number(formData.price),
        duration_minutes: Number(formData.duration_minutes)
      };
      await ProtectedAPI.put(`/salon-admin/services/${editingId}`, payload);
      await fetchServices();
      setEditingId(null);
      setShowModal(false);
      resetForm();
      alert('Service updated successfully!');
    } catch (error) {
      console.error('Error updating service:', error);
      alert('Failed to update service');
    } finally {
      setModalLoading(false);
    }
  };

  const handleSubmit = () => {
    if (editingId) {
      handleUpdateService();
    } else {
      handleAddService();
    }
  };

  if (loading) return <div className="animate-spin h-12 w-12 border-b-2 border-indigo-600 rounded-full mx-auto mt-8 mb-4"></div>

  return (
    <div className="min-h-screen bg-gray-100 p-1">
      {/* Header */}
      <div className="bg-white/95 backdrop-blur rounded-xl p-1 mb-6 flex justify-between items-center shadow-lg">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-1">
            Service Management
          </h2>
        </div>
        <button
          onClick={handleAddNewClick}
          className="px-6 py-3 bg-gray-800 text-white rounded-xl font-semibold flex items-center gap-2 shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all"
        >
          <Plus size={20} />
          Add New Service
        </button>
      </div>

      {/* Services Content */}
      <div className="bg-white/95 backdrop-blur rounded-xl p-1 shadow-lg">
        {/* Desktop Table */}
        <div className="hidden sm:block overflow-x-auto p-6">
          <table className="min-w-full border border-gray-300 text-sm bg-white rounded-lg overflow-hidden">
            <thead className="bg-gray-200 text-gray-700">
              <tr>
                <th className="px-4 py-3 text-left font-semibold">Name</th>
                <th className="px-4 py-3 text-left font-semibold">Description</th>
                <th className="px-4 py-3 text-left font-semibold">Price</th>
                <th className="px-4 py-3 text-left font-semibold">Duration</th>
                <th className="px-4 py-3 text-left font-semibold">Category</th>
                <th className="px-4 py-3 text-center font-semibold">Available</th>
                <th className="px-4 py-3 text-center font-semibold">Show Price</th>
                <th className="px-4 py-3 text-center font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {services.map((service) => (
                <tr key={service.service_id} className="hover:bg-gray-50 border-b border-gray-200">
                  <td className="px-4 py-3 font-medium text-gray-800">{service.service_name}</td>
                  <td className="px-4 py-3 text-gray-600 max-w-xs truncate">{service.service_description}</td>
                  <td className="px-4 py-3 font-semibold text-green-600">Rs. {service.price}</td>
                  <td className="px-4 py-3 text-gray-600">{service.duration_minutes} mins</td>
                  <td className="px-4 py-3">
                    <span className="inline-flex px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full capitalize">
                      {service.service_category}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                      service.is_available 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {service.is_available ? 'Yes' : 'No'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                      service.show_price 
                        ? 'bg-blue-100 text-blue-800' 
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                      {service.show_price ? 'Yes' : 'No'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button 
                      className="bg-gray-800 text-white px-3 py-1.5 rounded-lg text-xs hover:bg-gray-700 transition-colors" 
                      onClick={() => handleEditClick(service)}
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="block sm:hidden p-4">
          <div className="space-y-4">
            {services.map((service) => (
              <div key={service.service_id} className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg text-gray-800">{service.service_name}</h3>
                    <p className="text-gray-600 text-sm mt-1 line-clamp-2">{service.service_description}</p>
                  </div>
                  <button 
                    className="bg-gray-800 text-white px-3 py-1.5 rounded-lg text-xs hover:bg-gray-700 transition-colors ml-3" 
                    onClick={() => handleEditClick(service)}
                  >
                    Edit
                  </button>
                </div>
                
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="font-medium text-gray-700">Price:</span>
                    <span className="ml-1 font-semibold text-green-600">Rs. {service.price}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Duration:</span>
                    <span className="ml-1 text-gray-600">{service.duration_minutes} mins</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Category:</span>
                    <span className="ml-1 inline-flex px-2 py-0.5 text-xs bg-blue-100 text-blue-800 rounded-full capitalize">
                      {service.service_category}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`inline-flex px-2 py-0.5 text-xs font-medium rounded-full ${
                      service.is_available 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {service.is_available ? 'Available' : 'Unavailable'}
                    </span>
                    {service.show_price && (
                      <span className="inline-flex px-2 py-0.5 text-xs bg-blue-100 text-blue-800 rounded-full">
                        Price Shown
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Empty State */}
        {services.length === 0 && !loading && (
          <div className="text-center py-16 text-slate-500">
            <div className="w-16 h-16 mx-auto mb-4 bg-slate-200 rounded-full flex items-center justify-center">
              <Plus size={24} className="text-slate-400" />
            </div>
            <h3 className="text-xl font-semibold text-slate-700 mb-2">
              No Services Found
            </h3>
            <p className="mb-6">Start by adding your first service.</p>
          </div>
        )}
      </div>

      {/* Add/Edit Service Modal */}
      <AddServiceModal
        showModal={showModal}
        formData={formData}
        setFormData={setFormData}
        loading={modalLoading}
        isEditing={!!editingId}
        onClose={handleCancel}
        onSubmit={handleSubmit}
        onReset={resetForm}
      />
    </div>
  );
};

export default ServiceManagement;
