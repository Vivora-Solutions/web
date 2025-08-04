import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Mail, Lock, Store, Phone, MapPin, FileText, ImageIcon, Loader2, Scissors, Sparkles } from 'lucide-react';

// Fix icon not showing
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const LocationPicker = ({ setFormData }) => {
  useMapEvents({
    click(e) {
      setFormData((prev) => ({
        ...prev,
        location: {
          latitude: e.latlng.lat,
          longitude: e.latlng.lng,
        },
      }));
    },
  });
  return null;
};

const RegisterSalon = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    salon_name: '',
    contact_number: '',
    salon_address: '',
    salon_description: '',
    salon_logo_link: '',
    location: {
      latitude: 7.8731,
      longitude: 80.7718,
    },
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await axios.post(
        'http://localhost:3000/api/auth/register-salon',
        formData
      );

      alert('Registration successful! Redirecting to login...');
      navigate('/login', {
        state: {
          email: formData.email,
          password: formData.password,
        },
      });
    } catch (err) {
      console.error(err);
      setError(err?.response?.data?.error || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 py-12 px-4">
      {/* Header */}
      <div className="max-w-4xl mx-auto mb-8">
        <div className="text-center mb-8">
          <div className="flex justify-center items-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full">
              <Scissors className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
              Register Your Salon
            </h1>
            <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full">
              <Sparkles className="h-8 w-8 text-white" />
            </div>
          </div>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Join our platform and showcase your salon to thousands of potential customers. Create your professional
            profile in just a few minutes.
          </p>
        </div>
      </div>

      {/* Form Card */}
      <div className="max-w-4xl mx-auto">
        <div className="shadow-2xl border-0 bg-white/80 backdrop-blur-sm rounded-3xl overflow-hidden">
          <div className="text-center py-6 px-8 border-b">
            <h2 className="text-2xl font-bold text-gray-800">Create Your Account</h2>
            <p className="text-gray-600">Fill in your salon details to get started</p>
          </div>
          <div className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Account Info */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                  <div className="w-6 h-6 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-bold">1</span>
                  </div>
                  Account Information
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-gray-600">
                      <Mail className="h-4 w-4" />
                      Email Address
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      placeholder="your@email.com"
                      className="h-12 w-full rounded-md border px-4 focus:outline-none focus:ring-2 focus:ring-pink-400"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-gray-600">
                      <Lock className="h-4 w-4" />
                      Password
                    </label>
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      placeholder="••••••••"
                      className="h-12 w-full rounded-md border px-4 focus:outline-none focus:ring-2 focus:ring-pink-400"
                    />
                  </div>
                </div>
              </div>

              {/* Salon Info */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                  <div className="w-6 h-6 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-bold">2</span>
                  </div>
                  Salon Information
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input name="salon_name" placeholder="Salon Name" value={formData.salon_name} onChange={handleChange} required className="h-12 w-full rounded-md border px-4 focus:outline-none focus:ring-2 focus:ring-pink-400" />
                  <input name="contact_number" placeholder="Contact Number" value={formData.contact_number} onChange={handleChange} required className="h-12 w-full rounded-md border px-4 focus:outline-none focus:ring-2 focus:ring-pink-400" />
                  <input name="salon_address" placeholder="Address" value={formData.salon_address} onChange={handleChange} required className="h-12 w-full rounded-md border px-4 focus:outline-none focus:ring-2 focus:ring-pink-400" />
                  <input name="salon_logo_link" placeholder="Logo URL" value={formData.salon_logo_link} onChange={handleChange} required className="h-12 w-full rounded-md border px-4 focus:outline-none focus:ring-2 focus:ring-pink-400" />
                </div>

                <textarea
                  name="salon_description"
                  placeholder="Describe your salon, services, and what makes you special..."
                  value={formData.salon_description}
                  onChange={handleChange}
                  required
                  className="min-h-[100px] w-full rounded-md border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-pink-400 resize-none"
                />
              </div>

              {/* Location Picker */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                  <div className="w-6 h-6 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-bold">3</span>
                  </div>
                  Location
                </h3>

                <div className="h-64 rounded-xl overflow-hidden border-2 border-gray-200 shadow-lg">
                  <MapContainer
                    center={[formData.location.latitude, formData.location.longitude]}
                    zoom={7}
                    className="h-full w-full"
                  >
                    <TileLayer
                      attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a>'
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <LocationPicker setFormData={setFormData} />
                    <Marker position={[formData.location.latitude, formData.location.longitude]} />
                  </MapContainer>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 mb-2">
                    <MapPin className="h-4 w-4 inline mr-1" />
                    Click on the map to set your salon's exact location.
                  </p>
                  <p className="text-sm font-medium text-gray-800">
                    Selected coordinates: ({formData.location.latitude.toFixed(4)}, {formData.location.longitude.toFixed(4)})
                  </p>
                </div>
              </div>

              {error && <p className="text-red-500 text-sm">{error}</p>}

              <button
                type="submit"
                disabled={loading}
                className="w-full h-12 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-200 rounded-md flex justify-center items-center"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Registering Your Salon...
                  </>
                ) : (
                  <>
                    <Store className="mr-2 h-5 w-5" />
                    Register My Salon
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="max-w-2xl mx-auto mt-8 text-center">
        <p className="text-gray-500 text-sm">
          Already have an account?{' '}
          <button
            onClick={() => navigate('/login')}
            className="text-purple-600 hover:text-purple-700 font-medium underline"
          >
            Sign in here
          </button>
        </p>
      </div>
    </div>
  );
};

export default RegisterSalon;
