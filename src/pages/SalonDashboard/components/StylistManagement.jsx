import React, { useState, useEffect } from "react";
import {
  User,
  Trash2,
  Plus,
  X,
  Settings,
} from "lucide-react";
import API from "../../../utils/api";
import LoadingSpinner from "../../../components/LoadingSpinner/LoadingSpinner";

const StylistManagement = () => {
  const [stylists, setStylists] = useState([]);
  const [services, setServices] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showServicesModal, setShowServicesModal] = useState(false);
  const [selectedStylist, setSelectedStylist] = useState(null);
  const [stylistServices, setStylistServices] = useState([]);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    stylist_name: "",
    stylist_contact_number: "",
    profile_pic_link: "",
    bio: "",
    is_active: true,
  });

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await fetchServices();
      await fetchStylists();
      setLoading(false);
    };
    loadData();
  }, []);

  const fetchServices = async () => {
    try {
      const response = await API.get("/salon-admin/services");
      setServices(response.data);
    } catch (error) {
      console.error("Error fetching services:", error);
    }
  };

  const fetchStylists = async () => {
    try {
      const response = await API.get("/salon-admin/stylists");
      setStylists(response.data);
    } catch (error) {
      console.error("Error fetching stylists:", error);
    }
  };

  const fetchStylistServices = async (stylistId) => {
    try {
      const response = await API.get(
        `/salon-admin/stylist/${stylistId}/services`
      );
      setStylistServices(response.data.map((service) => service.service_id));
    } catch (error) {
      console.error("Error fetching stylist services:", error);
    }
  };

  const resetForm = () => {
    setFormData({
      stylist_name: "",
      stylist_contact_number: "",
      profile_pic_link: "",
      bio: "",
      salon_id: "",
      is_active: true,
    });
  };

  const handleAddStylist = async () => {
    setLoading(true);
    try {
      await API.post("/salon-admin/stylist", formData);
      setShowAddForm(false);
      resetForm();
      fetchStylists();
    } catch (error) {
      console.error("Error adding stylist:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteStylist = async (stylistId) => {
    if (window.confirm("Delete this stylist?")) {
      try {
        await API.put(`/salon-admin/stylist/${stylistId}/hide`, {
          is_active: false,
        });
        fetchStylists();
      } catch (error) {
        console.error("Error deleting stylist:", error);
      }
    }
  };

  const handleManageServices = async (stylist) => {
    setSelectedStylist(stylist);
    await fetchStylistServices(stylist.stylist_id);
    setShowServicesModal(true);
  };

  const handleServiceToggle = (serviceId) => {
    setStylistServices((prev) =>
      prev.includes(serviceId)
        ? prev.filter((id) => id !== serviceId)
        : [...prev, serviceId]
    );
  };

  const handleUpdateServices = async () => {
    setLoading(true);
    try {
      await API.post("/salon-admin/stylist/services", {
        stylist_id: selectedStylist.stylist_id,
        service_ids: stylistServices,
      });
      setShowServicesModal(false);
      setSelectedStylist(null);
    } catch (error) {
      console.error("Error updating services:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner message="Loading stylists..." />;

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold">Employees</h1>
        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center gap-2 px-3 py-1.5 text-sm text-white bg-blue-600 hover:bg-blue-700 rounded-md"
        >
          <Plus size={16} /> Add Employee
        </button>
      </div>

      <div className="bg-white rounded-lg shadow p-4">
        {stylists.length === 0 ? (
          <p className="text-center text-gray-500">No employees found</p>
        ) : (
          <div className="space-y-3">
            {stylists.map((stylist) => (
              <div
                key={stylist.stylist_id}
                className="flex justify-between items-center p-3 border rounded-md"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden">
                    {stylist.profile_pic_link ? (
                      <img
                        src={stylist.profile_pic_link}
                        alt={stylist.stylist_name}
                        className="object-cover w-full h-full"
                      />
                    ) : (
                      <User size={20} className="text-gray-400" />
                    )}
                  </div>
                  <div>
                    <div className="font-medium text-sm">
                      {stylist.stylist_name}
                    </div>
                    <div className="text-xs text-gray-500">
                      {stylist.stylist_contact_number}
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleManageServices(stylist)}
                    className="text-green-600 hover:bg-green-100 p-1.5 rounded"
                    title="Manage Services"
                  >
                    <Settings size={16} />
                  </button>
                  <button
                    onClick={() => handleDeleteStylist(stylist.stylist_id)}
                    className="text-red-600 hover:bg-red-100 p-1.5 rounded"
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

      {/* Add Modal */}
      {showAddForm && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-full max-w-sm">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Add Employee</h2>
              <button onClick={() => { setShowAddForm(false); resetForm(); }}>
                <X size={20} />
              </button>
            </div>

            <div className="space-y-3">
              <input
                type="text"
                placeholder="Name"
                value={formData.stylist_name}
                onChange={(e) => setFormData((prev) => ({ ...prev, stylist_name: e.target.value }))}
                className="w-full p-2 text-sm border rounded-md"
              />
              <input
                type="tel"
                placeholder="Contact Number"
                value={formData.stylist_contact_number}
                onChange={(e) => setFormData((prev) => ({ ...prev, stylist_contact_number: e.target.value }))}
                className="w-full p-2 text-sm border rounded-md"
              />
              <input
                type="url"
                placeholder="Profile Picture URL"
                value={formData.profile_pic_link}
                onChange={(e) => setFormData((prev) => ({ ...prev, profile_pic_link: e.target.value }))}
                className="w-full p-2 text-sm border rounded-md"
              />
              <textarea
                rows={2}
                placeholder="Bio"
                value={formData.bio}
                onChange={(e) => setFormData((prev) => ({ ...prev, bio: e.target.value }))}
                className="w-full p-2 text-sm border rounded-md"
              />
              <button
                onClick={handleAddStylist}
                disabled={loading}
                className="w-full py-2 bg-gray-800 hover:bg-gray-900 text-white rounded-md text-sm disabled:opacity-50"
              >
                {loading ? "Adding..." : "Add Employee"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Manage Services Modal */}
      {showServicesModal && selectedStylist && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">
                Services for {selectedStylist.stylist_name}
              </h2>
              <button
                onClick={() => {
                  setShowServicesModal(false);
                  setSelectedStylist(null);
                }}
              >
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
                  <span>
                    {service.service_name} - {service.service_category}
                  </span>
                </label>
              ))}
            </div>
            <button
              onClick={handleUpdateServices}
              disabled={loading}
              className="w-full py-2 bg-green-600 hover:bg-green-700 text-white rounded-md text-sm disabled:opacity-50"
            >
              {loading ? "Updating..." : "Update Services"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default StylistManagement;