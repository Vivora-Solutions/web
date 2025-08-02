"use client"

import { useState, useEffect } from "react"
import { User, Trash2, Plus, X, Settings, Calendar, CheckCircle } from "lucide-react"
import "./StylistManagement.css"
import ScheduleCalendar from "../ScheduleCalendar/ScheduleCalendar"

import API from "../../../../utils/api"


// Mock API for demonstration
const mockAPI = {
  get: (url) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (url.includes("/stylists")) {
          resolve({
            data: [
              {
                stylist_id: 1,
                stylist_name: "Sarah Johnson",
                stylist_contact_number: "+1 234 567 8900",
                profile_pic_link: "",
                bio: "Expert hair stylist with 5+ years experience",
                is_active: true,
              },
              {
                stylist_id: 2,
                stylist_name: "Mike Chen",
                stylist_contact_number: "+1 234 567 8901",
                profile_pic_link: "",
                bio: "Specialist in modern cuts and coloring",
                is_active: true,
              },
              {
                stylist_id: 3,
                stylist_name: "Emma Davis",
                stylist_contact_number: "+1 234 567 8902",
                profile_pic_link: "",
                bio: "Wedding and event styling expert",
                is_active: true,
              },
            ],
          })
        } else if (url.includes("/services")) {
          resolve({
            data: [
              {
                service_id: 1,
                service_name: "Haircut & Style",
                service_category: "Hair",
                price: 45,
                duration_minutes: 60,
              },
              {
                service_id: 2,
                service_name: "Hair Coloring",
                service_category: "Hair",
                price: 85,
                duration_minutes: 120,
              },
              {
                service_id: 3,
                service_name: "Manicure",
                service_category: "Nails",
                price: 25,
                duration_minutes: 45,
              },
            ],
          })
        }
      }, 500)
    })
  },
  post: (url, data) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log("POST:", url, data)
        resolve({ data: { success: true } })
      }, 1000)
    })
  },
  put: (url, data) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log("PUT:", url, data)
        resolve({ data: { success: true } })
      }, 1000)
    })
  },
}

const StylistManagement = ({ onOpenSchedule }) => {
  const [stylists, setStylists] = useState([])
  const [services, setServices] = useState([])
  const [showAddForm, setShowAddForm] = useState(false)
  const [showServicesModal, setShowServicesModal] = useState(false)
  const [selectedStylist, setSelectedStylist] = useState(null)
  const [stylistServices, setStylistServices] = useState([])
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    stylist_name: "",
    stylist_contact_number: "",
    profile_pic_link: "",
    bio: "",
    is_active: true,
  })

  const [showScheduleCalendar, setShowScheduleCalendar] = useState(false)
  const [selectedStylistForSchedule, setSelectedStylistForSchedule] = useState(null)

  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      try {
        const [stylistsResponse, servicesResponse] = await Promise.all([
          API.get("/salon-admin/stylists"),
          API.get("/salon-admin/services"),
        ])
        setStylists(stylistsResponse.data)
        setServices(servicesResponse.data)
        console.log("Stylists loaded:", stylistsResponse.data)
        console.log("Services loaded:", servicesResponse.data)

      } catch (error) {
        console.error("Error fetching data:", error)
      } finally {
        setLoading(false)
        console.log("Data loaded successfully")
      }
    }
    loadData()
  }, [])

  const resetForm = () => {
    setFormData({
      stylist_name: "",
      stylist_contact_number: "",
      profile_pic_link: "",
      bio: "",
      is_active: true,
    })
  }

  const handleAddStylist = async () => {
    setLoading(true)
    try {
      await mockAPI.post("/salon-admin/stylist", formData)
      const newStylist = {
        stylist_id: Date.now(),
        ...formData,
      }
      setStylists((prev) => [...prev, newStylist])
      setShowAddForm(false)
      resetForm()
    } catch (error) {
      console.error("Error adding stylist:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteStylist = async (stylistId) => {
    if (window.confirm("Delete this stylist?")) {
      try {
        await API.delete(`/salon-admin/stylist/${stylistId}`, {
          is_active: false,
        })
        setStylists((prev) =>
          prev.map((s) =>
            s.stylist_id === stylistId ? { ...s, is_active: false } : s,
          ),
        )
      } catch (error) {
        console.error("Error deleting stylist:", error)
      }
    }
  }

  const handleManageServices = async (stylist) => {
    setSelectedStylist(stylist)
    // Fetch existing services for this stylist
    const response = await API.get(`/salon-admin/stylist/${stylist.stylist_id}/services`)
    setStylistServices(response.data.map((service) => service.service_id))
    setShowServicesModal(true)
  }

  const handleManageSchedule = (stylist) => {
    setSelectedStylistForSchedule(stylist)
    setShowScheduleCalendar(true)
  }

  const handleServiceToggle = (serviceId) => {
    setStylistServices((prev) =>
      prev.includes(serviceId) ? prev.filter((id) => id !== serviceId) : [...prev, serviceId],
    )
  }

  const handleActivateStylist = async (stylistId) => {
    try {
      console.log("Activating stylist:", stylistId)
      await API.put(`/salon-admin/stylist/${stylistId}`, { is_active: true })
      setStylists((prev) =>
        prev.map((s) =>
          s.stylist_id === stylistId ? { ...s, is_active: true } : s,
        ),
      )
    } catch (error) {
      console.error("Error activating stylist:", error)
    }
  }
  const handleUpdateServices = async () => {
    setLoading(true)
    try {
      await mockAPI.post("/salon-admin/stylist/services", {
        stylist_id: selectedStylist.stylist_id,
        service_ids: stylistServices,
      })
      setShowServicesModal(false)
      setSelectedStylist(null)
      alert("Services updated successfully!")
    } catch (error) {
      console.error("Error updating services:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading && stylists.length === 0) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading stylists...</p>
      </div>
    )
  }

  return (
    <div className="stylist-management-container">
      {/* Header */}
      <div className="header">
        <div className="header-info">
          <h2>Employee Management</h2>
          <p>Manage your salon staff and their schedules</p>
        </div>
        <button onClick={() => setShowAddForm(true)} className="add-slot-btn">
          <Plus size={20} />
          Add Employee
        </button>
      </div>

      {/* Stylists Grid */}
      <div className="stylists-grid">
        {stylists.length === 0 ? (
          <div className="no-stylists-message">
            <User size={48} />
            <p>No employees found</p>
            <span>Add your first employee to get started</span>
          </div>
        ) : (
          <div className="stylists-list">
            {stylists.map((stylist) => (
              <div key={stylist.stylist_id} className="stylist-card">
                <div className="stylist-info">
                  <div className="stylist-avatar">
                    {stylist.profile_pic_link ? (
                      <img src={stylist.profile_pic_link || "/placeholder.svg"} alt={stylist.stylist_name} />
                    ) : (
                      <User size={24} />
                    )}
                    <div className="status-indicator"></div>
                  </div>
                  <div className="stylist-details">
                    <h3>{stylist.stylist_name}</h3>
                    <p className="contact">{stylist.stylist_contact_number}</p>
                    {stylist.bio && <p className="bio">{stylist.bio}</p>}
                  </div>
                </div>
                {stylist.is_active ? (
                  <div className="stylist-actions">
                    <button
                      onClick={() => handleManageSchedule(stylist)}
                      className="action-btn schedule-btn"
                      title="Manage Schedule"
                    >
                      <Calendar size={18} />
                    </button>
                    <button
                      onClick={() => handleManageServices(stylist)}
                      className="action-btn services-btn"
                      title="Manage Services"
                    >
                      <Settings size={18} />
                    </button>
                    <button
                      onClick={() => handleDeleteStylist(stylist.stylist_id)}
                      className="action-btn delete-btn"
                      title="Delete"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>) : (
                  <div >
                    <button
                      onClick={() => handleActivateStylist(stylist.stylist_id)}
                      className="active-btn"
                      title="Activate Stylist"
                    >
                      <CheckCircle size={18} />
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Stylist Modal */}
      {showAddForm && (
        <>
          <div className="overlay" onClick={() => setShowAddForm(false)} />
          <div className="side-panel">
            <div className="panel-header">
              <h2>Add New Employee</h2>
              <button
                onClick={() => {
                  setShowAddForm(false)
                  resetForm()
                }}
                className="close-btn"
              >
                <X size={20} />
              </button>
            </div>
            <div className="panel-content">
              <div className="form-group">
                <label>Name</label>
                <input
                  type="text"
                  placeholder="Enter employee name"
                  value={formData.stylist_name}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      stylist_name: e.target.value,
                    }))
                  }
                  required
                />
              </div>
              <div className="form-group">
                <label>Contact Number</label>
                <input
                  type="tel"
                  placeholder="Enter contact number"
                  value={formData.stylist_contact_number}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      stylist_contact_number: e.target.value,
                    }))
                  }
                  required
                />
              </div>
              <div className="form-group">
                <label>Profile Picture URL</label>
                <input
                  type="url"
                  placeholder="Enter profile picture URL (optional)"
                  value={formData.profile_pic_link}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      profile_pic_link: e.target.value,
                    }))
                  }
                />
              </div>
              <div className="form-group">
                <label>Bio</label>
                <textarea
                  placeholder="Enter bio (optional)"
                  value={formData.bio}
                  onChange={(e) => setFormData((prev) => ({ ...prev, bio: e.target.value }))}
                  rows={3}
                />
              </div>
              <button onClick={handleAddStylist} disabled={loading} className="confirm-btn">
                {loading ? "Adding..." : "Add Employee"}
              </button>
            </div>
          </div>
        </>
      )}

      {/* Services Management Modal */}
      {showServicesModal && selectedStylist && (
        <>
          <div className="overlay" onClick={() => setShowServicesModal(false)} />
          <div className="side-panel">
            <div className="panel-header">
              <h2>Services for {selectedStylist.stylist_name}</h2>
              <button
                onClick={() => {
                  setShowServicesModal(false)
                  setSelectedStylist(null)
                }}
                className="close-btn"
              >
                <X size={20} />
              </button>
            </div>
            <div className="panel-content">
              <div className="services-list">
                {services.map((service) => (
                  <div key={service.service_id} className="service-item">
                    <div className="service-info">
                      <input
                        type="checkbox"
                        id={`service-${service.service_id}`}
                        checked={stylistServices.includes(service.service_id)}
                        onChange={() => handleServiceToggle(service.service_id)}
                      />
                      <label htmlFor={`service-${service.service_id}`}>
                        <span className="service-name">{service.service_name}</span>
                        <span className="service-duration">{service.duration_minutes} min</span>
                      </label>
                    </div>
                    <span className="service-price">${service.price}</span>
                  </div>
                ))}
              </div>
              <button onClick={handleUpdateServices} disabled={loading} className="confirm-btn">
                {loading ? "Updating..." : "Update Services"}
              </button>
            </div>
          </div>
        </>
      )}
      {/* Schedule Calendar */}
      {showScheduleCalendar && selectedStylistForSchedule && (
        <ScheduleCalendar
          stylist={selectedStylistForSchedule}
          onClose={() => {
            setShowScheduleCalendar(false)
            setSelectedStylistForSchedule(null)
          }}
        />
      )}
    </div>
  )
}

export default StylistManagement
