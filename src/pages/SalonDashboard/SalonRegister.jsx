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
  Home,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle,
  Clock,
  XCircle,
  Loader2
} from "lucide-react";
import { PublicAPI } from "../../utils/api";
import { useGoogleMapsLoader } from "../../utils/googleMapsLoader";

import logo from "../../assets/weblogo-white1.png";
import Header from "../User/components/Header";

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
    confirmPassword: "",
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
  const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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

  // Enhanced error parsing function
  const parseError = (error) => {
    const errorMessage = error?.response?.data?.error || error?.message || "Unknown error occurred";
    
    // Email validation errors
    if (errorMessage.includes("invalid") && (errorMessage.includes("Email") || errorMessage.includes("email"))) {
      return {
        type: "validation",
        title: "Invalid Email Address",
        message: "Please enter a valid email address with correct format (e.g., example@domain.com)",
        icon: "📧"
      };
    }
    
    // Password validation errors
    if (errorMessage.includes("password") && errorMessage.includes("weak")) {
      return {
        type: "validation",
        title: "Weak Password",
        message: "Password must be at least 8 characters long and contain letters and numbers.",
        icon: "🔒"
      };
    }
    
    // Required field errors
    if (errorMessage.includes("required") || errorMessage.includes("cannot be empty")) {
      return {
        type: "validation",
        title: "Missing Required Information",
        message: "Please fill in all required fields before submitting.",
        icon: "📝"
      };
    }
    
    // Duplicate email errors
    if (errorMessage.includes("duplicate key") && errorMessage.includes("user_email_key")) {
      return {
        type: "conflict",
        title: "Email Already Registered",
        message: "This email address is already registered. Please use a different email or try logging in.",
        icon: "⚠️",
        action: "Go to Login"
      };
    }
    
    // Duplicate salon name errors
    if (errorMessage.includes("duplicate key") && errorMessage.includes("salon_name")) {
      return {
        type: "conflict",
        title: "Salon Name Already Exists",
        message: "A salon with this name already exists. Please choose a different name.",
        icon: "🏪"
      };
    }
    
    // Network/connection errors
    if (error?.code === "NETWORK_ERROR" || errorMessage.includes("Network")) {
      return {
        type: "network",
        title: "Connection Problem",
        message: "Unable to connect to the server. Please check your internet connection and try again.",
        icon: "🌐"
      };
    }
    
    // Server errors
    if (error?.response?.status >= 500) {
      return {
        type: "server",
        title: "Server Error",
        message: "Our servers are experiencing issues. Please try again in a few moments.",
        icon: "🔧"
      };
    }
    
    // Default error
    return {
      type: "general",
      title: "Registration Failed",
      message: "Something went wrong during registration. Please check your information and try again.",
      icon: "❌"
    };
  };

  // Client-side validation
  const validateForm = () => {
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      return {
        type: "validation",
        title: "Invalid Email Format",
        message: "Please enter a valid email address (e.g., yourname@domain.com)",
        icon: "📧"
      };
    }
    
    // Required fields validation
    const requiredFields = [
      { field: 'salon_name', label: 'Salon Name' },
      { field: 'email', label: 'Email' },
      { field: 'password', label: 'Password' },
      { field: 'contact_number', label: 'Contact Number' },
      { field: 'salon_address', label: 'Address' }
    ];
    
    for (const { field, label } of requiredFields) {
      if (!formData[field] || formData[field].trim() === '') {
        return {
          type: "validation",
          title: "Missing Required Field",
          message: `Please enter your ${label.toLowerCase()}.`,
          icon: "📝"
        };
      }
    }
    
    // Password strength validation
    if (formData.password.length < 6) {
      return {
        type: "validation",
        title: "Password Too Short",
        message: "Password must be at least 6 characters long.",
        icon: "🔒"
      };
    }
    
    // Password confirmation validation
    if (formData.password !== formData.confirmPassword) {
      return {
        type: "validation",
        title: "Passwords Don't Match",
        message: "Please make sure both password fields are identical.",
        icon: "🔐"
      };
    }
    
    return null; // No validation errors
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    
    // Client-side validation
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }
    
    setLoading(true);

    try {
      // Remove confirmPassword from the data sent to server
      const { confirmPassword, ...registrationData } = formData;
      await PublicAPI.post("/auth/register-salon", registrationData);

      setSuccess("Salon registration successful! Redirecting to login...");
      
      // Redirect after a brief delay to show the success message
      setTimeout(() => {
        navigate("/login", {
          state: {
            email: formData.email,
            password: formData.password,
          },
        });
      }, 2000);
      
    } catch (err) {
      console.error("Registration error:", err);
      const parsedError = parseError(err);
      setError(parsedError);
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
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="flex items-center justify-center py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl w-full bg-white rounded-lg shadow-md p-6">
          <div className="text-center mb-5">
            <img
              src={logo}
              alt="Logo"
              className="mx-auto h-14 w-auto mb-3"
            />
            <h2 className="text-2xl font-bold text-gray-900 mb-1">
              Register Your Salon
            </h2>
            <p className="text-gray-600 text-sm">Join our salon network today</p>
          </div>
          {/* Success Display */}
          {success && (
            <div className="p-3 rounded-md border flex items-start space-x-2 mb-4 bg-green-50 border-green-200 text-green-800">
              <div className="flex-shrink-0">
                <CheckCircle className="h-5 w-5 text-green-500" />
              </div>
              <div className="flex-1">
                <p className="text-xs font-medium">Salon Registered Successfully!</p>
                <p className="text-xs">{success}</p>
              </div>
            </div>
          )}

          {/* Error Display */}
          {error && (
            <div className={`p-3 rounded-md border flex items-start space-x-2 mb-4 ${
              error.type === 'success' 
                ? 'bg-green-50 border-green-200 text-green-800' 
                : error.type === 'validation'
                ? 'bg-amber-50 border-amber-200 text-amber-800'
                : error.type === 'conflict'
                ? 'bg-red-50 border-red-200 text-red-800'
                : error.type === 'network'
                ? 'bg-orange-50 border-orange-200 text-orange-800'
                : 'bg-red-50 border-red-200 text-red-800'
            }`}>
              <div className="flex-shrink-0">
                {error.type === 'success' ? (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                ) : error.type === 'validation' ? (
                  <AlertCircle className="h-5 w-5 text-amber-500" />
                ) : error.type === 'network' ? (
                  <Clock className="h-5 w-5 text-orange-500" />
                ) : (
                  <XCircle className="h-5 w-5 text-red-500" />
                )}
              </div>
              <div className="flex-1">
                <p className="text-xs font-medium">{error.title}</p>
                <p className="text-xs">{error.message}</p>
                {error.action && (
                  <button
                    onClick={() => navigate('/login')}
                    className="mt-1 text-xs font-medium text-red-700 hover:text-red-900 underline"
                  >
                    {error.action} →
                  </button>
                )}
              </div>
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit}>
            {/* Account Information Section */}
            <div className="border-b border-gray-200 pb-4">
              <h3 className="text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <div className="w-5 h-5 bg-gray-700 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">1</span>
                </div>
                Account Information
              </h3>
              
              <div>
                <label
                  htmlFor="email"
                  className="block text-xs font-medium text-gray-700 mb-1"
                >
                  Email address
                </label>
                <input
                  id="email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-gray-500 focus:border-gray-500 transition-colors text-sm"
                  placeholder="Enter your email"
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-xs font-medium text-gray-700 mb-1"
                >
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-gray-500 focus:border-gray-500 transition-colors pr-10 text-sm"
                    placeholder="Create a password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-xs font-medium text-gray-700 mb-1"
                >
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-gray-500 focus:border-gray-500 transition-colors pr-10 text-sm ${
                      formData.confirmPassword && formData.password !== formData.confirmPassword
                        ? 'border-red-300 focus:ring-red-400'
                        : formData.confirmPassword && formData.password === formData.confirmPassword
                        ? 'border-green-300 focus:ring-green-400'
                        : ''
                    }`}
                    placeholder="Confirm your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
                {/* Password match indicator */}
                {formData.confirmPassword && (
                  <div className="flex items-center gap-1 text-xs mt-1">
                    {formData.password === formData.confirmPassword ? (
                      <>
                        <span className="text-green-600">✓</span>
                        <span className="text-green-600">Passwords match</span>
                      </>
                    ) : (
                      <>
                        <span className="text-red-600">✗</span>
                        <span className="text-red-600">Passwords don't match</span>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Salon Information Section */}
            <div className="border-b border-gray-200 pb-4">
              <h3 className="text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <div className="w-5 h-5 bg-gray-700 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">2</span>
                </div>
                Salon Information
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="salon_name"
                    className="block text-xs font-medium text-gray-700 mb-1"
                  >
                    Salon Name
                  </label>
                  <input
                    id="salon_name"
                    type="text"
                    name="salon_name"
                    value={formData.salon_name}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-gray-500 focus:border-gray-500 transition-colors text-sm"
                    placeholder="Enter your salon name"
                  />
                </div>

                <div>
                  <label
                    htmlFor="contact_number"
                    className="block text-xs font-medium text-gray-700 mb-1"
                  >
                    Contact Number
                  </label>
                  <input
                    id="contact_number"
                    type="tel"
                    name="contact_number"
                    value={formData.contact_number}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-gray-500 focus:border-gray-500 transition-colors text-sm"
                    placeholder="Enter your phone number"
                  />
                </div>

                <div>
                  <label
                    htmlFor="salon_address"
                    className="block text-xs font-medium text-gray-700 mb-1"
                  >
                    Salon Address
                  </label>
                  <input
                    id="salon_address"
                    type="text"
                    name="salon_address"
                    value={formData.salon_address}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-gray-500 focus:border-gray-500 transition-colors text-sm"
                    placeholder="Enter your salon address"
                  />
                </div>

                <div>
                  <label
                    htmlFor="salon_description"
                    className="block text-xs font-medium text-gray-700 mb-1"
                  >
                    Description (Optional)
                  </label>
                  <textarea
                    id="salon_description"
                    name="salon_description"
                    value={formData.salon_description}
                    onChange={handleChange}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-gray-500 focus:border-gray-500 transition-colors text-sm resize-none"
                    placeholder="Describe your salon services and specialties (optional)"
                  />
                </div>
              </div>
            </div>

            {/* Location Section */}
            <div className="pb-4">
              <h3 className="text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <div className="w-5 h-5 bg-gray-700 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">3</span>
                </div>
                Location
              </h3>

              <div className="bg-gray-50 p-3 rounded-md text-xs mb-3">
                <p className="text-gray-600 flex items-start">
                  <MapPin className="h-4 w-4 inline mr-2 mt-0.5 flex-shrink-0" />
                  <span>Click on the map to set your salon's exact location. This helps customers find you easily.</span>
                </p>
              </div>

              <div className="h-48 rounded-md overflow-hidden border border-gray-300 shadow-sm mb-3">
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

              <div className="bg-blue-50 p-3 rounded-md border border-blue-100">
                <p className="text-xs text-gray-700 flex items-center">
                  <MapPin className="h-4 w-4 mr-2 text-blue-500" />
                  Selected Location: ({formData.location.latitude.toFixed(4)},{" "}
                  {formData.location.longitude.toFixed(4)})
                </p>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gray-900 text-white py-2 px-4 rounded-md 
               hover:bg-gray-800 
               focus:ring-2 focus:ring-gray-800 focus:ring-offset-1
               transition-all duration-200 font-medium text-sm
               disabled:opacity-50 disabled:cursor-not-allowed 
               flex items-center justify-center space-x-2 mt-2"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Creating Salon Account...</span>
                </>
              ) : (
                <span>Register My Salon</span>
              )}
            </button>
          </form>

          <div className="mt-5">
            <p className="text-center text-xs text-gray-600">
              Already have an account?{" "}
              <a href="/login" className="font-medium text-gray-900 hover:underline">
                Sign in now
              </a>
            </p>

            <div className="mt-2 flex items-center justify-center">
              <a href="/signup" className="text-xs font-medium text-gray-900 hover:underline flex items-center">
                <span>Register as customer instead</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterSalon;
