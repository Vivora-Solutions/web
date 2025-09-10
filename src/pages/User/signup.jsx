import  { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Mail, Lock, User, Phone, Calendar, MapPin, Loader2, UserPlus, Sparkles } from 'lucide-react';
import Header from './components/Header';
import Footer from "./components/Footer";
import { PublicAPI } from "../../utils/api";

const LocationSelector = ({ setFormData }) => {
  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      setFormData(prev => ({
        ...prev,
        latitude: lat.toFixed(6),
        longitude: lng.toFixed(6),
      }));
    },
  });
  return null;
};

const RegisterCustomerForm = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirm_password: '',
    first_name: '',
    last_name: '',
    date_of_birth: '',
    latitude: '',
    longitude: '',
    contact_number: '',
  });

  const [loading, setLoading] = useState(false);
  const [responseMessage, setResponseMessage] = useState(null);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const validate = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Invalid email format.';
    }

    if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters.';
    if (formData.password !== formData.confirm_password) newErrors.confirm_password = 'Passwords do not match.';
    if (!formData.first_name.trim()) newErrors.first_name = 'First name is required.';
    if (!formData.last_name.trim()) newErrors.last_name = 'Last name is required.';
    if (!formData.date_of_birth) {
      newErrors.date_of_birth = 'Date of birth is required.';
    } else {
      const today = new Date().toISOString().split("T")[0];
      if (formData.date_of_birth > today) {
        newErrors.date_of_birth = 'Date of birth cannot be in the future.';
      }
    }
    const phoneRegex = /^\+?\d{7,15}$/; 
      if (!phoneRegex.test(formData.contact_number)) {
        newErrors.contact_number = 'Enter a valid phone number (7–15 digits, optional +).';
      }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    setResponseMessage(null);

    const payload = {
      email: formData.email,
      password: formData.password,
      first_name: formData.first_name,
      last_name: formData.last_name,
      date_of_birth: formData.date_of_birth,
      contact_number: formData.contact_number,
    };

    try {
      await PublicAPI.post('/auth/register-customer', payload);
      setResponseMessage('✅ Registration successful!');
      setTimeout(() => {
        navigate('/login', {
          state: { email: formData.email, password: formData.password },
        });
      }, 1200);
    } catch (error) {
      setResponseMessage(`❌ Error: ${error.response?.data?.error || error.message}`);
    } finally {
      setLoading(false);
    }
  };

    return (
      <div>
        <Header />
    <div className="min-h-screen bg-gray-50 py-6 sm:py-12 px-4">

      {/* Form Card */}
      <div className="max-w-4xl mx-auto">
        <div className="shadow-2xl border-0 bg-white/80 backdrop-blur-sm rounded-xl sm:rounded-3xl overflow-hidden">
          <div className="text-center py-4 sm:py-6 px-4 sm:px-8 border-b border-gray-200">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Create Your Customer Account</h2>
            <p className="text-gray-600 text-sm sm:text-base">Fill in your personal details to get started</p>
          </div>
          <div className="p-4 sm:p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Account Info */}
              <div className="space-y-4">
                <h3 className="text-base sm:text-lg font-semibold text-gray-800 flex items-center gap-2">
                <div className="w-5 h-5 sm:w-6 sm:h-6 bg-gray-900 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-bold">1</span>
                  </div>
                  Account Information
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="flex items-center gap-2 text-gray-600">
                      <Mail className="h-4 w-4" /> Email Address
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      placeholder="your@email.com"
                      className="h-10 sm:h-12 w-full rounded-md border border-gray-300 px-4 focus:outline-none focus:ring-2 focus:ring-red-400"
                    />
                    {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                  </div>
                  <div className="space-y-1">
                    <label className="flex items-center gap-2 text-gray-600">
                      <Lock className="h-4 w-4" /> Password
                    </label>
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      placeholder="••••••••"
                      className="h-10 sm:h-12 w-full rounded-md border border-gray-300 px-4 focus:outline-none focus:ring-2 focus:ring-red-400"
                    />
                    {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
                  </div>
                  <div className="space-y-1">
                    <label className="flex items-center gap-2 text-gray-600">
                      <Lock className="h-4 w-4" /> Confirm Password
                    </label>
                    <input
                      type="password"
                      name="confirm_password"
                      value={formData.confirm_password}
                      onChange={handleChange}
                      required
                      placeholder="••••••••"
                      className="h-10 sm:h-12 w-full rounded-md border border-gray-300 px-4 focus:outline-none focus:ring-2 focus:ring-red-400"
                    />
                    {errors.confirm_password && <p className="text-red-500 text-sm mt-1">{errors.confirm_password}</p>}
                  </div>
                </div>
              </div>

              {/* Personal Info */}
              <div className="space-y-4">
                <h3 className="text-base sm:text-lg font-semibold text-gray-800 flex items-center gap-2">
                 <div className="w-5 h-5 sm:w-6 sm:h-6 bg-gradient-to-r from-black to-black rounded-full flex items-center justify-center">

                    <span className="text-white text-xs font-bold">2</span>
                  </div>
                  Personal Information
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    name="first_name"
                    placeholder="First Name"
                    value={formData.first_name}
                    onChange={handleChange}
                    required
                    className="h-10 sm:h-12 w-full rounded-md border border-gray-300 px-4 focus:outline-none focus:ring-2 focus:ring-red-400"
                  />
                  <input
                    name="last_name"
                    placeholder="Last Name"
                    value={formData.last_name}
                    onChange={handleChange}
                    required
                    className="h-10 sm:h-12 w-full rounded-md border border-gray-300 px-4 focus:outline-none focus:ring-2 focus:ring-red-400"
                  />
                </div>
                {(errors.first_name || errors.last_name) && (
                  <p className="text-red-500 text-sm mt-1">{errors.first_name || errors.last_name}</p>
                )}

                <div className="space-y-1">
                  <label className="flex items-center gap-2 text-gray-600">
                    <Calendar className="h-4 w-4" /> Date of Birth
                  </label>
                  <input
                    type="date"
                    name="date_of_birth"
                    value={formData.date_of_birth}
                    onChange={handleChange}
                    required
                    max={new Date().toISOString().split("T")[0]} // restrict to today or earlier
                    className="h-10 sm:h-12 w-full rounded-md border border-gray-300 px-4 focus:outline-none focus:ring-2 focus:ring-red-400"
                  />
                  {errors.date_of_birth && (
                    <p className="text-red-500 text-sm mt-1">{errors.date_of_birth}</p>
                  )}
                </div>

              </div>


              {/* Contact Number */}
              <div className="space-y-1">
                <label className="flex items-center gap-2 text-gray-600">
                  <Phone className="h-4 w-4" /> Contact Number
                </label>
                <input
                  type="text"
                  name="contact_number"
                  placeholder="Contact Number"
                  value={formData.contact_number}
                  onChange={handleChange}
                  required
                  className="h-10 sm:h-12 w-full rounded-md border border-gray-300 px-4 focus:outline-none focus:ring-2 focus:ring-red-400"
                />
                {errors.contact_number && <p className="text-red-500 text-sm mt-1">{errors.contact_number}</p>}
              </div>

              {/* Submit Button */}
             <button
                type="submit"
                disabled={loading}
                className="w-full h-12 bg-gray-900 hover:bg-gray-800 text-white font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-200 rounded-md flex justify-center items-center"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Creating Your Account...
                  </>
                ) : (
                  <>
                    <UserPlus className="mr-2 h-5 w-5" />
                    Create Account
                  </>
                )}
              </button>

              {responseMessage && (
                <p className={`text-center text-base font-medium ${responseMessage.startsWith('✅') ? 'text-green-600' : 'text-gray-600'}`}>
                  {responseMessage}
                </p>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
    <Footer />
    </div>
  );
};

export default RegisterCustomerForm;