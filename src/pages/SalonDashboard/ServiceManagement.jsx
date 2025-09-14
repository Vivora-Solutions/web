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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 p-1">
        <div className="bg-gradient-to-br from-emerald-50 via-cyan-50 to-blue-50 rounded-xl p-6 mb-6 shadow-lg border border-gray-200">
          {/* Loading Header */}
          <div className="mb-8 text-center">
            <div className="relative inline-block">
              {/* Animated Salon Services Icons */}
              <div className="w-20 h-20 mx-auto mb-4 relative">
                <div className="absolute inset-0 bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-500 rounded-full animate-pulse"></div>
                <div className="absolute inset-1 bg-white rounded-full flex items-center justify-center">
                  {/* Scissors Icon */}
                  <svg className="w-10 h-10 text-purple-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M9.64 7.64c.23-.5.36-1.05.36-1.64 0-2.21-1.79-4-4-4S2 3.79 2 6s1.79 4 4 4c.59 0 1.14-.13 1.64-.36L10 12l-2.36 2.36C7.14 14.13 6.59 14 6 14c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4c0-.59-.13-1.14-.36-1.64L12 14l7 7h3v-1L9.64 7.64zM6 8c-1.1 0-2-.89-2-2s.89-2 2-2 2 .89 2 2-.89 2-2 2zm0 12c-1.1 0-2-.89-2-2s.89-2 2-2 2 .89 2 2-.89 2-2 2zm6-7.5c-.28 0-.5-.22-.5-.5s.22-.5.5-.5.5.22.5.5-.22.5-.5.5zM19 3l-6 6 2 2 7-7V3z"/>
                  </svg>
                </div>
                
                {/* Rotating border */}
                <div className="absolute inset-0 border-4 border-transparent border-t-pink-500 rounded-full animate-spin"></div>
              </div>
              
              {/* Floating salon service icons */}
              <div className="absolute -top-4 -left-4 w-8 h-8 bg-pink-100 rounded-full flex items-center justify-center animate-bounce" style={{animationDelay: '0s'}}>
                💅
              </div>
              <div className="absolute -top-4 -right-4 w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center animate-bounce" style={{animationDelay: '0.5s'}}>
                ✂️
              </div>
              <div className="absolute -bottom-4 -left-4 w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center animate-bounce" style={{animationDelay: '1s'}}>
                💇‍♀️
              </div>
              <div className="absolute -bottom-4 -right-4 w-8 h-8 bg-pink-100 rounded-full flex items-center justify-center animate-bounce" style={{animationDelay: '1.5s'}}>
                🧴
              </div>
            </div>
            
            <h2 className="text-2xl font-bold text-gray-800 mb-2 animate-fade-in">
              Loading Salon Services
            </h2>
            <p className="text-gray-600 animate-fade-in-delay">
              Preparing your beauty services menu...
            </p>
          </div>

          {/* Header Skeleton */}
          <div className="bg-white/95 backdrop-blur rounded-xl p-4 mb-6 shadow-lg">
            <div className="flex justify-between items-center">
              <div className="space-y-2">
                <div className="h-6 bg-gray-200 rounded w-48 animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-64 animate-pulse"></div>
              </div>
              <div className="h-10 bg-gray-200 rounded-lg w-32 animate-pulse"></div>
            </div>
          </div>

          {/* Services Grid Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
            {[...Array(6)].map((_, index) => {
              const serviceTypes = [
                { 
                  icon: '💇‍♀️', 
                  name: 'Hair Styling', 
                  desc: 'Professional hair cutting and styling',
                  price: 'Rs. 1500',
                  duration: '45 mins',
                  colors: { bg: 'bg-pink-100', icon: 'bg-pink-200', price: 'bg-pink-300', badge: 'bg-pink-400' }
                },
                { 
                  icon: '💅', 
                  name: 'Nail Polish', 
                  desc: 'Beautiful nail art and polishing',
                  price: 'Rs. 800',
                  duration: '30 mins',
                  colors: { bg: 'bg-purple-100', icon: 'bg-purple-200', price: 'bg-purple-300', badge: 'bg-purple-400' }
                },
                { 
                  icon: '🧴', 
                  name: 'Facial Treatment', 
                  desc: 'Relaxing and rejuvenating facial care',
                  price: 'Rs. 2000',
                  duration: '60 mins',
                  colors: { bg: 'bg-emerald-100', icon: 'bg-emerald-200', price: 'bg-emerald-300', badge: 'bg-emerald-400' }
                },
                { 
                  icon: '✂️', 
                  name: 'Hair Cut', 
                  desc: 'Precision hair cutting service',
                  price: 'Rs. 1000',
                  duration: '30 mins',
                  colors: { bg: 'bg-cyan-100', icon: 'bg-cyan-200', price: 'bg-cyan-300', badge: 'bg-cyan-400' }
                },
                { 
                  icon: '💆‍♀️', 
                  name: 'Hair Massage', 
                  desc: 'Relaxing scalp and hair massage',
                  price: 'Rs. 1200',
                  duration: '40 mins',
                  colors: { bg: 'bg-indigo-100', icon: 'bg-indigo-200', price: 'bg-indigo-300', badge: 'bg-indigo-400' }
                },
                { 
                  icon: '✨', 
                  name: 'Beauty Package', 
                  desc: 'Complete beauty makeover',
                  price: 'Rs. 3000',
                  duration: '90 mins',
                  colors: { bg: 'bg-rose-100', icon: 'bg-rose-200', price: 'bg-rose-300', badge: 'bg-rose-400' }
                }
              ];
              
              const service = serviceTypes[index % serviceTypes.length];
              
              return (
                <div 
                  key={index} 
                  className={`${service.colors.bg} rounded-xl shadow-lg p-6 animate-pulse hover:shadow-xl transition-all duration-300 border border-white/50`}
                  style={{animationDelay: `${index * 0.15}s`}}
                >
                  {/* Service Icon */}
                  <div className={`w-16 h-16 ${service.colors.icon} rounded-full mb-4 flex items-center justify-center text-3xl animate-bounce shadow-lg`} 
                       style={{animationDelay: `${index * 0.2}s`}}>
                    {service.icon}
                  </div>
                  
                  {/* Service Name */}
                  <div className="h-7 bg-white/70 rounded-lg mb-3 w-3/4 animate-shimmer backdrop-blur-sm shadow-sm"></div>
                  
                  {/* Service Description Preview */}
                  <div className="space-y-2 mb-4">
                    <div className="h-4 bg-white/60 rounded w-full animate-shimmer" style={{animationDelay: '0.1s'}}></div>
                    <div className="h-4 bg-white/60 rounded w-4/5 animate-shimmer" style={{animationDelay: '0.2s'}}></div>
                  </div>
                  
                  {/* Price Display */}
                  <div className="flex justify-between items-center mb-4">
                    <div className={`h-7 ${service.colors.price} rounded-lg w-24 font-bold animate-pulse shadow-sm`}></div>
                    <div className="h-5 bg-white/60 rounded w-20 animate-shimmer"></div>
                  </div>
                  
                  {/* Category & Status Badges */}
                  <div className="flex space-x-2 mb-4">
                    <div className={`h-6 ${service.colors.badge} rounded-full w-20 animate-pulse shadow-sm`}></div>
                    <div className="h-6 bg-green-200 rounded-full w-16 animate-pulse shadow-sm"></div>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex justify-between items-center">
                    <div className="h-6 bg-white/60 rounded w-16 animate-pulse"></div>
                    <div className="h-9 bg-gradient-to-r from-purple-300 to-pink-300 rounded-lg w-20 animate-pulse shadow-md"></div>
                  </div>
                  
                  {/* Decorative Elements */}
                  <div className="absolute top-2 right-2 w-2 h-2 bg-white/80 rounded-full animate-ping"></div>
                </div>
              );
            })}
          </div>

          {/* Empty State Preview */}
          <div className="text-center py-12 animate-pulse">
            {/* Salon Services Icon Cluster */}
            <div className="relative w-24 h-24 mx-auto mb-6">
              <div className="absolute inset-0 bg-gradient-to-br from-pink-200 to-purple-200 rounded-full animate-pulse"></div>
              <div className="absolute inset-2 bg-white rounded-full flex items-center justify-center">
                <div className="text-3xl animate-bounce">💄</div>
              </div>
              {/* Surrounding service icons */}
              <div className="absolute -top-2 -left-2 w-8 h-8 bg-pink-100 rounded-full flex items-center justify-center text-sm animate-bounce" style={{animationDelay: '0.2s'}}>
                💅
              </div>
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center text-sm animate-bounce" style={{animationDelay: '0.4s'}}>
                ✂️
              </div>
              <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center text-sm animate-bounce" style={{animationDelay: '0.6s'}}>
                🧴
              </div>
            </div>
            
            <div className="h-7 bg-gradient-to-r from-pink-200 to-purple-200 rounded-lg w-56 mx-auto mb-3 animate-shimmer"></div>
            <div className="h-5 bg-gray-200 rounded w-72 mx-auto mb-6 animate-shimmer" style={{animationDelay: '0.1s'}}></div>
            
            {/* Preview service options */}
            <div className="flex justify-center space-x-3 mb-6">
              <div className="h-8 bg-pink-200 rounded-full w-24 animate-pulse"></div>
              <div className="h-8 bg-purple-200 rounded-full w-28 animate-pulse" style={{animationDelay: '0.1s'}}></div>
              <div className="h-8 bg-indigo-200 rounded-full w-20 animate-pulse" style={{animationDelay: '0.2s'}}></div>
            </div>
            
            <div className="h-11 bg-gradient-to-r from-purple-300 to-pink-300 rounded-lg w-40 mx-auto animate-pulse shadow-lg"></div>
          </div>

          {/* Progress Indicators */}
          <div className="flex justify-center space-x-2 mt-8">
            <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce" style={{animationDelay: '0s'}}></div>
            <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
            <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{animationDelay: '0.4s'}}></div>
            <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce" style={{animationDelay: '0.6s'}}></div>
          </div>

          {/* Custom animations */}
          <style jsx>{`
            @keyframes fade-in {
              from { opacity: 0; transform: translateY(10px); }
              to { opacity: 1; transform: translateY(0); }
            }
            
            @keyframes fade-in-delay {
              0% { opacity: 0; transform: translateY(10px); }
              50% { opacity: 0; transform: translateY(10px); }
              100% { opacity: 1; transform: translateY(0); }
            }
            
            @keyframes shimmer {
              0% { 
                background-position: -200% 0;
                opacity: 0.7;
              }
              100% { 
                background-position: 200% 0;
                opacity: 1;
              }
            }
            
            .animate-fade-in {
              animation: fade-in 1s ease-out;
            }
            
            .animate-fade-in-delay {
              animation: fade-in-delay 2s ease-out;
            }
            
            .animate-shimmer {
              background: linear-gradient(90deg, transparent, rgba(255,255,255,0.9), transparent);
              background-size: 200% 100%;
              animation: shimmer 2s ease-in-out infinite;
            }
          `}</style>
        </div>
      </div>
    );
  }

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
