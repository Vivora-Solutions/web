import React, { useState, useEffect } from "react";
import { Monitor, Edit, Trash2, Plus, X, Save } from "lucide-react";
import { ProtectedAPI } from "../../utils/api";
import LoadingSpinner from "../../components/LoadingSpinner";

const WorkStationManagement = () => {
  const [workStations, setWorkStations] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ workstation_name: "" });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchWorkStations();
  }, []);

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
          workstation_name: formData.workstation_name.trim(),
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

  if (loading) {
    return <LoadingSpinner message="Loading workstations..." />;
  }

  return (
    <div className="w-full px-4">
      <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-4">
          <Monitor className="text-blue-500 bg-blue-100 p-3 rounded-xl" size={40} />
          <div>
            <h2 className="text-xl font-semibold text-slate-800">Work Station Management</h2>
            <p className="text-sm text-slate-500">Manage salon workstations</p>
          </div>
        </div>
        <button
          onClick={handleAddNew}
          disabled={loading}
          className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-5 py-2.5 rounded-xl font-medium hover:shadow-lg hover:-translate-y-0.5 transition disabled:opacity-50"
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
              <label htmlFor="workstation_name" className="text-sm font-medium text-slate-700">
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

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {workStations.length === 0 ? (
          <div className="col-span-full text-center py-16 text-slate-500">
            <Monitor size={48} className="mx-auto mb-4 text-slate-300" />
            <h3 className="text-xl font-semibold text-slate-700 mb-2">No Workstations Found</h3>
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
          workStations.map((station) => (
            <div
              key={station.workstation_id}
              className="relative bg-white border border-slate-200 rounded-xl p-6 hover:shadow-lg transition"
            >
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-t-xl"></div>
              <div className="flex justify-between items-start mb-4">
                <h4 className="text-lg font-semibold text-slate-800">
                  {station.workstation_name}
                </h4>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(station)}
                    className="w-8 h-8 bg-blue-100 text-blue-500 rounded-md flex items-center justify-center hover:bg-blue-200"
                    title="Edit"
                  >
                    <Edit size={16} />
                  </button>
                </div>
              </div>
              <p className="text-sm text-slate-500">ID: #{station.workstation_id}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default WorkStationManagement;
