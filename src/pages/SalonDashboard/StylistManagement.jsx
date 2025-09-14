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
        //console.log("Removing services:", removedServices);
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
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center p-4">
        <div className="w-full max-w-6xl mx-auto bg-white/80 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-white/20">
          
          {/* Loading Header */}
          <div className="mb-8 text-center">
            <div className="relative inline-block">
              {/* Animated Stylist Management Icon */}
              <div className="w-20 h-20 mx-auto mb-4 relative">
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-500 rounded-full animate-pulse"></div>
                <div className="absolute inset-1 bg-white rounded-full flex items-center justify-center">
                  {/* Team/People Icon */}
                  <svg className="w-10 h-10 text-purple-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M16 4c0-1.11.89-2 2-2s2 .89 2 2-.89 2-2 2-2-.89-2-2zm4 18v-6h2.5l-2.54-7.63A1.002 1.002 0 0 0 19 8h-2c-.55 0-1 .45-1 1v1c0 1.1-.9 2-2 2s-2-.9-2-2V9c0-.55-.45-1-1-1H9c-.46 0-.88.31-.98.76L5.48 16H8v6h8zM12.5 11.5c.83 0 1.5-.67 1.5-1.5s-.67-1.5-1.5-1.5S11 9.17 11 10s.67 1.5 1.5 1.5zM5.5 6C6.33 6 7 5.33 7 4.5S6.33 3 5.5 3 4 3.67 4 4.5 4.67 6 5.5 6zm2.5 2c-.83 0-1.5.67-1.5 1.5S7.17 11 8 11s1.5-.67 1.5-1.5S8.83 8 8 8z"/>
                  </svg>
                </div>
                
                {/* Rotating border */}
                <div className="absolute inset-0 border-4 border-transparent border-t-indigo-500 rounded-full animate-spin"></div>
              </div>
              
              {/* Floating stylist-related icons */}
              <div className="absolute -top-4 -left-4 w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center animate-bounce" style={{animationDelay: '0s'}}>
                👨‍💼
              </div>
              <div className="absolute -top-4 -right-4 w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center animate-bounce" style={{animationDelay: '0.5s'}}>
                👩‍💼
              </div>
              <div className="absolute -bottom-4 -left-4 w-8 h-8 bg-pink-100 rounded-full flex items-center justify-center animate-bounce" style={{animationDelay: '1s'}}>
                ✂️
              </div>
              <div className="absolute -bottom-4 -right-4 w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center animate-bounce" style={{animationDelay: '1.5s'}}>
                📅
              </div>
            </div>
            
            <h2 className="text-2xl font-bold text-gray-800 mb-2 animate-fade-in">
              Loading Salon Team
            </h2>
            <p className="text-gray-600 animate-fade-in-delay">
              Preparing your stylist management dashboard...
            </p>
            
            {/* Staff roles preview */}
            <div className="flex justify-center space-x-4 mt-4 animate-fade-in-delay-2">
              {[
                { name: 'Hair Stylists', emoji: '💇‍♀️', color: 'bg-indigo-100 text-indigo-600' },
                { name: 'Specialists', emoji: '✨', color: 'bg-purple-100 text-purple-600' },
                { name: 'Nail Artists', emoji: '💅', color: 'bg-pink-100 text-pink-600' },
                { name: 'Therapists', emoji: '💆‍♀️', color: 'bg-cyan-100 text-cyan-600' }
              ].map((role, index) => (
                <div 
                  key={role.name} 
                  className={`px-3 py-2 rounded-full text-xs font-medium ${role.color} animate-pulse`}
                  style={{animationDelay: `${index * 0.2}s`}}
                >
                  <span className="mr-1">{role.emoji}</span>
                  {role.name}
                </div>
              ))}
            </div>
          </div>

          {/* Header Skeleton */}
          <div className="bg-white/95 backdrop-blur rounded-xl p-4 mb-6 shadow-lg">
            <div className="flex justify-between items-center">
              <div className="space-y-2">
                <div className="h-6 bg-gray-200 rounded w-48 animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-64 animate-pulse"></div>
              </div>
              <div className="h-10 bg-gradient-to-r from-indigo-200 to-purple-200 rounded-lg w-32 animate-pulse"></div>
            </div>
          </div>

          {/* Stylists Grid Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
            {[...Array(6)].map((_, index) => {
              const stylistTypes = [
                { 
                  icon: '👩‍💼', 
                  name: 'Senior Stylist', 
                  specialty: 'Hair Cutting & Styling',
                  experience: '5+ years',
                  colors: { bg: 'bg-indigo-100', icon: 'bg-indigo-200', badge: 'bg-indigo-300', status: 'bg-green-200' }
                },
                { 
                  icon: '👨‍💼', 
                  name: 'Color Specialist', 
                  specialty: 'Hair Coloring Expert',
                  experience: '3+ years',
                  colors: { bg: 'bg-purple-100', icon: 'bg-purple-200', badge: 'bg-purple-300', status: 'bg-green-200' }
                },
                { 
                  icon: '👩‍🔬', 
                  name: 'Nail Artist', 
                  specialty: 'Nail Art & Manicure',
                  experience: '4+ years',
                  colors: { bg: 'bg-pink-100', icon: 'bg-pink-200', badge: 'bg-pink-300', status: 'bg-green-200' }
                },
                { 
                  icon: '🧑‍💼', 
                  name: 'Facial Therapist', 
                  specialty: 'Skincare & Facial Treatments',
                  experience: '6+ years',
                  colors: { bg: 'bg-emerald-100', icon: 'bg-emerald-200', badge: 'bg-emerald-300', status: 'bg-green-200' }
                },
                { 
                  icon: '👩‍⚕️', 
                  name: 'Massage Therapist', 
                  specialty: 'Relaxation & Therapy',
                  experience: '4+ years',
                  colors: { bg: 'bg-cyan-100', icon: 'bg-cyan-200', badge: 'bg-cyan-300', status: 'bg-green-200' }
                },
                { 
                  icon: '👨‍🎨', 
                  name: 'Makeup Artist', 
                  specialty: 'Bridal & Event Makeup',
                  experience: '7+ years',
                  colors: { bg: 'bg-rose-100', icon: 'bg-rose-200', badge: 'bg-rose-300', status: 'bg-green-200' }
                }
              ];
              
              const stylist = stylistTypes[index % stylistTypes.length];
              
              return (
                <div 
                  key={index} 
                  className={`${stylist.colors.bg} rounded-xl shadow-lg p-6 animate-pulse hover:shadow-xl transition-all duration-300 border border-white/50`}
                  style={{animationDelay: `${index * 0.15}s`}}
                >
                  {/* Profile Picture */}
                  <div className="flex items-center mb-4">
                    <div className={`w-16 h-16 ${stylist.colors.icon} rounded-full flex items-center justify-center text-3xl animate-bounce shadow-lg mr-4`} 
                         style={{animationDelay: `${index * 0.2}s`}}>
                      {stylist.icon}
                    </div>
                    <div className="flex-1">
                      <div className="h-6 bg-white/70 rounded-lg mb-2 w-3/4 animate-shimmer"></div>
                      <div className="h-4 bg-white/60 rounded w-2/3 animate-shimmer" style={{animationDelay: '0.1s'}}></div>
                    </div>
                  </div>
                  
                  {/* Specialty & Experience */}
                  <div className="space-y-2 mb-4">
                    <div className="h-4 bg-white/60 rounded w-full animate-shimmer" style={{animationDelay: '0.2s'}}></div>
                    <div className="h-4 bg-white/60 rounded w-4/5 animate-shimmer" style={{animationDelay: '0.3s'}}></div>
                  </div>
                  
                  {/* Contact Info */}
                  <div className="flex items-center mb-4">
                    <div className="w-4 h-4 bg-white/60 rounded mr-2"></div>
                    <div className="h-4 bg-white/60 rounded w-32 animate-shimmer"></div>
                  </div>
                  
                  {/* Status & Services */}
                  <div className="flex space-x-2 mb-4">
                    <div className={`h-6 ${stylist.colors.status} rounded-full w-16 animate-pulse shadow-sm`}></div>
                    <div className={`h-6 ${stylist.colors.badge} rounded-full w-20 animate-pulse shadow-sm`}></div>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="grid grid-cols-2 gap-2">
                    <div className="h-8 bg-white/60 rounded-lg animate-pulse"></div>
                    <div className="h-8 bg-gradient-to-r from-purple-300 to-pink-300 rounded-lg animate-pulse shadow-md"></div>
                  </div>
                  
                  {/* Decorative Elements */}
                  <div className="absolute top-2 right-2 w-2 h-2 bg-white/80 rounded-full animate-ping"></div>
                </div>
              );
            })}
          </div>

          {/* Empty State Preview */}
          <div className="text-center py-12 animate-pulse">
            {/* Team Management Icon Cluster */}
            <div className="relative w-24 h-24 mx-auto mb-6">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-200 to-purple-200 rounded-full animate-pulse"></div>
              <div className="absolute inset-2 bg-white rounded-full flex items-center justify-center">
                <div className="text-3xl animate-bounce">👥</div>
              </div>
              {/* Surrounding team icons */}
              <div className="absolute -top-2 -left-2 w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center text-sm animate-bounce" style={{animationDelay: '0.2s'}}>
                👩‍💼
              </div>
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center text-sm animate-bounce" style={{animationDelay: '0.4s'}}>
                👨‍💼
              </div>
              <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-8 h-8 bg-pink-100 rounded-full flex items-center justify-center text-sm animate-bounce" style={{animationDelay: '0.6s'}}>
                ✂️
              </div>
            </div>
            
            <div className="h-7 bg-gradient-to-r from-indigo-200 to-purple-200 rounded-lg w-56 mx-auto mb-3 animate-shimmer"></div>
            <div className="h-5 bg-gray-200 rounded w-72 mx-auto mb-6 animate-shimmer" style={{animationDelay: '0.1s'}}></div>
            
            {/* Preview management options */}
            <div className="flex justify-center space-x-3 mb-6">
              <div className="h-8 bg-indigo-200 rounded-full w-28 animate-pulse"></div>
              <div className="h-8 bg-purple-200 rounded-full w-24 animate-pulse" style={{animationDelay: '0.1s'}}></div>
              <div className="h-8 bg-pink-200 rounded-full w-26 animate-pulse" style={{animationDelay: '0.2s'}}></div>
            </div>
            
            <div className="h-11 bg-gradient-to-r from-indigo-300 to-purple-300 rounded-lg w-40 mx-auto animate-pulse shadow-lg"></div>
          </div>

          {/* Progress Indicators */}
          <div className="flex justify-center space-x-2 mt-8">
            <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{animationDelay: '0s'}}></div>
            <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
            <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce" style={{animationDelay: '0.4s'}}></div>
            <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{animationDelay: '0.6s'}}></div>
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
            
            @keyframes fade-in-delay-2 {
              0% { opacity: 0; transform: translateY(10px); }
              66% { opacity: 0; transform: translateY(10px); }
              100% { opacity: 1; transform: translateY(0); }
            }
            
            @keyframes shimmer {
              0% { 
                background-position: -200% 0;
                opacity: 0.7;
              }
              100% { 
                background-position: 200% 0;
                opacity: 1;
              }
            }
            
            .animate-fade-in {
              animation: fade-in 1s ease-out;
            }
            
            .animate-fade-in-delay {
              animation: fade-in-delay 2s ease-out;
            }
            
            .animate-fade-in-delay-2 {
              animation: fade-in-delay-2 3s ease-out;
            }
            
            .animate-shimmer {
              background: linear-gradient(90deg, transparent, rgba(255,255,255,0.9), transparent);
              background-size: 200% 100%;
              animation: shimmer 2s ease-in-out infinite;
            }
          `}</style>
        </div>
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
    </div>
  );
};

export default StylistManagement;
