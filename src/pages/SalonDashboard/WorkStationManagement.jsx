import React, { useState, useEffect } from "react";
import {
  Monitor,
  Edit,
  Trash2,
  Plus,
  X,
  Save,
  Settings,
  CheckCircle,
  Circle,
  Users,
} from "lucide-react";
import { ProtectedAPI } from "../../utils/api";
import LoadingSpinner from "../../components/LoadingSpinner";

const WorkStationManagement = () => {
  const [workStations, setWorkStations] = useState([]);
  const [services, setServices] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ workstation_name: "" });
  const [loading, setLoading] = useState(false);

  // Service management states
  const [selectedStation, setSelectedStation] = useState(null);
  const [showServiceModal, setShowServiceModal] = useState(false);
  const [stationServices, setStationServices] = useState([]);
  const [stationServicesBeforeEdit, setStationServicesBeforeEdit] = useState(
    []
  );
  const [serviceLoading, setServiceLoading] = useState(false);

  // Store services for each workstation
  const [workStationServices, setWorkStationServices] = useState({});

  useEffect(() => {
    fetchWorkStations();
    fetchServices();
  }, []);

  useEffect(() => {
    // Fetch services for all workstations when workstations are loaded
    if (workStations.length > 0) {
      fetchAllWorkStationServices();
    }
  }, [workStations]);

  const fetchWorkStations = async () => {
    try {
      setLoading(true);
      const response = await ProtectedAPI.get("/salon-admin/working-stations");
      setWorkStations(response.data.data || []);
    } catch (error) {
      console.error("Error fetching workstations:", error);
      setWorkStations([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchServices = async () => {
    try {
      const response = await ProtectedAPI.get("/salon-admin/services");
      setServices(response.data || []);
    } catch (error) {
      console.error("Error fetching services:", error);
    }
  };

  const fetchAllWorkStationServices = async () => {
    const servicesData = {};
    for (const station of workStations) {
      try {
        const response = await ProtectedAPI.get(
          `/salon-admin/working-stations/${station.workstation_id}/services`
        );
        servicesData[station.workstation_id] = response.data.data || [];
      } catch (error) {
        console.error(
          `Error fetching services for station ${station.workstation_id}:`,
          error
        );
        servicesData[station.workstation_id] = [];
      }
    }
    setWorkStationServices(servicesData);
  };

  const fetchStationServices = async (stationId) => {
    try {
      setServiceLoading(true);
      const response = await ProtectedAPI.get(
        `/salon-admin/working-stations/${stationId}/services`
      );
      const stationServiceIds = response.data.data.map(
        (item) => item.service.service_id
      );
      setStationServices(stationServiceIds);
      setStationServicesBeforeEdit(stationServiceIds);
    } catch (error) {
      console.error("Error fetching station services:", error);
      setStationServices([]);
      setStationServicesBeforeEdit([]);
    } finally {
      setServiceLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, workstation_name: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.workstation_name.trim()) {
      alert("Workstation name is required");
      return;
    }

    try {
      setLoading(true);
      if (editingId) {
        await ProtectedAPI.put("/salon-admin/working-stations", {
          workstation_id: editingId,
          workstation_name: formData.workstation_name.trim(),
        });
      } else {
        await ProtectedAPI.post("/salon-admin/working-stations", {
          station_name: formData.workstation_name.trim(),
        });
      }
      await fetchWorkStations();
      handleCancel();
    } catch (error) {
      console.error("Error saving workstation:", error);
      alert("Failed to save workstation");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (station) => {
    setEditingId(station.workstation_id);
    setFormData({ workstation_name: station.workstation_name });
    setShowForm(true);
  };

  const handleCancel = () => {
    setEditingId(null);
    setFormData({ workstation_name: "" });
    setShowForm(false);
  };

  const handleAddNew = () => {
    setEditingId(null);
    setFormData({ workstation_name: "" });
    setShowForm(true);
  };

  // Service management functions
  const handleManageServices = async (station) => {
    setSelectedStation(station);
    setShowServiceModal(true);
    await fetchStationServices(station.workstation_id);
  };

  const handleServiceToggle = (serviceId) => {
    setStationServices((prev) =>
      prev.includes(serviceId)
        ? prev.filter((id) => id !== serviceId)
        : [...prev, serviceId]
    );
  };

  const handleUpdateServices = async () => {
    setServiceLoading(true);
    try {
      // Send all selected services to the backend
      await ProtectedAPI.post("/salon-admin/working-stations/services", {
        station_id: selectedStation.workstation_id,
        service_ids: stationServices,
      });

      alert("Services updated successfully!");
      setStationServicesBeforeEdit(stationServices);

      // Update the local state to reflect changes immediately
      await fetchAllWorkStationServices();

      // Close modal
      handleCloseServiceModal();
    } catch (error) {
      console.error("Error updating services:", error);
      alert("Failed to update services");
      // Revert changes on error
      setStationServices(stationServicesBeforeEdit);
    } finally {
      setServiceLoading(false);
    }
  };

  const handleCloseServiceModal = () => {
    setShowServiceModal(false);
    setSelectedStation(null);
    setStationServices([]);
    setStationServicesBeforeEdit([]);
  };

  if (loading) {
    return <LoadingSpinner message="Loading workstations..." />;
  }

  return (
    <div className="w-full px-4">
      <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-4">
          <Monitor
            className="text-blue-500 bg-blue-100 p-3 rounded-xl"
            size={40}
          />
          <div>
            <h2 className="text-xl font-semibold text-slate-800">
              Work Station Management
            </h2>
            <p className="text-sm text-slate-500">
              Manage salon workstations and their services
            </p>
          </div>
        </div>
        <button
          onClick={handleAddNew}
          disabled={loading}
          className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-green-600 text-white px-5 py-2.5 rounded-xl font-medium hover:shadow-lg hover:-translate-y-0.5 transition disabled:opacity-50"
        >
          <Plus size={20} />
          Add Workstation
        </button>
      </div>

      {showForm && (
        <div className="bg-slate-50 border-2 border-dashed border-slate-300 rounded-xl p-6 mb-8 relative">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-slate-800">
              {editingId ? "Edit Workstation" : "Add Workstation"}
            </h3>
            <button
              className="bg-red-500 text-white w-8 h-8 rounded-md flex items-center justify-center hover:bg-red-600"
              onClick={handleCancel}
            >
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex flex-col gap-2">
              <label
                htmlFor="workstation_name"
                className="text-sm font-medium text-slate-700"
              >
                Workstation Name *
              </label>
              <input
                type="text"
                id="workstation_name"
                name="workstation_name"
                value={formData.workstation_name}
                onChange={handleInputChange}
                required
                className="px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
              <button
                type="button"
                onClick={handleCancel}
                className="px-4 py-2 border border-slate-300 rounded-md text-slate-700 font-medium hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-md font-medium hover:shadow-lg hover:-translate-y-0.5 transition disabled:opacity-50"
              >
                <Save size={16} />
                {loading
                  ? "Saving..."
                  : editingId
                  ? "Update Workstation"
                  : "Add Workstation"}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {workStations.length === 0 ? (
          <div className="col-span-full text-center py-16 text-slate-500">
            <Monitor size={48} className="mx-auto mb-4 text-slate-300" />
            <h3 className="text-xl font-semibold text-slate-700 mb-2">
              No Workstations Found
            </h3>
            <p className="mb-6">Start by adding your first workstation.</p>
            <button
              onClick={handleAddNew}
              className="flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white px-5 py-2.5 rounded-xl font-medium hover:shadow-lg hover:-translate-y-0.5 transition"
            >
              <Plus size={20} />
              Add Workstation
            </button>
          </div>
        ) : (
          workStations.map((station) => {
            const stationServicesList =
              workStationServices[station.workstation_id] || [];

            return (
              <div
                key={station.workstation_id}
                className="relative bg-white border border-slate-200 rounded-xl p-6 hover:shadow-lg transition"
              >
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-gray-500 to-gray-700 rounded-t-xl"></div>

                {/* Header */}
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h4 className="text-lg font-semibold text-slate-800">
                      {station.workstation_name}
                    </h4>
                    <div className="flex items-center gap-1 text-sm text-slate-500 mt-1">
                      <Users size={14} />
                      <span>
                        {stationServicesList.length} service
                        {stationServicesList.length !== 1 ? "s" : ""}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(station)}
                      className="w-8 h-8 bg-blue-100 text-blue-500 rounded-md flex items-center justify-center hover:bg-blue-200"
                      title="Edit"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => handleManageServices(station)}
                      className="w-8 h-8 bg-purple-100 text-purple-500 rounded-md flex items-center justify-center hover:bg-purple-200"
                      title="Manage Services"
                    >
                      <Settings size={16} />
                    </button>
                  </div>
                </div>

                {/* Services List */}
                <div className="space-y-2">
                  <h5 className="text-sm font-medium text-slate-700">
                    Available Services:
                  </h5>
                  {stationServicesList.length > 0 ? (
                    <div className="space-y-2 max-h-32 overflow-y-auto">
                      {stationServicesList.map((serviceData) => (
                        <div
                          key={serviceData.service.service_id}
                          className="bg-slate-50 rounded-lg p-3 text-sm"
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <h6 className="font-medium text-slate-800">
                                {serviceData.service.service_name}
                              </h6>
                              <p className="text-slate-500 text-xs mt-1">
                                ${serviceData.service.price} •{" "}
                                {serviceData.service.duration_minutes} min
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-6 text-slate-400">
                      <Settings size={24} className="mx-auto mb-2 opacity-50" />
                      <p className="text-sm">No services assigned</p>
                      <button
                        onClick={() => handleManageServices(station)}
                        className="text-purple-500 hover:text-purple-600 text-xs mt-1"
                      >
                        Add services
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Service Management Modal */}
      {showServiceModal && selectedStation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-slate-800">
                Manage Services for {selectedStation.workstation_name}
              </h3>
              <button
                onClick={handleCloseServiceModal}
                className="text-slate-500 hover:text-slate-700"
              >
                <X size={24} />
              </button>
            </div>

            {serviceLoading ? (
              <div className="flex justify-center py-8">
                <LoadingSpinner message="Loading services..." />
              </div>
            ) : (
              <>
                <div className="space-y-3 mb-6 max-h-96 overflow-y-auto">
                  {services.map((service) => (
                    <div
                      key={service.service_id}
                      className="flex items-center justify-between p-3 border border-slate-200 rounded-lg hover:bg-slate-50"
                    >
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() =>
                            handleServiceToggle(service.service_id)
                          }
                          className="text-emerald-500"
                        >
                          {stationServices.includes(service.service_id) ? (
                            <CheckCircle size={20} />
                          ) : (
                            <Circle size={20} />
                          )}
                        </button>
                        <div>
                          <h4 className="font-medium text-slate-800">
                            {service.service_name}
                          </h4>
                          <p className="text-sm text-slate-500">
                            ${service.price} • {service.duration_minutes} min
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
                  <button
                    onClick={handleCloseServiceModal}
                    className="px-4 py-2 border border-slate-300 rounded-md text-slate-700 font-medium hover:bg-slate-100"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleUpdateServices}
                    disabled={serviceLoading}
                    className="flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-md font-medium hover:shadow-lg hover:-translate-y-0.5 transition disabled:opacity-50"
                  >
                    <Save size={16} />
                    {serviceLoading ? "Updating..." : "Update Services"}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkStationManagement;
