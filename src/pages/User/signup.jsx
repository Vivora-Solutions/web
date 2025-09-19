

import React, { useState, useCallback, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Mail,
  Lock,
  Store,
  MapPin,
  Scissors,
  Sparkles,
  Phone,
  Calendar,
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

import logo from "../../assets/weblogo-white1.png";
import Header from "./components/Header";

// Google Maps container style
const containerStyle = {
  width: "100%",
  height: "100%",
};

const RegisterCustomerForm = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirm_password: "",
    first_name: "",
    last_name: "",
    date_of_birth: "",
    contact_number: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
//   const mapRef = useRef(null);
//   const markerRef = useRef(null);


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
      { field: 'email', label: 'Email' },
      { field: 'password', label: 'Password' },
      { field: 'first_name', label: 'First Name' },
      { field: 'last_name', label: 'Last Name' },
      { field: 'date_of_birth', label: 'Date of Birth' },
      { field: 'contact_number', label: 'Contact Number' }
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
    if (formData.password !== formData.confirm_password) {
      return {
        type: "validation",
        title: "Passwords Don't Match",
        message: "Please make sure both password fields are identical.",
        icon: "🔐"
      };
    }

    // Contact number validation
    const phoneRegex = /^\+?\d{7,15}$/;
    if (!phoneRegex.test(formData.contact_number)) {
      return {
        type: "validation",
        title: "Invalid Phone Number",
        message: "Enter a valid phone number (7–15 digits, optional +).",
        icon: "📱"
      };
    }
    
    // Date of birth validation
    if (formData.date_of_birth) {
      const today = new Date().toISOString().split("T")[0];
      if (formData.date_of_birth > today) {
        return {
          type: "validation",
          title: "Invalid Date of Birth",
          message: "Date of birth cannot be in the future.",
          icon: "📅"
        };
      }
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
      // Remove confirm_password from the data sent to server
      const { confirm_password, ...registrationData } = formData;
      await PublicAPI.post("/auth/register-customer", registrationData);

      setSuccess("Registration successful! Redirecting to login...");
      
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



  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="flex items-center justify-center py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full bg-white rounded-lg shadow-md p-6">
          <div className="text-center mb-5">
            <img
              src={logo}
              alt="Logo"
              className="mx-auto h-14 w-auto mb-3"
            />
            <h2 className="text-2xl font-bold text-gray-900 mb-1">
              Create Your Account
            </h2>
            <p className="text-gray-600 text-sm">Join us today</p>
          </div>
          {/* Success Display */}
          {success && (
            <div className="p-3 rounded-md border flex items-start space-x-2 mb-4 bg-green-50 border-green-200 text-green-800">
              <div className="flex-shrink-0">
                <CheckCircle className="h-5 w-5 text-green-500" />
              </div>
              <div className="flex-1">
                <p className="text-xs font-medium">Account Created Successfully!</p>
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
                htmlFor="confirm_password"
                className="block text-xs font-medium text-gray-700 mb-1"
              >
                Confirm Password
              </label>
              <div className="relative">
                <input
                  id="confirm_password"
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirm_password"
                  value={formData.confirm_password}
                  onChange={handleChange}
                  required
                  className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-gray-500 focus:border-gray-500 transition-colors pr-10 text-sm ${
                    formData.confirm_password && formData.password !== formData.confirm_password
                      ? 'border-red-300 focus:ring-red-400'
                      : formData.confirm_password && formData.password === formData.confirm_password
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
              {formData.confirm_password && (
                <div className="flex items-center gap-1 text-xs mt-1">
                  {formData.password === formData.confirm_password ? (
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

            <div>
              <label
                htmlFor="first_name"
                className="block text-xs font-medium text-gray-700 mb-1"
              >
                First Name
              </label>
              <input
                id="first_name"
                type="text"
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-gray-500 focus:border-gray-500 transition-colors text-sm"
                placeholder="Enter your first name"
              />
            </div>

            <div>
              <label
                htmlFor="last_name"
                className="block text-xs font-medium text-gray-700 mb-1"
              >
                Last Name
              </label>
              <input
                id="last_name"
                type="text"
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-gray-500 focus:border-gray-500 transition-colors text-sm"
                placeholder="Enter your last name"
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
                htmlFor="date_of_birth"
                className="block text-xs font-medium text-gray-700 mb-1"
              >
                Date of Birth
              </label>
              <input
                id="date_of_birth"
                type="date"
                name="date_of_birth"
                value={formData.date_of_birth}
                onChange={handleChange}
                required
                max={new Date().toISOString().split("T")[0]}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-gray-500 focus:border-gray-500 transition-colors text-sm"
              />
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
                  <span>Creating Account...</span>
                </>
              ) : (
                <span>Create Account</span>
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
              <a href="/salon-register" className="text-xs font-medium text-gray-900 hover:underline flex items-center">
                <span>Register your business</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterCustomerForm;
