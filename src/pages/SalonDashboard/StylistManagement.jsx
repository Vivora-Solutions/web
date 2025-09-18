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
  
  // Helper function to show professional notifications
  const showNotification = (message, isSuccess = true) => {
    const notification = document.createElement("div");
    notification.className = `fixed top-4 right-4 ${isSuccess ? 'bg-gradient-to-r from-black to-[#8B4513]' : 'bg-red-600'} text-white py-3 px-4 rounded-lg shadow-lg z-50 flex items-center animate-fadeIn`;
    notification.innerHTML = `
      <svg class="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        ${isSuccess 
          ? '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>' 
          : '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>'}
      </svg>
      <span>${message}</span>
    `;
    document.body.appendChild(notification);
    setTimeout(() => {
      notification.classList.add("opacity-0", "transition-opacity", "duration-500");
      setTimeout(() => document.body.removeChild(notification), 500);
    }, 3000);
  };
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
  
  // State for confirmation modals
  const [showConfirmDisableModal, setShowConfirmDisableModal] = useState(false);
  const [showConfirmActivateModal, setShowConfirmActivateModal] = useState(false);
  const [stylistToModify, setStylistToModify] = useState(null);

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
      // Professional success notification
      showNotification("Employee added successfully!");
    } catch (error) {
      console.error("Error adding stylist:", error);
      // Professional error notification
      showNotification(`Failed to add employee: ${error.response?.data?.error || error.message}`, false);
    } finally {
      setLoading(false);
    }
  };

  const handleDisableStylist = (stylistId) => {
    // Show the confirmation modal instead of immediately disabling
    setStylistToModify(stylistId);
    setShowConfirmDisableModal(true);
  };

  const confirmDisableStylist = async () => {
    if (!stylistToModify) return;
    
    // Close modal first
    setShowConfirmDisableModal(false);
    
    try {
      await ProtectedAPI.put(`/salon-admin/stylist/disable/${stylistToModify}`);
      setStylists((prev) =>
        prev.map((s) =>
          s.stylist_id === stylistToModify ? { ...s, is_active: false } : s
        )
      );
      // Professional success notification
      showNotification("Stylist disabled successfully!");
    } catch (error) {
      console.error("Error disabling stylist:", error);
      // Professional error notification
      showNotification(`Failed to disable stylist: ${error.response?.data?.error || error.message}`, false);
    } finally {
      setStylistToModify(null);
    }
  };

  const handleActivateStylist = (stylistId) => {
    // Show the confirmation modal instead of immediately activating
    setStylistToModify(stylistId);
    setShowConfirmActivateModal(true);
  };

  const confirmActivateStylist = async () => {
    if (!stylistToModify) return;
    
    // Close modal first
    setShowConfirmActivateModal(false);
    
    try {
      await ProtectedAPI.put(`/salon-admin/stylist/activate/${stylistToModify}`);
      setStylists((prev) =>
        prev.map((s) =>
          s.stylist_id === stylistToModify ? { ...s, is_active: true } : s
        )
      );
      // Professional success notification
      showNotification("Stylist activated successfully!");
    } catch (error) {
      console.error("Error activating stylist:", error);
      // Professional error notification
      showNotification(`Failed to activate stylist: ${error.response?.data?.error || error.message}`, false);
    } finally {
      setStylistToModify(null);
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
      // Professional success notification
      showNotification("Profile updated successfully!");
      setShowProfileModal(false);
      setSelectedStylist(null);
    } catch (error) {
      console.error("Error updating stylist:", error);
      // Professional error notification
      showNotification(`Failed to update profile: ${error.response?.data?.error || error.message}`, false);
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
        //console.log("Removing services:", removedServices);
        await ProtectedAPI.put(
          `/salon-admin/stylist/${selectedStylist.stylist_id}/disable-services`,
          {
            service_ids: removedServices,
          }
        );
      }

      // Professional success notification
      showNotification("Services updated successfully!");
      setShowServicesModal(false);
      setSelectedStylist(null);
    } catch (error) {
      console.error("Error updating services:", error);
      // Professional error notification
      showNotification(`Failed to update services: ${error.response?.data?.error || error.message}`, false);
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
    return (
      <div className="p-6 bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 rounded-xl shadow-lg border border-gray-200">
        {/* Loading Header */}
        <div className="mb-8 text-center">
          <div className="relative inline-block">
            {/* Animated Team Icon */}
            <div className="w-16 h-16 mx-auto mb-4 relative">
              <div className="absolute inset-0 bg-gradient-to-r from-pink-400 to-purple-500 rounded-xl animate-pulse"></div>
              <div className="absolute inset-1 bg-white rounded-xl flex items-center justify-center">
                <svg className="w-8 h-8 text-purple-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M16 4c0-1.11.89-2 2-2s2 .89 2 2-.89 2-2 2-2-.89-2-2zm4 18v-6h2.5l-2.54-7.63A1.002 1.002 0 0 0 19 8h-2c-.55 0-1 .45-1 1v1c0 1.1-.9 2-2 2s-2-.9-2-2V9c0-.55-.45-1-1-1H9c-.46 0-.88.31-.98.76L5.48 16H8v6h8zM12.5 11.5c.83 0 1.5-.67 1.5-1.5s-.67-1.5-1.5-1.5S11 9.17 11 10s.67 1.5 1.5 1.5zM5.5 6C6.33 6 7 5.33 7 4.5S6.33 3 5.5 3 4 3.67 4 4.5 4.67 6 5.5 6zm2.5 2c-.83 0-1.5.67-1.5 1.5S7.17 11 8 11s1.5-.67 1.5-1.5S8.83 8 8 8z"/>
                </svg>
              </div>
              
              {/* Rotating border */}
              <div className="absolute inset-0 border-4 border-transparent border-t-pink-500 rounded-xl animate-spin"></div>
            </div>
            
            {/* Floating stylist indicators */}
            <div className="absolute -top-2 -left-2 w-3 h-3 bg-pink-400 rounded-full animate-bounce" style={{animationDelay: '0s'}}></div>
            <div className="absolute -top-2 -right-2 w-3 h-3 bg-purple-400 rounded-full animate-bounce" style={{animationDelay: '0.5s'}}></div>
            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-indigo-400 rounded-full animate-bounce" style={{animationDelay: '1s'}}></div>
          </div>
          
          <h2 className="text-xl font-semibold text-gray-800 mb-2 animate-fade-in">
            Loading Your Team
          </h2>
          <p className="text-gray-600 animate-fade-in-delay">
            Fetching your salon's employees...
          </p>
        </div>

        {/* Stylists Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {[...Array(4)].map((_, index) => (
            <div 
              key={index} 
              className="bg-white/60 rounded-lg p-4 flex items-start gap-4 animate-pulse"
              style={{animationDelay: `${index * 0.1}s`}}
            >
              {/* Avatar skeleton */}
              <div className="w-16 h-16 bg-gray-200 rounded-full"></div>
              
              <div className="flex-1">
                {/* Name and role */}
                <div className="h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-100 rounded w-1/2 mb-3"></div>
                
                {/* Contact info */}
                <div className="h-4 bg-gray-100 rounded w-5/6 mb-3"></div>
                
                {/* Badges */}
                <div className="flex gap-2">
                  <div className="h-6 w-16 bg-gray-200 rounded-full"></div>
                  <div className="h-6 w-20 bg-gray-200 rounded-full"></div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex flex-col gap-2">
                <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
              </div>
            </div>
          ))}
        </div>

        {/* Add button skeleton */}
        <div className="flex justify-center mt-6">
          <div className="w-40 h-10 bg-gray-200 rounded-lg animate-pulse"></div>
        </div>

        {/* Progress Indicators */}
        <div className="flex justify-center space-x-2 mt-8">
          <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce" style={{animationDelay: '0s'}}></div>
          <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
          <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{animationDelay: '0.4s'}}></div>
          <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce" style={{animationDelay: '0.6s'}}></div>
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
          
          .animate-fade-in {
            animation: fade-in 1s ease-out;
          }
          
          .animate-fade-in-delay {
            animation: fade-in-delay 2s ease-out;
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-1">
      <div className="bg-white/95 backdrop-blur rounded-xl p-1 mb-6 flex justify-between items-center shadow-lg">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-1">
            Employee Management
          </h2>
         
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="px-6 py-3 bg-gray-800 text-white rounded-xl font-semibold flex items-center gap-2 shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all"
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
      
      {/* Disable Stylist Confirmation Modal */}
      {showConfirmDisableModal && (
        <>
          {/* Overlay */}
          <div className="fixed inset-0 bg-black bg-opacity-50 z-40 animate-fadeIn" onClick={() => setShowConfirmDisableModal(false)}></div>
          
          {/* Modal */}
          <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-black bg-opacity-40 backdrop-blur-md rounded-lg shadow-xl p-6 z-50 w-full max-w-sm animate-fadeIn">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-red-100 mx-auto mb-4 flex items-center justify-center">
                <svg className="h-8 w-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Disable Employee</h3>
              <p className="text-gray-200 mb-6">Are you sure you want to disable this employee? They won't be able to receive new appointments.</p>
              <div className="flex justify-center space-x-3">
                <button 
                  className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg transition"
                  onClick={() => setShowConfirmDisableModal(false)}
                >
                  Cancel
                </button>
                <button 
                  className="px-4 py-2 bg-gradient-to-r from-black to-[#8B4513] hover:from-[#8B4513] hover:to-black text-white rounded-lg transition"
                  onClick={confirmDisableStylist}
                >
                  Disable
                </button>
              </div>
            </div>
          </div>
        </>
      )}
      
      {/* Activate Stylist Confirmation Modal */}
      {showConfirmActivateModal && (
        <>
          {/* Overlay */}
          <div className="fixed inset-0 bg-black bg-opacity-50 z-40 animate-fadeIn" onClick={() => setShowConfirmActivateModal(false)}></div>
          
          {/* Modal */}
          <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-black bg-opacity-40 backdrop-blur-md rounded-lg shadow-xl p-6 z-50 w-full max-w-sm animate-fadeIn">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-green-100 mx-auto mb-4 flex items-center justify-center">
                <svg className="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Activate Employee</h3>
              <p className="text-gray-200 mb-6">Are you sure you want to activate this employee? They'll be able to receive new appointments.</p>
              <div className="flex justify-center space-x-3">
                <button 
                  className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg transition"
                  onClick={() => setShowConfirmActivateModal(false)}
                >
                  Cancel
                </button>
                <button 
                  className="px-4 py-2 bg-gradient-to-r from-black to-[#8B4513] hover:from-[#8B4513] hover:to-black text-white rounded-lg transition"
                  onClick={confirmActivateStylist}
                >
                  Activate
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default StylistManagement;
