import { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import { ProtectedAPI } from "../../utils/api";
import LoadingSpinner from "./components/LoadingSpinner";
import EmptyState from "./components/EmptyState";
import StylistCard from "./components/StylistCard";
import AddStylistModal from "./components/AddStylistModal";
import ServicesModal from "./components/ServicesModal";
import ProfileModal from "./components/ProfileModal";
import ScheduleModal from "./components/ScheduleModal";

const StylistManagement = ({ onOpenSchedule }) => {
  const [stylists, setStylists] = useState([]);
  const [services, setServices] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showServicesModal, setShowServicesModal] = useState(false);
  const [selectedStylist, setSelectedStylist] = useState(null);
  const [stylistServices, setStylistServices] = useState([]);
  const [stylistServicesBeforeEdit, setStylistServicesBeforeEdit] = useState(
    []
  );
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    stylist_name: "",
    stylist_contact_number: "",
    profile_pic_link: "",
    bio: "",
    is_active: true,
  });

  const [showProfileModal, setShowProfileModal] = useState(false);
  const [profileFormData, setProfileFormData] = useState({
    stylist_name: "",
    stylist_contact_number: "",
    profile_pic_link: "",
    bio: "",
    is_active: true,
  });

  const [scheduleStylistData, setScheduleStylistData] = useState(null);
  const [showScheduleModal, setShowScheduleModal] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const [stylistsResponse, servicesResponse] = await Promise.all([
          ProtectedAPI.get("/salon-admin/stylists"),
          ProtectedAPI.get("/salon-admin/services"),
        ]);
        setStylists(stylistsResponse.data);
        setServices(servicesResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const resetForm = () => {
    setFormData({
      stylist_name: "",
      stylist_contact_number: "",
      profile_pic_link: "",
      bio: "",
      is_active: true,
    });
  };

  const handleAddStylist = async () => {
    setLoading(true);
    try {
      const response = await ProtectedAPI.post(
        "/salon-admin/stylist",
        formData
      );
      const newStylist = response.data.data[0];
      setStylists((prev) => [...prev, newStylist]);
      setShowAddForm(false);
      resetForm();
    } catch (error) {
      console.error("Error adding stylist:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDisableStylist = async (stylistId) => {
    if (window.confirm("Disable this stylist?")) {
      try {
        await ProtectedAPI.put(`/salon-admin/stylist/disable/${stylistId}`);
        setStylists((prev) =>
          prev.map((s) =>
            s.stylist_id === stylistId ? { ...s, is_active: false } : s
          )
        );
      } catch (error) {
        console.error("Error disabling stylist:", error);
      }
    }
  };

  const handleActivateStylist = async (stylistId) => {
    if (window.confirm("Activate this stylist?")) {
      try {
        await ProtectedAPI.put(`/salon-admin/stylist/activate/${stylistId}`);
        setStylists((prev) =>
          prev.map((s) =>
            s.stylist_id === stylistId ? { ...s, is_active: true } : s
          )
        );
      } catch (error) {
        console.error("Error activating stylist:", error);
      }
    }
  };

  const handleManageServices = async (stylist) => {
    setSelectedStylist(stylist);
    const response = await ProtectedAPI.get(
      `/salon-admin/stylist/${stylist.stylist_id}/services`
    );
    const ids = response.data.map((service) => service.service_id);
    setStylistServices(ids);
    setStylistServicesBeforeEdit(ids); // Save for diffing
    setShowServicesModal(true);
  };

  const handleManageProfile = async (stylist) => {
    setLoading(true);
    try {
      const response = await ProtectedAPI.get(
        `/salon-admin/stylist/${stylist.stylist_id}`
      );
      setSelectedStylist(stylist);
      setProfileFormData(response.data[0]);
      setShowProfileModal(true);
    } catch (e) {
      console.error("Error fetching stylist details:", e);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStylistProfile = async () => {
    setLoading(true);
    try {
      await ProtectedAPI.put(
        `/salon-admin/stylist/${selectedStylist.stylist_id}`,
        profileFormData
      );
      setStylists((prev) =>
        prev.map((s) =>
          s.stylist_id === selectedStylist.stylist_id
            ? { ...s, ...profileFormData }
            : s
        )
      );
      alert("Profile updated successfully!");
      setShowProfileModal(false);
      setSelectedStylist(null);
    } catch (error) {
      console.error("Error updating stylist:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleManageScheduleModal = async (stylist) => {
    try {
      const response = await ProtectedAPI.get(
        `/salon-admin/schedule/stylists/${stylist.stylist_id}`
      );
      setScheduleStylistData({
        ...stylist,
        schedule: response.data.data.schedule,
      });
      setShowScheduleModal(true);
    } catch (error) {
      console.error("Error fetching schedule:", error);
    }
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
      const addedServices = stylistServices.filter(
        (id) => !stylistServicesBeforeEdit.includes(id)
      );
      const removedServices = stylistServicesBeforeEdit.filter(
        (id) => !stylistServices.includes(id)
      );

      if (addedServices.length > 0) {
        await ProtectedAPI.post("/salon-admin/stylist/services", {
          stylist_id: selectedStylist.stylist_id,
          service_ids: addedServices,
        });
      }

      if (removedServices.length > 0) {
        console.log("Removing services:", removedServices);
        await ProtectedAPI.put(
          `/salon-admin/stylist/${selectedStylist.stylist_id}/disable-services`,
          {
            service_ids: removedServices,
          }
        );
      }

      alert("Services updated successfully!");
      setShowServicesModal(false);
      setSelectedStylist(null);
    } catch (error) {
      console.error("Error updating services:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCloseServicesModal = () => {
    setShowServicesModal(false);
    setSelectedStylist(null);
  };

  const handleCloseAddForm = () => {
    setShowAddForm(false);
  };

  if (loading && stylists.length === 0) {
    return <LoadingSpinner message="Loading stylists..." />;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-1">
      <div className="bg-white/95 backdrop-blur rounded-xl p-1 mb-6 flex justify-between items-center shadow-lg">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-1">
            Employee Management
          </h2>
          <p className="text-sm text-gray-500">
            Manage your salon staff and their schedules
          </p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="px-6 py-3 bg-gradient-to-r from-orange-400 to-orange-500 text-white rounded-xl font-semibold flex items-center gap-2 shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all"
        >
          <Plus size={20} />
          Add Employee
        </button>
      </div>

      <div className="bg-white/95 backdrop-blur rounded-xl p-1 shadow-lg">
        {stylists.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="grid gap-4">
            {stylists.map((stylist) => (
              <StylistCard
                key={stylist.stylist_id}
                stylist={stylist}
                onManageWorkingSchedule={handleManageScheduleModal}
                onManageProfile={handleManageProfile}
                onManageServices={handleManageServices}
                onDisableStylist={handleDisableStylist}
                onActivateStylist={handleActivateStylist}
              />
            ))}
          </div>
        )}
      </div>

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

      <ProfileModal
        show={showProfileModal}
        profileFormData={profileFormData}
        setProfileFormData={setProfileFormData}
        loading={loading}
        onClose={() => {
          setShowProfileModal(false);
          setSelectedStylist(null);
        }}
        onSubmit={handleUpdateStylistProfile}
      />

      {showScheduleModal && scheduleStylistData && (
        <ScheduleModal
          stylist={scheduleStylistData}
          onClose={() => {
            setShowScheduleModal(false);
            setScheduleStylistData(null);
          }}
        />
      )}
    </div>
  );
};

export default StylistManagement;
