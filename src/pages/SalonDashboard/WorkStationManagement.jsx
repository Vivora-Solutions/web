import React, { useState, useEffect } from "react";
import {
  Monitor,
  Edit,
  Trash2,
  Plus,
  X,
  Settings,
  CheckCircle,
  Circle,
  Users,
} from "lucide-react";
import { ProtectedAPI } from "../../utils/api";
import LoadingSpinner from "../../components/LoadingSpinner";
import AddWorkstationModal from "./components/AddWorkstationModal";
import WorkstationCard from "./components/WorkstationCard";

const WorkStationManagement = () => {
  const [workStations, setWorkStations] = useState([]);
  const [services, setServices] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ workstation_name: "" });
  const [loading, setLoading] = useState(false);

  // Service selection for new workstation
  const [selectedServices, setSelectedServices] = useState([]);

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

  const handleSubmit = async () => {
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
        // Create workstation
        const workstationResponse = await ProtectedAPI.post(
          "/salon-admin/working-stations",
          {
            station_name: formData.workstation_name.trim(),
          }
        );

        // If services are selected, add them to the workstation
        if (selectedServices.length > 0) {
          const newWorkstation = workstationResponse.data.data[0];
          await ProtectedAPI.post("/salon-admin/working-stations/services", {
            station_id: newWorkstation.workstation_id,
            service_ids: selectedServices,
          });
        }
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
    setSelectedServices([]);
    setShowForm(false);
  };

  const handleAddNew = () => {
    setEditingId(null);
    setFormData({ workstation_name: "" });
    setSelectedServices([]);
    setShowForm(true);
  };

  const resetForm = () => {
    setFormData({ workstation_name: "" });
    setSelectedServices([]);
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

  if (loading && workStations.length === 0) {
    return (
      <div className="animate-spin h-12 w-12 border-b-2 border-indigo-600 rounded-full mx-auto mt-8 mb-4"></div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-1">
      <div className="bg-white/95 backdrop-blur rounded-xl p-1 mb-6 flex justify-between items-center shadow-lg">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-1">
            Workstation Management
          </h2>
        </div>
        <button
          onClick={handleAddNew}
          className="px-6 py-3 bg-gray-800 text-white rounded-xl font-semibold flex items-center gap-2 shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all"
        >
          <Plus size={20} />
          Add Workstation
        </button>
      </div>

      <div className="bg-white/95 backdrop-blur rounded-xl p-1 shadow-lg">
        {workStations.length === 0 ? (
          <div className="text-center py-16 text-slate-500">
            <Monitor size={48} className="mx-auto mb-4 text-slate-300" />
            <h3 className="text-xl font-semibold text-slate-700 mb-2">
              No Workstations Found
            </h3>
            <p className="mb-6">Start by adding your first workstation.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 p-6">
            {workStations.map((station) => {
              const stationServicesList =
                workStationServices[station.workstation_id] || [];

              return (
                <div
                  key={station.workstation_id}
                  className="relative bg-white border border-slate-200 rounded-xl p-6 hover:shadow-lg transition"
                >
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-gray-800 to-gray-700 rounded-t-xl"></div>

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
                        className="w-8 h-8 bg-gray-100 text-gray-600 rounded-md flex items-center justify-center hover:bg-purple-200"
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
                                  Rs. {serviceData.service.price} •{" "}
                                  {serviceData.service.duration_minutes} min
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-6 text-slate-400">
                        <Settings
                          size={24}
                          className="mx-auto mb-2 opacity-50"
                        />
                        <p className="text-sm">No services assigned</p>
                        <button
                          onClick={() => handleManageServices(station)}
                          className="text-gray-600 hover:text-purple-600 text-xs mt-1"
                        >
                          Add services
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <AddWorkstationModal
        showAddForm={showForm}
        formData={formData}
        setFormData={setFormData}
        services={services}
        selectedServices={selectedServices}
        setSelectedServices={setSelectedServices}
        loading={loading}
        onClose={handleCancel}
        onSubmit={handleSubmit}
        onReset={resetForm}
      />

      {/* Service Management Modal - Slide Panel */}
      {showServiceModal && selectedStation && (
        <>
          {/* Background overlay */}
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            onClick={handleCloseServiceModal}
          />

          {/* Slide Panel */}
          <div className="fixed inset-y-0 right-0 w-full sm:w-[400px] bg-white shadow-2xl z-50 flex flex-col h-screen animate-slide-in">
            {/* Header (sticky) */}
            <div className="p-4 sm:p-6 border-b border-gray-200 bg-gradient-to-r from-indigo-500 to-purple-600 text-white flex justify-between items-center sticky top-0">
              <h2 className="text-base sm:text-lg md:text-xl font-bold">
                Manage Services
              </h2>
              <button
                onClick={handleCloseServiceModal}
                className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-all"
              >
                <X size={20} />
              </button>
            </div>

            {/* Form (scrollable area) */}
            <div className="p-4 sm:p-6 flex-1 overflow-y-auto space-y-5">
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-gray-800">
                  {selectedStation.workstation_name}
                </h3>
                <p className="text-sm text-gray-600">
                  Select services available at this workstation
                </p>
              </div>

              {serviceLoading ? (
                <div className="flex justify-center py-8">
                  <LoadingSpinner message="Loading services..." />
                </div>
              ) : (
                <div>
                  <label className="block font-semibold text-gray-700 mb-3 text-sm">
                    Available Services
                  </label>
                  <div className="border-2 border-gray-200 rounded-lg divide-y divide-gray-100 max-h-80 overflow-y-auto">
                    {services.map((service) => (
                      <div
                        key={service.service_id}
                        className="flex items-center justify-between p-3 hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-center gap-3 flex-1">
                          <button
                            type="button"
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
                          <div className="flex flex-col gap-0.5">
                            <span className="font-medium text-gray-800 text-sm">
                              {service.service_name}
                            </span>
                            <span className="text-xs text-gray-500">
                              {service.duration_minutes} min
                            </span>
                          </div>
                        </div>
                        <span className="font-semibold text-green-600 text-sm">
                          Rs. {service.price}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Footer Button (sticky) */}
            <div className="p-4 sm:p-6 border-t border-gray-100 sticky bottom-0 bg-white">
              <button
                onClick={handleUpdateServices}
                disabled={serviceLoading}
                className="w-full py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-xl font-semibold shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all disabled:opacity-60 disabled:cursor-not-allowed text-sm sm:text-base"
              >
                {serviceLoading ? "Updating..." : "Update Services"}
              </button>
            </div>
          </div>
        </>
      )}

      <AddWorkstationModal
        showAddForm={showForm}
        formData={formData}
        setFormData={setFormData}
        services={services}
        selectedServices={selectedServices}
        setSelectedServices={setSelectedServices}
        loading={loading}
        onClose={handleCancel}
        onSubmit={handleSubmit}
        onReset={resetForm}
      />
    </div>
  );
};

export default WorkStationManagement;
