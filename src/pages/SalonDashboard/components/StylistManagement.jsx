import { useState, useEffect } from "react"
import { Plus } from "lucide-react"
import API from "../../../utils/api"
import ScheduleCalendar from "./ScheduleCalendar/ScheduleCalendar"
import LoadingSpinner from "./LoadingSpinner"
import EmptyState from "./EmptyState"
import StylistCard from "./StylistCard"
import AddStylistModal from "./AddStylistModal"
import ServicesModal from "./ServicesModal"

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
      await API.post("/salon-admin/stylist", formData)
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

  const handleDisableStylist = async (stylistId) => {
    if (window.confirm("Disable this stylist?")) {
      try {
        await API.put(`/salon-admin/stylist/disable/${stylistId}`)
        setStylists((prev) => prev.map((s) => (s.stylist_id === stylistId ? { ...s, is_active: false } : s)))
      } catch (error) {
        console.error("Error disabling stylist:", error)
      }
    }
  }

  const handleActivateStylist = async (stylistId) => {
    if (window.confirm("Activate this stylist?")) {
      try {
        await API.put(`/salon-admin/stylist/activate/${stylistId}`)
        setStylists((prev) => prev.map((s) => (s.stylist_id === stylistId ? { ...s, is_active: true } : s)))
      } catch (error) {
        console.error("Error activating stylist:", error)
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

  

  const handleUpdateServices = async () => {
    setLoading(true)
    try {
      await API.post("/salon-admin/stylist/services", {
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

  const handleCloseServicesModal = () => {
    setShowServicesModal(false)
    setSelectedStylist(null)
  }

  const handleCloseAddForm = () => {
    setShowAddForm(false)
  }

  if (loading && stylists.length === 0) {
    return <LoadingSpinner message="Loading stylists..." />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-indigo-600 to-purple-700 p-6">
      {/* Header */}
      <div className="bg-white/95 backdrop-blur rounded-xl p-6 mb-6 flex justify-between items-center shadow-lg">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-1">Employee Managementtttttttttttt</h2>
          <p className="text-sm text-gray-500">Manage your salon staff and their schedules</p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="px-6 py-3 bg-gradient-to-r from-orange-400 to-orange-500 text-white rounded-xl font-semibold flex items-center gap-2 shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all"
        >
          <Plus size={20} />
          Add Employee
        </button>
      </div>

      {/* Stylists Grid */}
      <div className="bg-white/95 backdrop-blur rounded-xl p-6 shadow-lg">
        {stylists.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="grid gap-4">
            {stylists.map((stylist) => (
              <StylistCard
                key={stylist.stylist_id}
                stylist={stylist}
                onManageSchedule={handleManageSchedule}
                onManageServices={handleManageServices}
                onDisableStylist={handleDisableStylist}
                onActivateStylist={handleActivateStylist}
              />
            ))}
          </div>
        )}
      </div>

      {/* Modals */}
      <AddStylistModal
        showAddForm={showAddForm}
        formData={formData}
        setFormData={setFormData}
        loading={loading}
        onClose={handleCloseAddForm}
        onSubmit={handleAddStylist}
        onReset={resetForm}
      />

      <ServicesModal
        showServicesModal={showServicesModal}
        selectedStylist={selectedStylist}
        services={services}
        stylistServices={stylistServices}
        loading={loading}
        onClose={handleCloseServicesModal}
        onServiceToggle={handleServiceToggle}
        onUpdateServices={handleUpdateServices}
      />

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
