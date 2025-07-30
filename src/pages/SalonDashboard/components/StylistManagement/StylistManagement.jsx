import React, { useState, useEffect } from 'react';
import { User, Edit, Trash2, Plus, X, Save, Settings } from 'lucide-react';
import API from '../../../../utils/api';

const StylistManagement = () => {
  const [stylists, setStylists] = useState([]);
  const [services, setServices] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showServicesModal, setShowServicesModal] = useState(false);
  const [selectedStylist, setSelectedStylist] = useState(null);
  const [stylistServices, setStylistServices] = useState([]);
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    stylist_name: '',
    stylist_contact_number: '',
    profile_pic_link: '',
    bio: '',
   
    is_active: true
  });

  useEffect(() => {
    fetchServices();
    fetchStylists();
  }, []);

  const fetchServices = async () => {
    try {
      const response = await API.get('/salon-admin/service');
      setServices(response.data);
    } catch (error) {
      console.error('Error fetching services:', error);
    }
  };

  const fetchStylists = async () => {
    try {
      const response = await API.get('/salon-admin/stylists');
      setStylists(response.data.data);
    } catch (error) {
      console.error('Error fetching stylists:', error);
    }
  };

  const fetchStylistServices = async (stylistId) => {
    try {
      const response = await API.get(`/salon-admin/stylist/${stylistId}/services`);
      setStylistServices(response.data.map(service => service.service_id));
    } catch (error) {
      console.error('Error fetching stylist services:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      stylist_name: '',
      stylist_contact_number: '',
      profile_pic_link: '',
      bio: '',
      salon_id: '',
      is_active: true
    });
  };

  const handleAddStylist = async () => {
    setLoading(true);
    try {
      await API.post('/salon-admin/stylist', formData);
      setShowAddForm(false);
      resetForm();
      fetchStylists();
    } catch (error) {
      console.error('Error adding stylist:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteStylist = async (stylistId) => {
    if (window.confirm('Delete this stylist?')) {
      try {
      
        await API.put(`/salon-admin/stylist/${stylistId}/hide`, {
  is_active: false,
});

        fetchStylists();
      } catch (error) {
        console.error('Error deleting stylist:', error);
      }
    }
  };

  const handleManageServices = async (stylist) => {
    setSelectedStylist(stylist);
    await fetchStylistServices(stylist.stylist_id);
    setShowServicesModal(true);
  };

  const handleServiceToggle = (serviceId) => {
    setStylistServices(prev => 
      prev.includes(serviceId)
        ? prev.filter(id => id !== serviceId)
        : [...prev, serviceId]
    );
  };

  const handleUpdateServices = async () => {
    setLoading(true);
    try {
      await API.post('/salon-admin/stylist/services', {
        stylist_id: selectedStylist.stylist_id,
        service_ids: stylistServices
      });
      setShowServicesModal(false);
      setSelectedStylist(null);
    } catch (error) {
      console.error('Error updating services:', error);
    } finally {
      setLoading(false);
    }
  };




  return (
    <div className="p-4 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold">Employees</h1>
        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center gap-1 bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600"
        >
          <Plus size={16} />
          Add Employee
        </button>
      </div>

      {/* Stylists List */}
      <div className="bg-white rounded shadow p-4">
        {stylists.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No employees found</p>
        ) : (
          <div className="space-y-2">
            {stylists.map((stylist) => (
              <div key={stylist.stylist_id} className="flex items-center justify-between p-3 border rounded">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                    {stylist.profile_pic_link ? (
                      <img 
                        src={stylist.profile_pic_link} 
                        alt={stylist.stylist_name}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                    ) : (
                      <User size={16} className="text-gray-500" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-medium text-sm">{stylist.stylist_name}</h3>
                    <p className="text-gray-600 text-xs">{stylist.stylist_contact_number}</p>
                  </div>
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={() => handleManageServices(stylist)}
                    className="p-1 text-green-500 hover:bg-green-50 rounded"
                    title="Manage Services"
                  >
                    <Settings size={16} />
                  </button>
                  <button
                    onClick={() => handleDeleteStylist(stylist.stylist_id)}
                    className="p-1 text-red-500 hover:bg-red-50 rounded"
                    title="Delete"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Stylist Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded p-4 w-full max-w-sm">
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-lg font-medium">Add Employee</h2>
              <button onClick={() => { setShowAddForm(false); resetForm(); }}>
                <X size={20} />
              </button>
            </div>

            <div className="space-y-3">
              <input
                type="text"
                placeholder="Name"
                value={formData.stylist_name}
                onChange={(e) => setFormData(prev => ({...prev, stylist_name: e.target.value}))}
                className="w-full p-2 border rounded text-sm"
                required
              />
              
              <input
                type="tel"
                placeholder="Contact Number"
                value={formData.stylist_contact_number}
                onChange={(e) => setFormData(prev => ({...prev, stylist_contact_number: e.target.value}))}
                className="w-full p-2 border rounded text-sm"
                required
              />
              
              <input
                type="url"
                placeholder="Profile Picture URL (optional)"
                value={formData.profile_pic_link}
                onChange={(e) => setFormData(prev => ({...prev, profile_pic_link: e.target.value}))}
                className="w-full p-2 border rounded text-sm"
              />
              
              <textarea
                placeholder="Bio (optional)"
                value={formData.bio}
                onChange={(e) => setFormData(prev => ({...prev, bio: e.target.value}))}
                rows={2}
                className="w-full p-2 border rounded text-sm"
              />
              
              {/* <input
                type="text"
                placeholder="Salon ID"
                value={formData.salon_id}
                onChange={(e) => setFormData(prev => ({...prev, salon_id: e.target.value}))}
                className="w-full p-2 border rounded text-sm"
                required
              /> */}

              <button
                onClick={handleAddStylist}
                disabled={loading}
                className="w-full bg-gray-800 text-white py-2 rounded text-sm hover:bg-gray-900 disabled:opacity-50"
              >
                {loading ? 'Adding...' : 'Add Employee'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Services Management Modal */}
      {showServicesModal && selectedStylist && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded p-4 w-full max-w-md max-h-96 overflow-y-auto">
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-lg font-medium">Services for {selectedStylist.stylist_name}</h2>
              <button onClick={() => { setShowServicesModal(false); setSelectedStylist(null); }}>
                <X size={20} />
              </button>
            </div>

            <div className="space-y-2 mb-4">
              {services.map((service) => (
                <label key={service.service_id} className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={stylistServices.includes(service.service_id)}
                    onChange={() => handleServiceToggle(service.service_id)}
                    className="w-4 h-4"
                  />
                  <span>{service.service_name} - {service.service_category}</span>
                </label>
              ))}
            </div>

            <button
              onClick={handleUpdateServices}
              disabled={loading}
              className="w-full bg-green-600 text-white py-2 rounded text-sm hover:bg-green-700 disabled:opacity-50"
            >
              {loading ? 'Updating...' : 'Update Services'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default StylistManagement;