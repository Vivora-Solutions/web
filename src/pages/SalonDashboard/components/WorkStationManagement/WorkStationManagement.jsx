import React, { useState, useEffect } from "react";
import { Monitor, Edit, Trash2, Plus, X, Save } from "lucide-react";
import API from "../../../../utils/api";
import "./WorkStationManagement.css";
import LoadingSpinner from "../../../../components/LoadingSpinner/LoadingSpinner";

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
      const response = await API.get("/salon-admin/working-stations");
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
        await API.put("/salon-admin/working-stations", {
          workstation_id: editingId,
          workstation_name: formData.workstation_name.trim(),
        });
      } else {
        await API.post("/salon-admin/working-stations", {
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
    <div className="workstation-management">
      <div className="workstation-header">
        <div className="header-content">
          <div className="title-section">
            <Monitor className="header-icon" />
            <div>
              <h2>Work Station Management</h2>
              <p>Manage salon workstations</p>
            </div>
          </div>
          <button
            className="add-button"
            onClick={handleAddNew}
            disabled={loading}
          >
            <Plus size={20} />
            Add Workstation
          </button>
        </div>
      </div>

      {showForm && (
        <div className="form-container">
          <div className="form-header">
            <h3>{editingId ? "Edit Workstation" : "Add Workstation"}</h3>
            <button className="close-button" onClick={handleCancel}>
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="workstation-form">
            <div className="form-group">
              <label htmlFor="workstation_name">Workstation Name *</label>
              <input
                type="text"
                id="workstation_name"
                name="workstation_name"
                value={formData.workstation_name}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-actions">
              <button
                type="button"
                className="cancel-button"
                onClick={handleCancel}
              >
                Cancel
              </button>
              <button type="submit" className="save-button" disabled={loading}>
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

      <div className="workstations-grid">
        {workStations.length === 0 ? (
          <div className="empty-state">
            <Monitor size={48} />
            <h3>No Workstations Found</h3>
            <p>Start by adding your first workstation.</p>
            <button className="add-button primary" onClick={handleAddNew}>
              <Plus size={20} />
              Add Workstation
            </button>
          </div>
        ) : (
          workStations.map((station) => (
            <div key={station.workstation_id} className="workstation-card">
              <div className="card-header">
                <h4>{station.workstation_name}</h4>
                <div className="card-actions">
                  <button
                    className="action-button edit"
                    onClick={() => handleEdit(station)}
                    title="Edit"
                  >
                    <Edit size={16} />
                  </button>
                  {/* If delete is reintroduced in backend, add Trash2 here */}
                </div>
              </div>
              <div className="card-content">
                <p>ID: #{station.workstation_id}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default WorkStationManagement;
