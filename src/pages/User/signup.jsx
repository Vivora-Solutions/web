import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Mail, Lock, User, Phone, Calendar, MapPin, Loader2, UserPlus, Sparkles } from 'lucide-react';
import { PublicAPI } from '../../utils/api';

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

    if (!emailRegex.test(formData.email)) newErrors.email = 'Invalid email format.';
    if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters.';
    if (formData.password !== formData.confirm_password) newErrors.confirm_password = 'Passwords do not match.';
    if (!formData.first_name.trim()) newErrors.first_name = 'First name is required.';
    if (!formData.last_name.trim()) newErrors.last_name = 'Last name is required.';
    if (!formData.date_of_birth) newErrors.date_of_birth = 'Date of birth is required.';
    if (!formData.latitude || !formData.longitude) newErrors.location = 'Select a location from the map.';
    if (!formData.contact_number.trim()) newErrors.contact_number = 'Contact number is required.';

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
      location: {
        latitude: parseFloat(formData.latitude),
        longitude: parseFloat(formData.longitude),
      },
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-100 py-12 px-4">
      {/* Header */}
      <div className="max-w-4xl mx-auto mb-8">
        <div className="text-center mb-8">
          <div className="flex justify-center items-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full">
              <UserPlus className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Register as a Customer
            </h1>
            <div className="p-3 bg-gradient-to-r from-indigo-500 to-blue-600 rounded-full">
              <Sparkles className="h-8 w-8 text-white" />
            </div>
          </div>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Join our community and start booking appointments at your favorite salons.
          </p>
        </div>
      </div>

      {/* Form Card */}
      <div className="max-w-4xl mx-auto">
        <div className="shadow-2xl border-0 bg-white/80 backdrop-blur-sm rounded-3xl overflow-hidden">
          <div className="text-center py-6 px-8 border-b">
            <h2 className="text-2xl font-bold text-gray-800">Create Your Customer Account</h2>
            <p className="text-gray-600">Fill in your personal details to get started</p>
          </div>
          <div className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Account Info */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                  <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-bold">1</span>
                  </div>
                  Account Information
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="flex items-center gap-2 text-gray-600 mb-1">
                      <Mail className="h-4 w-4" /> Email Address
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      placeholder="your@email.com"
                      className="h-12 w-full rounded-md border px-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                    {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                  </div>
                  <div>
                    <label className="flex items-center gap-2 text-gray-600 mb-1">
                      <Lock className="h-4 w-4" /> Password
                    </label>
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      placeholder="••••••••"
                      className="h-12 w-full rounded-md border px-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                    {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
                  </div>
                  <div>
                    <label className="flex items-center gap-2 text-gray-600 mb-1">
                      <Lock className="h-4 w-4" /> Confirm Password
                    </label>
                    <input
                      type="password"
                      name="confirm_password"
                      value={formData.confirm_password}
                      onChange={handleChange}
                      required
                      placeholder="••••••••"
                      className="h-12 w-full rounded-md border px-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                    {errors.confirm_password && <p className="text-red-500 text-sm mt-1">{errors.confirm_password}</p>}
                  </div>
                </div>
              </div>

              {/* Personal Info */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                  <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-bold">2</span>
                  </div>
                  Personal Information
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input name="first_name" placeholder="First Name" value={formData.first_name} onChange={handleChange}
                    required className="h-12 w-full rounded-md border px-4 focus:outline-none focus:ring-2 focus:ring-blue-400" />
                  <input name="last_name" placeholder="Last Name" value={formData.last_name} onChange={handleChange}
                    required className="h-12 w-full rounded-md border px-4 focus:outline-none focus:ring-2 focus:ring-blue-400" />
                </div>
                {(errors.first_name || errors.last_name) && (
                  <p className="text-red-500 text-sm">{errors.first_name || errors.last_name}</p>
                )}

                <div>
                  <label className="flex items-center gap-2 text-gray-600 mb-1">
                    <Calendar className="h-4 w-4" /> Date of Birth
                  </label>
                  <input type="date" name="date_of_birth" value={formData.date_of_birth} onChange={handleChange}
                    required className="h-12 w-full rounded-md border px-4 focus:outline-none focus:ring-2 focus:ring-blue-400" />
                  {errors.date_of_birth && <p className="text-red-500 text-sm">{errors.date_of_birth}</p>}
                </div>
              </div>

              {/* Location Picker */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                  <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-bold">3</span>
                  </div>
                  Location
                </h3>
                <div className="h-64 rounded-xl overflow-hidden border-2 border-gray-200 shadow-lg">
                  <MapContainer
                    center={[7.8731, 80.7718]}
                    zoom={7}
                    scrollWheelZoom={false}
                    className="h-full w-full"
                  >
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                    <LocationSelector setFormData={setFormData} />
                    {formData.latitude && formData.longitude && (
                      <Marker position={[formData.latitude, formData.longitude]} />
                    )}
                  </MapContainer>
                </div>
                {errors.location && <p className="text-red-500 text-sm">{errors.location}</p>}
              </div>

              {/* Contact Number */}
              <div>
                <label className="flex items-center gap-2 text-gray-600 mb-1">
                  <Phone className="h-4 w-4" /> Contact Number
                </label>
                <input type="text" name="contact_number" placeholder="Contact Number" value={formData.contact_number} onChange={handleChange}
                  required className="h-12 w-full rounded-md border px-4 focus:outline-none focus:ring-2 focus:ring-blue-400" />
                {errors.contact_number && <p className="text-red-500 text-sm">{errors.contact_number}</p>}
              </div>

              {/* Submit Button */}
              <button type="submit" disabled={loading}
                className="w-full h-12 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-200 rounded-md flex justify-center items-center">
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
                <p className={`text-center text-base font-medium ${responseMessage.startsWith('✅') ? 'text-green-600' : 'text-red-600'}`}>
                  {responseMessage}
                </p>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterCustomerForm;
