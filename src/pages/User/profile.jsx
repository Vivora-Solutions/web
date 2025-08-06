import React, { useEffect, useState } from 'react';
import { ProtectedAPI } from '../../utils/api';
import { parseWKBHexToLatLng } from "../../utils/wkbToLatLng";
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { Terminal } from 'lucide-react';  // Icon for messages

const UserProfile = () => {
  const [userData, setUserData] = useState({
    email: '',
    customer: {
      first_name: '',
      last_name: '',
      date_of_birth: '',
      contact_number: '',
      location: '',
    },
  });

  const [location, setLocation] = useState(null);
  const [message, setMessage] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await ProtectedAPI.get('/profile');
        setUserData(res.data);
        if (res.data.customer?.location) {
          const coords = parseWKBHexToLatLng(res.data.customer.location);
          setLocation(coords);
        }
        setLoading(false);
      } catch (err) {
        console.error('Failed to fetch user profile:', err);
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleChange = (e, field, isCustomer = false) => {
    const value = e.target.value;
    if (isCustomer) {
      setUserData((prev) => ({
        ...prev,
        customer: {
          ...prev.customer,
          [field]: value,
        },
      }));
    } else {
      setUserData((prev) => ({
        ...prev,
        [field]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        userData: { email: userData.email },
        customerData: {
          first_name: userData.customer.first_name,
          contact_number: userData.customer.contact_number,
        },
      };
      const res = await ProtectedAPI.put('/profile', payload);
      setMessage(res.data.message || 'Updated successfully');
      setEditMode(false);
    } catch (err) {
      console.error('Update failed:', err);
      setMessage('Update failed');
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center min-h-[calc(100vh-80px)] bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-emerald-500 dark:border-emerald-400"></div>
      <p className="ml-4 text-lg text-gray-700 dark:text-gray-300">Loading profile...</p>
    </div>
  );

  return (
    <div className="flex justify-center py-12 px-4 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 min-h-screen">
      <div className="w-full max-w-4xl rounded-3xl shadow-2xl backdrop-blur-xl bg-white/70 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700 p-8 space-y-6">
        <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-gray-50">User Profile</h2>

        {message && (
          <div className={`flex items-center gap-3 p-4 rounded-lg ${message.includes('fail') ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
            <Terminal className="w-5 h-5" />
            <span>{message}</span>
          </div>
        )}

        {!editMode ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-800 dark:text-gray-200">
              <div>
                <p className="font-semibold">Email:</p>
                <p className="bg-white/50 dark:bg-gray-700 px-3 py-2 rounded-lg shadow border border-gray-300 dark:border-gray-600">{userData.email}</p>
              </div>
              <div>
                <p className="font-semibold">Contact Number:</p>
                <p className="bg-white/50 dark:bg-gray-700 px-3 py-2 rounded-lg shadow border border-gray-300 dark:border-gray-600">{userData.customer.contact_number}</p>
              </div>
              <div>
                <p className="font-semibold">First Name:</p>
                <p className="bg-white/50 dark:bg-gray-700 px-3 py-2 rounded-lg shadow border border-gray-300 dark:border-gray-600">{userData.customer.first_name}</p>
              </div>
              <div>
                <p className="font-semibold">Last Name:</p>
                <p className="bg-white/50 dark:bg-gray-700 px-3 py-2 rounded-lg shadow border border-gray-300 dark:border-gray-600">{userData.customer.last_name}</p>
              </div>
              <div>
                <p className="font-semibold">Date of Birth:</p>
                <p className="bg-white/50 dark:bg-gray-700 px-3 py-2 rounded-lg shadow border border-gray-300 dark:border-gray-600">{userData.customer.date_of_birth}</p>
              </div>
            </div>

            <div className="flex justify-end mt-6">
              <button
                onClick={() => setEditMode(true)}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-6 py-2 rounded-xl shadow-lg"
              >
                Edit Profile
              </button>
            </div>
          </>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block font-medium text-gray-700 dark:text-gray-300">Email</label>
                <input
                  type="email"
                  value={userData.email}
                  onChange={(e) => handleChange(e, 'email')}
                  className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-50 p-3 rounded-xl shadow"
                />
              </div>
              <div className="space-y-2">
                <label className="block font-medium text-gray-700 dark:text-gray-300">Contact Number</label>
                <input
                  type="text"
                  value={userData.customer.contact_number}
                  onChange={(e) => handleChange(e, 'contact_number', true)}
                  className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-50 p-3 rounded-xl shadow"
                />
              </div>
              <div className="space-y-2">
                <label className="block font-medium text-gray-700 dark:text-gray-300">First Name</label>
                <input
                  type="text"
                  value={userData.customer.first_name}
                  onChange={(e) => handleChange(e, 'first_name', true)}
                  className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-50 p-3 rounded-xl shadow"
                />
              </div>
              <div className="space-y-2">
                <label className="block font-medium text-gray-700 dark:text-gray-300">Last Name</label>
                <input
                  type="text"
                  value={userData.customer.last_name}
                  readOnly
                  className="w-full border border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 p-3 rounded-xl shadow"
                />
              </div>
              <div className="space-y-2">
                <label className="block font-medium text-gray-700 dark:text-gray-300">Date of Birth</label>
                <input
                  type="date"
                  value={userData.customer.date_of_birth}
                  readOnly
                  className="w-full border border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 p-3 rounded-xl shadow"
                />
              </div>
            </div>

            <div className="flex justify-end gap-4">
              <button
                type="submit"
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-6 py-2 rounded-xl shadow-lg"
              >
                Save Changes
              </button>
              <button
                type="button"
                onClick={() => setEditMode(false)}
                className="border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 font-semibold px-6 py-2 rounded-xl shadow"
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        {location && (
          <div className="mt-8 space-y-4">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-50">Your Location</h3>
            <div className="relative h-[300px] w-full rounded-2xl overflow-hidden shadow-lg border border-gray-200 dark:border-gray-700">
              <MapContainer
                center={[location.lat, location.lng]}
                zoom={13}
                scrollWheelZoom={false}
                style={{ height: '100%', width: '100%' }}
              >
                <TileLayer
                  attribution='&copy; OpenStreetMap contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker
                  position={[location.lat, location.lng]}
                  icon={L.icon({
                    iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
                    iconSize: [25, 41],
                    iconAnchor: [12, 41],
                  })}
                >
                  <Popup>
                    You are here <br /> ({location.lat.toFixed(5)}, {location.lng.toFixed(5)})
                  </Popup>
                </Marker>
              </MapContainer>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfile;
