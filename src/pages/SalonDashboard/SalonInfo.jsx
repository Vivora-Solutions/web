import { useEffect, useState, useCallback } from "react";
import EditableField from "./components/EditableField";
import { ProtectedAPI } from "../../utils/api";
import supabase from "../../utils/supabaseClient";
import { GoogleMap, Marker } from "@react-google-maps/api";
import { parseWKBHexToLatLng } from "../../utils/wkbToLatLng";
import { useGoogleMapsLoader } from "../../utils/googleMapsLoader";

// Google Maps container style
const containerStyle = {
  width: "100%",
  height: "100%",
};

// Default center (Sri Lanka)
const defaultCenter = {
  lat: 7.8731,
  lng: 80.7718,
};

const SalonInfo = () => {
  const [salon, setSalon] = useState(null);
  const [formData, setFormData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  // Use shared Google Maps loader
  const { isLoaded, loadError } = useGoogleMapsLoader();

  useEffect(() => {
    const fetchSalon = async () => {
      try {
        const res = await ProtectedAPI.get("/salon-admin/my");
        const salonData = res.data;

        // Parse location from WKB format if it exists
        let parsedLocation = defaultCenter;
        if (salonData.location) {
          try {
            parsedLocation = parseWKBHexToLatLng(salonData.location);
          } catch (error) {
            console.error("Error parsing location:", error);
            // If no valid location exists, try to get user's current location
            if (navigator.geolocation) {
              navigator.geolocation.getCurrentPosition(
                (pos) => {
                  const { latitude, longitude } = pos.coords;
                  parsedLocation = { lat: latitude, lng: longitude };
                },
                (err) => {
                  console.warn("Geolocation error:", err.message);
                },
                { enableHighAccuracy: true }
              );
            }
          }
        }

        const processedData = {
          ...salonData,
          location: {
            latitude: parsedLocation.lat,
            longitude: parsedLocation.lng,
          },
        };

        setSalon(processedData);
        setFormData(processedData);
      } catch (err) {
        console.error("Failed to fetch salon info:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchSalon();
  }, []);

  const handleChange = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  // Handle map clicks (update marker)
  const onMapClick = useCallback(
    (e) => {
      if (!isEditing) return; // Extra safety check

      const newLocation = {
        latitude: e.latLng.lat(),
        longitude: e.latLng.lng(),
      };

      setFormData((prev) => ({
        ...prev,
        location: newLocation,
      }));

      // Optional: Show a brief confirmation
      //console.log(
      //  `Location updated to: ${newLocation.latitude.toFixed(
      //    4
      //  )}, ${newLocation.longitude.toFixed(4)}`
      //);
    },
    [isEditing]
  );

  // Add logo upload handler
  const handleLogoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const {
      data: { user },
    } = await supabase.auth.getUser();
    
    console.log("Logged-in user UID (auth.uid()):", user?.id);

    if (!file.type.startsWith("image/")) {
      alert("Please select an image file");
      return;
    }

    setUploading(true);

    try {
      const fileName = `logo-${Date.now()}-${file.name}`;

      // Upload to Supabase bucket
      const { data, error } = await supabase.storage
        .from("salon-images")
        .upload(fileName, file);

      if (error) throw error;

      // Get public URL
      const { data: urlData } = supabase.storage
        .from("salon-images")
        .getPublicUrl(fileName);

      const imageUrl = urlData.publicUrl;

      // Update form data with new logo URL
      handleChange("salon_logo_link", imageUrl);

      alert("Logo uploaded successfully!");
    } catch (error) {
      console.error("Error uploading logo:", error);
      alert("Failed to upload logo");
    } finally {
      setUploading(false);
    }
  };

  const handleUpdate = async () => {
    try {
      const payload = {
        salon_id: formData.salon_id,
        salon_name: formData.salon_name,
        salon_description: formData.salon_description,
        salon_address: formData.salon_address,
        salon_contact_number: formData.salon_contact_number,
        salon_logo_link: formData.salon_logo_link,
        location: formData.location, // Include location in update
      };

      //console.log("Updating salon with payload:", payload);
      const response = await ProtectedAPI.put("/salon-admin/update", payload);
      //console.log("Update response:", response.data);

      setSalon((prev) => ({ ...prev, ...payload }));
      setIsEditing(false);

      alert("Salon updated successfully!");
    } catch (err) {
      console.error("Update failed:", err.response?.data || err.message);
      alert(
        `Failed to update salon: ${err.response?.data?.error || err.message}`
      );
    }
  };

  if (loading || !formData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 flex items-center justify-center p-4">
        <div className="w-full max-w-5xl mx-auto bg-white/80 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-white/20">
          
          {/* Loading Header */}
          <div className="mb-8 text-center">
            <div className="relative inline-block">
              {/* Animated Salon Info Icon */}
              <div className="w-20 h-20 mx-auto mb-4 relative">
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-500 rounded-full animate-pulse"></div>
                <div className="absolute inset-1 bg-white rounded-full flex items-center justify-center">
                  {/* Info/Document Icon */}
                  <svg className="w-10 h-10 text-teal-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z"/>
                    <polyline points="14,2 14,8 20,8"/>
                    <line x1="16" y1="13" x2="8" y2="13"/>
                    <line x1="16" y1="17" x2="8" y2="17"/>
                    <polyline points="10,9 9,9 8,9"/>
                  </svg>
                </div>
                
                {/* Rotating border */}
                <div className="absolute inset-0 border-4 border-transparent border-t-emerald-500 rounded-full animate-spin"></div>
              </div>
              
              {/* Floating salon info icons */}
              <div className="absolute -top-4 -left-4 w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center animate-bounce" style={{animationDelay: '0s'}}>
                🏢
              </div>
              <div className="absolute -top-4 -right-4 w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center animate-bounce" style={{animationDelay: '0.5s'}}>
                📍
              </div>
              <div className="absolute -bottom-4 -left-4 w-8 h-8 bg-cyan-100 rounded-full flex items-center justify-center animate-bounce" style={{animationDelay: '1s'}}>
                📞
              </div>
              <div className="absolute -bottom-4 -right-4 w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center animate-bounce" style={{animationDelay: '1.5s'}}>
                🖼️
              </div>
            </div>
            
            <h2 className="text-2xl font-bold text-gray-800 mb-2 animate-fade-in">
              Loading Salon Information
            </h2>
            <p className="text-gray-600 animate-fade-in-delay">
              Preparing your salon profile and details...
            </p>
            
            {/* Info categories preview */}
            <div className="flex justify-center space-x-4 mt-4 animate-fade-in-delay-2">
              {[
                { name: 'Basic Info', emoji: 'ℹ️', color: 'bg-emerald-100 text-emerald-600' },
                { name: 'Location', emoji: '📍', color: 'bg-teal-100 text-teal-600' },
                { name: 'Contact', emoji: '📞', color: 'bg-cyan-100 text-cyan-600' },
                { name: 'Gallery', emoji: '🖼️', color: 'bg-blue-100 text-blue-600' }
              ].map((category, index) => (
                <div 
                  key={category.name} 
                  className={`px-3 py-2 rounded-full text-xs font-medium ${category.color} animate-pulse`}
                  style={{animationDelay: `${index * 0.2}s`}}
                >
                  <span className="mr-1">{category.emoji}</span>
                  {category.name}
                </div>
              ))}
            </div>
          </div>

          {/* Salon Info Form Preview */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            
            {/* Left Column - Basic Info */}
            <div className="space-y-6">
              <div className="bg-white/95 backdrop-blur rounded-xl p-6 shadow-lg">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-emerald-200 rounded-full flex items-center justify-center text-2xl animate-bounce mr-4">
                    🏪
                  </div>
                  <div className="flex-1">
                    <div className="h-6 bg-gray-200 rounded w-32 mb-2 animate-shimmer"></div>
                    <div className="h-4 bg-gray-200 rounded w-24 animate-shimmer"></div>
                  </div>
                </div>
                
                {/* Form fields skeleton */}
                <div className="space-y-4">
                  {[
                    { label: 'Salon Name', width: 'w-full' },
                    { label: 'Phone Number', width: 'w-3/4' },
                    { label: 'Email Address', width: 'w-4/5' },
                    { label: 'Website URL', width: 'w-2/3' }
                  ].map((field, index) => (
                    <div key={index} className="animate-pulse" style={{animationDelay: `${index * 0.1}s`}}>
                      <div className="h-4 bg-gray-200 rounded w-20 mb-2"></div>
                      <div className={`h-10 bg-gray-100 rounded-lg ${field.width} animate-shimmer`}></div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Address Section */}
              <div className="bg-white/95 backdrop-blur rounded-xl p-6 shadow-lg">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-teal-200 rounded-full flex items-center justify-center text-2xl animate-bounce mr-4">
                    📍
                  </div>
                  <div className="flex-1">
                    <div className="h-6 bg-gray-200 rounded w-28 mb-2 animate-shimmer"></div>
                    <div className="h-4 bg-gray-200 rounded w-32 animate-shimmer"></div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  {[
                    { label: 'Street Address', width: 'w-full' },
                    { label: 'City', width: 'w-1/2' },
                    { label: 'State/Province', width: 'w-1/2' },
                    { label: 'Postal Code', width: 'w-1/3' }
                  ].map((field, index) => (
                    <div key={index} className="animate-pulse" style={{animationDelay: `${index * 0.1 + 0.2}s`}}>
                      <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
                      <div className={`h-10 bg-gray-100 rounded-lg ${field.width} animate-shimmer`}></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column - Visual Elements */}
            <div className="space-y-6">
              
              {/* Logo Section */}
              <div className="bg-white/95 backdrop-blur rounded-xl p-6 shadow-lg">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-cyan-200 rounded-full flex items-center justify-center text-2xl animate-bounce mr-4">
                    🖼️
                  </div>
                  <div className="flex-1">
                    <div className="h-6 bg-gray-200 rounded w-24 mb-2 animate-shimmer"></div>
                    <div className="h-4 bg-gray-200 rounded w-32 animate-shimmer"></div>
                  </div>
                </div>
                
                {/* Logo preview areas */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="aspect-square bg-gradient-to-br from-cyan-100 to-blue-100 rounded-lg flex items-center justify-center animate-pulse">
                    <div className="text-4xl animate-bounce">🏪</div>
                  </div>
                  <div className="aspect-square bg-gradient-to-br from-emerald-100 to-teal-100 rounded-lg flex items-center justify-center animate-pulse" style={{animationDelay: '0.2s'}}>
                    <div className="text-4xl animate-bounce" style={{animationDelay: '0.4s'}}>📷</div>
                  </div>
                </div>
                
                <div className="mt-4 space-y-2">
                  <div className="h-10 bg-gradient-to-r from-cyan-200 to-blue-200 rounded-lg animate-pulse"></div>
                  <div className="h-8 bg-gray-100 rounded-lg animate-pulse"></div>
                </div>
              </div>

              {/* Map Section */}
              <div className="bg-white/95 backdrop-blur rounded-xl p-6 shadow-lg">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-blue-200 rounded-full flex items-center justify-center text-2xl animate-bounce mr-4">
                    🗺️
                  </div>
                  <div className="flex-1">
                    <div className="h-6 bg-gray-200 rounded w-20 mb-2 animate-shimmer"></div>
                    <div className="h-4 bg-gray-200 rounded w-28 animate-shimmer"></div>
                  </div>
                </div>
                
                {/* Map preview */}
                <div className="h-48 bg-gradient-to-br from-blue-100 via-teal-100 to-cyan-100 rounded-lg flex items-center justify-center animate-pulse">
                  <div className="text-center">
                    <div className="text-5xl animate-bounce mb-2">🗺️</div>
                    <div className="h-4 bg-white/70 rounded w-32 mx-auto animate-shimmer"></div>
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* Description Section */}
          <div className="bg-white/95 backdrop-blur rounded-xl p-6 shadow-lg mb-8">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-emerald-200 rounded-full flex items-center justify-center text-2xl animate-bounce mr-4">
                📝
              </div>
              <div className="flex-1">
                <div className="h-6 bg-gray-200 rounded w-28 mb-2 animate-shimmer"></div>
                <div className="h-4 bg-gray-200 rounded w-36 animate-shimmer"></div>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="h-4 bg-gray-100 rounded w-full animate-shimmer"></div>
              <div className="h-4 bg-gray-100 rounded w-5/6 animate-shimmer" style={{animationDelay: '0.1s'}}></div>
              <div className="h-4 bg-gray-100 rounded w-4/5 animate-shimmer" style={{animationDelay: '0.2s'}}></div>
              <div className="h-4 bg-gray-100 rounded w-3/4 animate-shimmer" style={{animationDelay: '0.3s'}}></div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-4">
            <div className="h-12 bg-gray-200 rounded-lg w-24 animate-pulse"></div>
            <div className="h-12 bg-gradient-to-r from-emerald-300 to-teal-300 rounded-lg w-32 animate-pulse shadow-lg"></div>
          </div>

          {/* Progress Indicators */}
          <div className="flex justify-center space-x-2 mt-8">
            <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce" style={{animationDelay: '0s'}}></div>
            <div className="w-2 h-2 bg-teal-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
            <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{animationDelay: '0.4s'}}></div>
            <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{animationDelay: '0.6s'}}></div>
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
    <div className="min-h-screen bg-slate-50 py-10 px-4 flex justify-center items-start">
      <div className="relative w-full rounded-2xl shadow-xl border border-slate-200 bg-white p-4 pb-20">
        {/* pb-20 adds space at bottom for buttons */}

        {/* Title & subtitle */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-1">
            Salon Management
          </h1>
          <p className="text-indigo-600">
            Manage your salon's profile and public information
          </p>
        </div>

        {/* Logo Upload - Updated section */}
        <div className="flex flex-col lg:flex-row items-start gap-6 bg-slate-50 p-6 rounded-xl border border-slate-200 mb-10">
          <div className="shrink-0 relative group w-24 h-24">
            {formData.salon_logo_link ? (
              <>
                <img
                  src={formData.salon_logo_link}
                  alt="Salon Logo"
                  className="w-full h-full object-cover rounded-full border-4 border-white shadow ring-2 ring-indigo-100"
                />
                {isEditing && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 rounded-full opacity-0 group-hover:opacity-100 transition cursor-pointer">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleLogoUpload}
                      className="hidden"
                      id="logo-upload"
                      disabled={uploading}
                    />
                    <label
                      htmlFor="logo-upload"
                      className="w-full h-full flex items-center justify-center cursor-pointer"
                    >
                      {uploading ? (
                        <div className="animate-spin h-12 w-12 border-b-2 border-indigo-600 rounded-full mx-auto mb-4"></div>
                      ) : (
                        <svg
                          className="h-6 w-6 text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 13a3 3 0 11-6 0 3 3 0 016 0z M3 9a2 2 0 012-2h14a2 2 0 012 2v9a2 2 0 01-2-2H5a2 2 0 01-2-2z"
                          />
                        </svg>
                      )}
                    </label>
                  </div>
                )}
              </>
            ) : (
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center border-4 border-white shadow relative">
                <svg
                  className="w-10 h-10 text-slate-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12z"
                  />
                </svg>
                {isEditing && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 rounded-full opacity-0 group-hover:opacity-100 transition cursor-pointer">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleLogoUpload}
                      className="hidden"
                      id="logo-upload-empty"
                      disabled={uploading}
                    />
                    <label
                      htmlFor="logo-upload-empty"
                      className="w-full h-full flex items-center justify-center cursor-pointer"
                    >
                      {uploading ? (
                        <div className="animate-spin h-12 w-12 border-b-2 border-indigo-600 rounded-full mx-auto mb-4"></div>
                      ) : (
                        <svg
                          className="h-6 w-6 text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                          />
                        </svg>
                      )}
                    </label>
                  </div>
                )}
              </div>
            )}
          </div>
          <div className="flex-1">
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Salon Logo
            </label>
            <div className="flex gap-2 items-center mb-2">
              {isEditing && (
                <div className="flex gap-2">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    className="hidden"
                    id="logo-upload-btn"
                    disabled={uploading}
                  />
                  <label
                    htmlFor="logo-upload-btn"
                    className={`px-3 py-1 text-sm rounded border cursor-pointer transition ${
                      uploading
                        ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
                        : "bg-blue-50 text-blue-600 border-blue-200 hover:bg-blue-100"
                    }`}
                  >
                    {uploading ? "Uploading..." : "Upload Image"}
                  </label>
                </div>
              )}
            </div>
            {/* <EditableField
              value={formData.salon_logo_link}
              onSave={(v) => handleChange("salon_logo_link", v)}
              disabled={!isEditing}
              placeholder="Paste image URL or upload an image"
              className="text-sm text-slate-600"
            /> */}
            <p className="text-xs text-slate-500 mt-1">
              Recommended: 200x200px, square format
            </p>
          </div>
        </div>

        {/* ...existing code... */}
        {/* Info Fields */}
        <div className="grid gap-6">
          <FieldGroup
            label="Salon Name"
            icon="🏠"
            value={formData.salon_name}
            onChange={(v) => handleChange("salon_name", v)}
            disabled={!isEditing}
          />

          <FieldGroup
            label="Description"
            icon="📝"
            value={formData.salon_description}
            onChange={(v) => handleChange("salon_description", v)}
            disabled={!isEditing}
            multiline
          />

          <div className="grid md:grid-cols-2 gap-6">
            <FieldGroup
              label="Address"
              icon="📍"
              value={formData.salon_address}
              onChange={(v) => handleChange("salon_address", v)}
              disabled={!isEditing}
            />

            <FieldGroup
              label="Contact Number"
              icon="📞"
              value={formData.salon_contact_number}
              onChange={(v) => handleChange("salon_contact_number", v)}
              disabled={!isEditing}
            />
          </div>

          {/* Location Section */}
          <div className="group">
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              🗺️ Salon Location
            </label>
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 group-hover:border-indigo-200 transition-colors duration-200">
              <div
                className={`h-64 rounded-xl overflow-hidden border-2 border-gray-200 shadow-md mb-3 ${
                  isEditing ? "cursor-crosshair" : "cursor-default"
                }`}
              >
                {loadError && (
                  <div className="h-full flex items-center justify-center bg-red-50">
                    <p className="text-red-600">Error loading map</p>
                  </div>
                )}
                {isLoaded && formData.location && (
                  <GoogleMap
                    mapContainerStyle={containerStyle}
                    center={{
                      lat: formData.location.latitude,
                      lng: formData.location.longitude,
                    }}
                    zoom={14}
                    onClick={isEditing ? onMapClick : undefined}
                    options={{
                      mapId: import.meta.env.VITE_GOOGLE_MAP_ID || undefined,
                      streetViewControl: false,
                      mapTypeControl: false,
                      fullscreenControl: false,
                      gestureHandling: "greedy",
                    }}
                  >
                    <Marker
                      position={{
                        lat: formData.location.latitude,
                        lng: formData.location.longitude,
                      }}
                    />
                  </GoogleMap>
                )}
                {!isLoaded && !loadError && (
                  <div className="h-full flex items-center justify-center bg-gray-100">
                    <div className="animate-spin h-12 w-12 border-b-2 border-indigo-600 rounded-full"></div>
                  </div>
                )}
              </div>

              <div className="bg-gray-50 p-3 rounded-lg text-sm">
                {isEditing && (
                  <p className="text-indigo-600 mb-2 font-medium">
                    📍 Click on the map to update your salon's location
                  </p>
                )}
                <p className="font-medium text-gray-800">
                  Current coordinates: (
                  {formData.location?.latitude?.toFixed(4) || "N/A"},{" "}
                  {formData.location?.longitude?.toFixed(4) || "N/A"})
                </p>
                {isEditing && (
                  <div className="mt-2 flex gap-2">
                    <button
                      onClick={() => {
                        if (navigator.geolocation) {
                          navigator.geolocation.getCurrentPosition(
                            (pos) => {
                              const { latitude, longitude } = pos.coords;
                              setFormData((prev) => ({
                                ...prev,
                                location: { latitude, longitude },
                              }));
                            },
                            (err) => {
                              console.warn("Geolocation error:", err.message);
                              alert(
                                "Unable to get your current location. Please click on the map to set the location manually."
                              );
                            },
                            { enableHighAccuracy: true }
                          );
                        }
                      }}
                      className="px-3 py-1 bg-blue-50 text-blue-600 border border-blue-200 rounded text-xs hover:bg-blue-100 transition-colors"
                    >
                      📍 Use Current Location
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-50 border-t border-slate-200 px-6 py-4 mt-10 flex items-center justify-between text-sm text-slate-600 rounded-b-2xl">
          <div className="flex items-center gap-2">
            <svg
              className="h-4 w-4 text-emerald-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4"
              />
            </svg>
            Profile information is automatically saved
          </div>
          <div className="text-xs">
            Last updated: {new Date().toLocaleDateString()}
          </div>
        </div>

        {/* Buttons fixed at bottom right inside card */}
        <div className="absolute bottom-6 right-6 flex gap-3">
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="btn border border-indigo-500 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 px-4 py-2 rounded"
            >
              Edit Profile
            </button>
          ) : (
            <>
              <button
                onClick={() => setIsEditing(false)}
                className="btn bg-slate-500 hover:bg-slate-600 text-white px-4 py-2 rounded"
                disabled={uploading}
              >
                Cancel
              </button>
              <button
                onClick={handleUpdate}
                className="btn bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded"
                disabled={uploading}
              >
                {uploading ? "Uploading..." : "Save Changes"}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

// ...existing code...
const FieldGroup = ({
  label,
  icon,
  value,
  onChange,
  disabled,
  multiline = false,
}) => (
  <div className="group">
    <label className="block text-sm font-semibold text-slate-700 mb-2">
      {icon} {label}
    </label>
    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 group-hover:border-indigo-200 transition-colors duration-200">
      <EditableField
        value={value}
        onSave={onChange}
        disabled={disabled}
        multiline={multiline}
        className="text-slate-700"
      />
    </div>
  </div>
);

export default SalonInfo;
