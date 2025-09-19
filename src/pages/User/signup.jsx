// import  { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
// import 'leaflet/dist/leaflet.css';
// import { Mail, Lock, User, Phone, Calendar, MapPin, Loader2, UserPlus, Sparkles, EyeOff, Eye } from 'lucide-react';
// import Header from './components/Header';
// import Footer from "./components/Footer";
// import { PublicAPI } from "../../utils/api";
// import logo from "../../assets/weblogo-white1.png";



// const RegisterCustomerForm = () => {
//   const [formData, setFormData] = useState({
//     email: '',
//     password: '',
//     confirm_password: '',
//     first_name: '',
//     last_name: '',
//     date_of_birth: '',
//     contact_number: '',
//   });

//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [showPassword, setShowPassword] = useState(false);
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false);
//   const navigate = useNavigate();

//   // Parse error response into structured format
//   const parseError = (error) => {
//     const errorMessage = error?.response?.data?.error || error?.message || "Unknown error occurred";
    
//     // Email validation errors
//     if (errorMessage.includes("invalid") && (errorMessage.includes("Email") || errorMessage.includes("email"))) {
//       return {
//         type: "validation",
//         title: "Invalid Email Address",
//         message: "Please enter a valid email address with correct format (e.g., example@domain.com)",
//         icon: "📧"
//       };
//     }
    
//     // Password validation errors
//     if (errorMessage.includes("password") && errorMessage.includes("weak")) {
//       return {
//         type: "validation",
//         title: "Weak Password",
//         message: "Password must be at least 8 characters long and contain letters and numbers.",
//         icon: "🔒"
//       };
//     }
    
//     // Required field errors
//     if (errorMessage.includes("required") || errorMessage.includes("cannot be empty")) {
//       return {
//         type: "validation",
//         title: "Missing Required Information",
//         message: "Please fill in all required fields before submitting.",
//         icon: "📝"
//       };
//     }
    
//     // Duplicate email errors
//     if (errorMessage.includes("duplicate key") && errorMessage.includes("user_email_key")) {
//       return {
//         type: "conflict",
//         title: "Email Already Registered",
//         message: "This email address is already registered. Please use a different email or try logging in.",
//         icon: "⚠️",
//         action: "Go to Login"
//       };
//     }
    
//     // Network/connection errors
//     if (error?.code === "NETWORK_ERROR" || errorMessage.includes("Network")) {
//       return {
//         type: "network",
//         title: "Connection Problem",
//         message: "Unable to connect to the server. Please check your internet connection and try again.",
//         icon: "🌐"
//       };
//     }
    
//     // Server errors
//     if (error?.response?.status >= 500) {
//       return {
//         type: "server",
//         title: "Server Error",
//         message: "Our servers are experiencing issues. Please try again in a few moments.",
//         icon: "🔧"
//       };
//     }
    
//     // Default error
//     return {
//       type: "general",
//       title: "Registration Failed",
//       message: "Something went wrong during registration. Please check your information and try again.",
//       icon: "❌"
//     };
//   };

//   // Client-side validation
//   const validateForm = () => {
//     // Email validation
//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     if (!emailRegex.test(formData.email)) {
//       return {
//         type: "validation",
//         title: "Invalid Email Format",
//         message: "Please enter a valid email address (e.g., yourname@domain.com)",
//         icon: "📧"
//       };
//     }
    
//     // Required fields validation
//     const requiredFields = [
//       { field: 'email', label: 'Email' },
//       { field: 'password', label: 'Password' },
//       { field: 'confirm_password', label: 'Confirm Password' },
//       { field: 'first_name', label: 'First Name' },
//       { field: 'last_name', label: 'Last Name' },
//       { field: 'date_of_birth', label: 'Date of Birth' },
//       { field: 'contact_number', label: 'Contact Number' }
//     ];
    
//     for (const { field, label } of requiredFields) {
//       if (!formData[field] || formData[field].trim() === '') {
//         return {
//           type: "validation",
//           title: "Missing Required Field",
//           message: `Please enter your ${label.toLowerCase()}.`,
//           icon: "📝"
//         };
//       }
//     }
    
//     // Password strength validation
//     if (formData.password.length < 6) {
//       return {
//         type: "validation",
//         title: "Password Too Short",
//         message: "Password must be at least 6 characters long.",
//         icon: "🔒"
//       };
//     }
    
//     // Password confirmation validation
//     if (formData.password !== formData.confirm_password) {
//       return {
//         type: "validation",
//         title: "Passwords Don't Match",
//         message: "Please make sure both password fields are identical.",
//         icon: "🔐"
//       };
//     }

//     // Contact number validation
//     const phoneRegex = /^\+?\d{7,15}$/;
//     if (!phoneRegex.test(formData.contact_number)) {
//       return {
//         type: "validation",
//         title: "Invalid Phone Number",
//         message: "Enter a valid phone number (7–15 digits, optional +).",
//         icon: "📱"
//       };
//     }

//     // Date of birth validation
//     if (formData.date_of_birth) {
//       const today = new Date().toISOString().split("T")[0];
//       if (formData.date_of_birth > today) {
//         return {
//           type: "validation",
//           title: "Invalid Date of Birth",
//           message: "Date of birth cannot be in the future.",
//           icon: "📅"
//         };
//       }
//     }
    
//     return null; // No validation errors
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError(null);
    
//     // Client-side validation
//     const validationError = validateForm();
//     if (validationError) {
//       setError(validationError);
//       return;
//     }
    
//     setLoading(true);

//     try {
//       const payload = {
//         email: formData.email,
//         password: formData.password,
//         first_name: formData.first_name,
//         last_name: formData.last_name,
//         date_of_birth: formData.date_of_birth,
//         contact_number: formData.contact_number,
//       };

//       await PublicAPI.post('/auth/register-customer', payload);
//       navigate('/login', {
//         state: { 
//           email: formData.email, 
//           password: formData.password,
//           message: "✅ Registration successful! Please log in."
//         },
//       });
//     } catch (err) {
//       console.error("Registration error:", err);
//       const parsedError = parseError(err);
//       setError(parsedError);
//     } finally {
//       setLoading(false);
//     }
//   };

//     return (
//       <div>
//         <Header />
//         <div className="min-h-screen bg-gray-50 py-6 px-4">
          
//           {/* Form Card */}
//           <div className="max-w-3xl mx-auto">
//             <div className="shadow-md border-0 bg-white rounded-lg overflow-hidden">
//               <div className="text-center py-4 px-4 sm:px-6">
//                 <img 
//                   src={logo} 
//                   alt="Logo" 
//                   className="mx-auto h-14 w-auto mb-3" 
//                 />
//                 <h2 className="text-xl font-bold text-gray-900 mb-1">Create Your Account</h2>
//                 <p className="text-gray-600 text-sm">Fill in your personal details to get started</p>
//               </div>
//               <div className="p-4 sm:p-6">
//                 <form onSubmit={handleSubmit} className="space-y-4">
//               {/* Account Info */}
//               <div className="space-y-4">
//                 <h3 className="text-sm font-semibold text-gray-800 flex items-center gap-2 mb-3">
//                   <div className="w-5 h-5 bg-gray-900 rounded-full flex items-center justify-center">
//                     <span className="text-white text-xs font-bold">1</span>
//                   </div>
//                   Account Information
//                 </h3>

//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
//                   <div className="space-y-1">
//                     <label className="flex items-center gap-1.5 text-gray-600 text-xs font-medium">
//                       <Mail className="h-3.5 w-3.5" /> Email Address
//                     </label>
//                     <input
//                       type="email"
//                       name="email"
//                       value={formData.email}
//                       onChange={handleChange}
//                       required
//                       placeholder="your@email.com"
//                       className="h-9 w-full rounded-md border border-gray-300 px-3 focus:outline-none focus:ring-1 focus:ring-gray-500 text-sm"
//                     />
//                   </div>
//                   <div className="space-y-1">
//                     <label className="flex items-center gap-2 text-gray-600">
//                       <Lock className="h-4 w-4" /> Password
//                     </label>
//                     <div className="relative">
//                       <input
//                         type={showPassword ? "text" : "password"}
//                         name="password"
//                         value={formData.password}
//                         onChange={handleChange}
//                         required
//                         placeholder="••••••••"
//                         className="h-10 sm:h-12 w-full rounded-md border border-gray-300 px-4 pr-12 focus:outline-none focus:ring-2 focus:ring-red-400"
//                       />
//                       <button
//                         type="button"
//                         onClick={() => setShowPassword(!showPassword)}
//                         className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
//                       >
//                         {showPassword ? (
//                           <EyeOff className="h-5 w-5" />
//                         ) : (
//                           <Eye className="h-5 w-5" />
//                         )}
//                       </button>
//                     </div>
//                   </div>
//                   <div className="space-y-1">
//                     <label className="flex items-center gap-2 text-gray-600">
//                       <Lock className="h-4 w-4" /> Confirm Password
//                     </label>
//                     <div className="relative">
//                       <input
//                         type={showConfirmPassword ? "text" : "password"}
//                         name="confirm_password"
//                         value={formData.confirm_password}
//                         onChange={handleChange}
//                         required
//                         placeholder="••••••••"
//                         className={`h-9 w-full rounded-md border px-3 pr-10 focus:outline-none focus:ring-1 focus:ring-gray-500 text-sm ${
//                           formData.confirm_password && formData.password !== formData.confirm_password
//                             ? 'border-red-300 focus:ring-red-400'
//                             : formData.confirm_password && formData.password === formData.confirm_password
//                             ? 'border-green-300 focus:ring-green-400'
//                             : 'border-gray-300'
//                         }`}
//                       />
//                       <button
//                         type="button"
//                         onClick={() => setShowConfirmPassword(!showConfirmPassword)}
//                         className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
//                       >
//                         {showConfirmPassword ? (
//                           <EyeOff className="h-4 w-4" />
//                         ) : (
//                           <Eye className="h-4 w-4" />
//                         )}
//                       </button>
//                     </div>
//                     {/* Password match indicator */}
//                     {formData.confirm_password && (
//                       <div className="flex items-center gap-1 text-xs mt-1">
//                         {formData.password === formData.confirm_password ? (
//                           <>
//                             <span className="text-green-600">✓</span>
//                             <span className="text-green-600">Passwords match</span>
//                           </>
//                         ) : (
//                           <>
//                             <span className="text-red-600">✗</span>
//                             <span className="text-red-600">Passwords don't match</span>
//                           </>
//                         )}
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               </div>

//               {/* Personal Info */}
//               <div className="space-y-4">
//                 <h3 className="text-sm font-semibold text-gray-800 flex items-center gap-2 mb-3">
//                  <div className="w-5 h-5 bg-gray-900 rounded-full flex items-center justify-center">
//                     <span className="text-white text-xs font-bold">2</span>
//                   </div>
//                   Personal Information
//                 </h3>

//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
//                   <div className="space-y-1">
//                     <label className="flex items-center gap-1.5 text-gray-600 text-xs font-medium">
//                       <User className="h-3.5 w-3.5" /> First Name
//                     </label>
//                     <input
//                       name="first_name"
//                       placeholder="First Name"
//                       value={formData.first_name}
//                       onChange={handleChange}
//                       required
//                       className="h-9 w-full rounded-md border border-gray-300 px-3 focus:outline-none focus:ring-1 focus:ring-gray-500 text-sm"
//                     />
//                   </div>
//                   <div className="space-y-1">
//                     <label className="flex items-center gap-1.5 text-gray-600 text-xs font-medium">
//                       <User className="h-3.5 w-3.5" /> Last Name
//                     </label>
//                     <input
//                       name="last_name"
//                       placeholder="Last Name"
//                       value={formData.last_name}
//                       onChange={handleChange}
//                       required
//                       className="h-9 w-full rounded-md border border-gray-300 px-3 focus:outline-none focus:ring-1 focus:ring-gray-500 text-sm"
//                     />
//                   </div>
//                 </div>

//                 <div className="space-y-1">
//                   <label className="flex items-center gap-1.5 text-gray-600 text-xs font-medium">
//                     <Calendar className="h-3.5 w-3.5" /> Date of Birth
//                   </label>
//                   <input
//                     type="date"
//                     name="date_of_birth"
//                     value={formData.date_of_birth}
//                     onChange={handleChange}
//                     required
//                     max={new Date().toISOString().split("T")[0]} // restrict to today or earlier
//                     className="h-9 w-full rounded-md border border-gray-300 px-3 focus:outline-none focus:ring-1 focus:ring-gray-500 text-sm"
//                   />
//                 </div>

//               </div>


//               {/* Contact Number */}
//               <div className="space-y-1">
//                 <label className="flex items-center gap-1.5 text-gray-600 text-xs font-medium">
//                   <Phone className="h-3.5 w-3.5" /> Contact Number
//                 </label>
//                 <input
//                   type="text"
//                   name="contact_number"
//                   placeholder="Contact Number"
//                   value={formData.contact_number}
//                   onChange={handleChange}
//                   required
//                   className="h-9 w-full rounded-md border border-gray-300 px-3 focus:outline-none focus:ring-1 focus:ring-gray-500 text-sm"
//                 />
//               </div>

//               {/* Error Display */}
//               {error && (
//                 <div className={`border p-3 rounded-md shadow-sm mb-4 ${
//                   error.type === 'validation' ? 'bg-orange-50 border-orange-200' :
//                   error.type === 'conflict' ? 'bg-yellow-50 border-yellow-200' :
//                   error.type === 'network' ? 'bg-blue-50 border-blue-200' :
//                   error.type === 'server' ? 'bg-purple-50 border-purple-200' :
//                   'bg-red-50 border-red-200'
//                 }`}>
//                   <div className="flex items-start space-x-2">
//                     <div className="text-xl flex-shrink-0 mt-0.5">
//                       {error.icon}
//                     </div>
//                     <div className="flex-1">
//                       <h4 className={`font-semibold text-xs mb-0.5 ${
//                         error.type === 'validation' ? 'text-orange-800' :
//                         error.type === 'conflict' ? 'text-yellow-800' :
//                         error.type === 'network' ? 'text-blue-800' :
//                         error.type === 'server' ? 'text-purple-800' :
//                         'text-red-800'
//                       }`}>
//                         {error.title}
//                       </h4>
//                       <p className={`text-xs ${
//                         error.type === 'validation' ? 'text-orange-600' :
//                         error.type === 'conflict' ? 'text-yellow-600' :
//                         error.type === 'network' ? 'text-blue-600' :
//                         error.type === 'server' ? 'text-purple-600' :
//                         'text-red-600'
//                       }`}>
//                         {error.message}
//                       </p>
//                       {error.action && (
//                         <button
//                           onClick={() => navigate('/login')}
//                           className={`mt-1 px-2 py-0.5 text-xs font-medium rounded transition-colors ${
//                             error.type === 'conflict' 
//                               ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
//                               : 'bg-blue-100 text-blue-800 hover:bg-blue-200'
//                           }`}
//                         >
//                           {error.action} →
//                         </button>
//                       )}
//                     </div>
//                   </div>
//                 </div>
//               )}

//               {/* Submit Button */}
//              <button
//                 type="submit"
//                 disabled={loading}
//                 className="w-full bg-gray-900 text-white py-2 px-4 rounded-md 
//                 hover:bg-gray-800 
//                 focus:ring-2 focus:ring-gray-800 focus:ring-offset-1
//                 transition-all duration-200 font-medium text-sm
//                 disabled:opacity-50 disabled:cursor-not-allowed 
//                 flex items-center justify-center space-x-2 mt-2"
//               >
//                 {loading ? (
//                   <>
//                     <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                     <span>Creating Account...</span>
//                   </>
//                 ) : (
//                   <>
//                     <UserPlus className="mr-2 h-4 w-4" />
//                     <span>Create Account</span>
//                   </>
//                 )}
//               </button>
//             </form>

//             <div className="mt-5">
//               <p className="text-center text-xs text-gray-600">
//                 Already have an account?{" "}
//                 <a href="/login" className="font-medium text-gray-900 hover:underline">
//                   Sign in here
//                 </a>
//               </p>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//     <Footer />
//     </div>
//   );
// };

// export default RegisterCustomerForm;



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
  EyeOff
} from "lucide-react";
import { PublicAPI } from "../../utils/api";

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

      alert("Registration successful! Redirecting to login...");
      navigate("/login", {
        state: {
          email: formData.email,
          password: formData.password,
        },
      });
    } catch (err) {
      console.error("Registration error:", err);
      const parsedError = parseError(err);
      setError(parsedError);
    } finally {
      setLoading(false);
    }
  };



  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 py-8 px-4">
      {/* Header */}
      <div className="max-w-4xl mx-auto mb-8 text-center">
        <div className="flex justify-center items-center gap-3 mb-4">
          <div className="p-3 bg-gradient-to-r from-gray-800 to-gray-600 rounded-full">
            <Scissors className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
            Register Your Customer Account
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
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        className="h-12 w-full rounded-md border px-4 pr-12 focus:ring-2 focus:ring-gray-400"
                        placeholder="Create a strong password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        {showPassword ? (
                          <EyeOff className="h-5 w-5" />
                        ) : (
                          <Eye className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-gray-600 text-sm font-medium">
                      <Lock className="h-4 w-4" /> Confirm Password
                    </label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        name="confirm_password"
                        value={formData.confirm_password}
                        onChange={handleChange}
                        required
                        className={`h-12 w-full rounded-md border px-4 pr-12 focus:ring-2 focus:ring-gray-400 ${
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
                          <EyeOff className="h-5 w-5" />
                        ) : (
                          <Eye className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                    {/* Password match indicator */}
                    {formData.confirm_password && (
                      <div className="flex items-center gap-1 text-xs">
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
                </div>
              </div>

              {/* Salon Info */}
              <div className="space-y-4">
                <h3 className="text-base md:text-lg font-semibold text-gray-800 flex items-center gap-2 pb-2 border-b border-gray-200">
                  <div className="w-6 h-6 bg-gray-700 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-bold">2</span>
                  </div>
                  User Information
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-gray-600 text-sm font-medium">
                      <Store className="h-4 w-4" /> First Name
                    </label>
                    <input
                      name="first_name"
                      value={formData.first_name}
                      onChange={handleChange}
                      required
                      className="h-12 w-full rounded-md border px-4 focus:ring-2 focus:ring-gray-400"
                      placeholder="Your First Name"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-gray-600 text-sm font-medium">
                      <Store className="h-4 w-4" /> Last Name
                    </label>
                    <input
                      name="last_name"
                      value={formData.last_name}
                      onChange={handleChange}
                      required
                      className="h-12 w-full rounded-md border px-4 focus:ring-2 focus:ring-gray-400"
                      placeholder="Your Last Name"
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
                <div className="space-y-1">
                  <label className="flex items-center gap-1.5 text-gray-600 text-xs font-medium">
                    <Calendar className="h-3.5 w-3.5" /> Date of Birth
                  </label>
                  <input
                    type="date"
                    name="date_of_birth"
                    value={formData.date_of_birth}
                    onChange={handleChange}
                    required
                    max={new Date().toISOString().split("T")[0]} // restrict to today or earlier
                    className="h-9 w-full rounded-md border border-gray-300 px-3 focus:outline-none focus:ring-1 focus:ring-gray-500 text-sm"
                  />
                </div>
              </div>

              {error && (
                <div className={`border p-4 rounded-xl shadow-sm ${
                  error.type === 'validation' ? 'bg-orange-50 border-orange-200' :
                  error.type === 'conflict' ? 'bg-yellow-50 border-yellow-200' :
                  error.type === 'network' ? 'bg-blue-50 border-blue-200' :
                  error.type === 'server' ? 'bg-purple-50 border-purple-200' :
                  'bg-red-50 border-red-200'
                }`}>
                  <div className="flex items-start space-x-3">
                    <div className="text-2xl flex-shrink-0 mt-0.5">
                      {error.icon}
                    </div>
                    <div className="flex-1">
                      <h4 className={`font-semibold text-sm mb-1 ${
                        error.type === 'validation' ? 'text-orange-800' :
                        error.type === 'conflict' ? 'text-yellow-800' :
                        error.type === 'network' ? 'text-blue-800' :
                        error.type === 'server' ? 'text-purple-800' :
                        'text-red-800'
                      }`}>
                        {error.title}
                      </h4>
                      <p className={`text-sm ${
                        error.type === 'validation' ? 'text-orange-600' :
                        error.type === 'conflict' ? 'text-yellow-600' :
                        error.type === 'network' ? 'text-blue-600' :
                        error.type === 'server' ? 'text-purple-600' :
                        'text-red-600'
                      }`}>
                        {error.message}
                      </p>
                      {error.action && (
                        <button
                          onClick={() => navigate('/login')}
                          className={`mt-2 px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                            error.type === 'conflict' 
                              ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                              : 'bg-blue-100 text-blue-800 hover:bg-blue-200'
                          }`}
                        >
                          {error.action} →
                        </button>
                      )}
                    </div>
                  </div>
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
                    <Store className="mr-2 h-5 w-5" /> Register My Account
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

export default RegisterCustomerForm;
