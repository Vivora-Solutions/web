import React, { useState, useCallback, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { GoogleMap } from "@react-google-maps/api";
import {
  Mail,
  Lock,
  Store,
  MapPin,
  Scissors,
  Sparkles,
  Phone,
  FileText,
  Home
} from "lucide-react";
import { PublicAPI } from "../../utils/api";
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

const RegisterSalon = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    salon_name: "",
    contact_number: "",
    salon_address: "",
    salon_description: "",
    salon_logo_link: "",
    location: {
      latitude: defaultCenter.lat,
      longitude: defaultCenter.lng,
    },
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const mapRef = useRef(null);
  const markerRef = useRef(null);

  // Use shared Google Maps loader
  const { isLoaded, loadError } = useGoogleMapsLoader();

  // ✅ Auto-detect user location on load
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          setFormData((prev) => ({
            ...prev,
            location: { latitude, longitude },
          }));

          if (mapRef.current) {
            mapRef.current.panTo({ lat: latitude, lng: longitude });
          }
        },
        (err) => {
          console.warn("Geolocation error:", err.message);
        },
        { enableHighAccuracy: true }
      );
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await PublicAPI.post("/auth/register-salon", formData);

      alert("Registration successful! Redirecting to login...");
      navigate("/login", {
        state: {
          email: formData.email,
          password: formData.password,
        },
      });
    } catch (err) {
      console.error(err);
      setError(
        err?.response?.data?.error || "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // ✅ Handle map clicks → update marker + formData
  const onMapClick = useCallback((e) => {
    const lat = e.latLng.lat();
    const lng = e.latLng.lng();

    setFormData((prev) => ({
      ...prev,
      location: { latitude: lat, longitude: lng },
    }));

    if (markerRef.current) {
      markerRef.current.position = { lat, lng };
    }
  }, []);

  // ✅ Create initial marker
  const onMapLoad = (map) => {
    mapRef.current = map;

    const marker = new google.maps.marker.AdvancedMarkerElement({
      position: {
        lat: formData.location.latitude,
        lng: formData.location.longitude,
      },
      map,
      title: "Salon Location",
    });

    markerRef.current = marker;
  };

  // ✅ Sync marker when formData.location changes
  useEffect(() => {
    if (mapRef.current && markerRef.current) {
      markerRef.current.position = {
        lat: formData.location.latitude,
        lng: formData.location.longitude,
      };
    }
  }, [formData.location]);

  if (loadError) return <div>Error loading map</div>;
  if (!isLoaded)
    return (
      <div className="animate-spin h-12 w-12 border-b-2 border-indigo-600 rounded-full mx-auto mt-8 mb-4"></div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 py-8 px-4">
      {/* Header */}
      <div className="max-w-4xl mx-auto mb-8 text-center">
        <div className="flex justify-center items-center gap-3 mb-4">
          <div className="p-3 bg-gradient-to-r from-gray-800 to-gray-600 rounded-full">
            <Scissors className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
            Register Your Salon
          </h1>
          <div className="p-3 bg-gradient-to-r from-gray-700 to-gray-500 rounded-full">
            <Sparkles className="h-8 w-8 text-white" />
          </div>
        </div>
      </div>

      {/* Form Card */}
      <div className="max-w-4xl mx-auto">
        <div className="shadow-lg border bg-white rounded-3xl overflow-hidden">
          <div className="p-4 md:p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Account Info */}
              <div className="space-y-4">
                <h3 className="text-base md:text-lg font-semibold text-gray-800 flex items-center gap-2 pb-2 border-b border-gray-200">
                  <div className="w-6 h-6 bg-gray-700 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-bold">1</span>
                  </div>
                  Account Information
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-gray-600 text-sm font-medium">
                      <Mail className="h-4 w-4" /> Email Address
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="h-12 w-full rounded-md border px-4 focus:ring-2 focus:ring-gray-400"
                      placeholder="your.email@example.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-gray-600 text-sm font-medium">
                      <Lock className="h-4 w-4" /> Password
                    </label>
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      className="h-12 w-full rounded-md border px-4 focus:ring-2 focus:ring-gray-400"
                      placeholder="Create a strong password"
                    />
                  </div>
                </div>
              </div>

              {/* Salon Info */}
              <div className="space-y-4">
                <h3 className="text-base md:text-lg font-semibold text-gray-800 flex items-center gap-2 pb-2 border-b border-gray-200">
                  <div className="w-6 h-6 bg-gray-700 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-bold">2</span>
                  </div>
                  Salon Information
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-gray-600 text-sm font-medium">
                      <Store className="h-4 w-4" /> Salon Name
                    </label>
                    <input
                      name="salon_name"
                      value={formData.salon_name}
                      onChange={handleChange}
                      required
                      className="h-12 w-full rounded-md border px-4 focus:ring-2 focus:ring-gray-400"
                      placeholder="Your Salon Name"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-gray-600 text-sm font-medium">
                      <Phone className="h-4 w-4" /> Contact Number
                    </label>
                    <input
                      name="contact_number"
                      value={formData.contact_number}
                      onChange={handleChange}
                      required
                      className="h-12 w-full rounded-md border px-4 focus:ring-2 focus:ring-gray-400"
                      placeholder="Phone Number"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-gray-600 text-sm font-medium">
                    <Home className="h-4 w-4" /> Address
                  </label>
                  <input
                    name="salon_address"
                    value={formData.salon_address}
                    onChange={handleChange}
                    required
                    className="h-12 w-full rounded-md border px-4 focus:ring-2 focus:ring-gray-400"
                    placeholder="Full address of your salon"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-gray-600 text-sm font-medium">
                    <FileText className="h-4 w-4" /> Description
                  </label>
                  <textarea
                    name="salon_description"
                    value={formData.salon_description}
                    onChange={handleChange}
                    required
                    className="min-h-[100px] w-full rounded-md border px-4 py-3 focus:ring-2 focus:ring-gray-400 resize-none"
                    placeholder="Describe your salon services, specialties, and unique offerings..."
                  />
                </div>
              </div>

              {/* Location Picker */}
              <div className="space-y-4">
                <h3 className="text-base md:text-lg font-semibold text-gray-800 flex items-center gap-2 pb-2 border-b border-gray-200">
                  <div className="w-6 h-6 bg-gray-700 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-bold">3</span>
                  </div>
                  Location
                </h3>

                <div className="bg-gray-50 p-4 rounded-lg text-sm mb-3">
                  <p className="text-gray-600 flex items-start">
                    <MapPin className="h-4 w-4 inline mr-2 mt-0.5 flex-shrink-0" />
                    <span>Click on the map to set your salon's exact location. This helps customers find you easily.</span>
                  </p>
                </div>

                <div className="h-64 sm:h-80 rounded-xl overflow-hidden border-2 border-gray-200 shadow-md">
                  <GoogleMap
                    mapContainerStyle={containerStyle}
                    center={{
                      lat: formData.location.latitude,
                      lng: formData.location.longitude,
                    }}
                    zoom={14}
                    onClick={onMapClick}
                    onLoad={onMapLoad}
                    options={{
                      mapId: import.meta.env.VITE_GOOGLE_MAP_ID,
                      streetViewControl: false,
                      mapTypeControl: false,
                      fullscreenControl: false,
                    }}
                  />
                </div>

                <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                  <p className="font-medium text-gray-700 flex items-center">
                    <MapPin className="h-5 w-5 mr-2 text-blue-500" />
                    Selected Location: ({formData.location.latitude.toFixed(4)},{" "}
                    {formData.location.longitude.toFixed(4)})
                  </p>
                </div>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 p-3 rounded-lg">
                  <p className="text-red-600 text-sm">{error}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full h-12 bg-gradient-to-r from-gray-700 to-gray-600 text-white font-medium rounded-md flex justify-center items-center hover:from-gray-800 hover:to-gray-700 transition-all"
              >
                {loading ? (
                  <>
                    <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                    Registering...
                  </>
                ) : (
                  <>
                    <Store className="mr-2 h-5 w-5" /> Register My Salon
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterSalon;
