import React, { useEffect, useState } from 'react';
import { ProtectedAPI } from '../../utils/api';
import { parseWKBHexToLatLng } from "../../utils/wkbToLatLng";
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { Terminal } from 'lucide-react';  // Icon for messages
import Header from './components/Header';
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

  if (loading) {
  return (
    <div className="flex flex-col sm:flex-row justify-center items-center min-h-[calc(100vh-80px)] px-4 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="animate-spin rounded-full h-12 w-12 sm:h-16 sm:w-16 border-t-4 border-b-4 border-emerald-500 dark:border-emerald-400"></div>
      <p className="mt-4 sm:mt-0 sm:ml-4 text-base sm:text-lg text-gray-700 dark:text-gray-300">
        Loading profile...
      </p>
    </div>
  );
}

return (
  <div className="relative overflow-hidden bg-gradient-to-br from-[#fff9f9] via-[#fdfbfb] to-gray-200 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
    <Header />

    <div className="flex justify-center py-8 sm:py-12 px-4 sm:px-6 lg:px-8 min-h-screen">
      <div className="w-full max-w-4xl rounded-3xl shadow-2xl backdrop-blur-xl bg-white/80 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700 p-6 sm:p-8 space-y-6">
        <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-900 dark:text-gray-50">
          User Profile
        </h2>

        {message && (
          <div
            className={`flex items-center gap-3 p-4 rounded-lg text-sm sm:text-base ${
              message.includes("fail")
                ? "bg-red-100 text-red-800"
                : "bg-green-100 text-green-800"
            }`}
          >
            <Terminal className="w-5 h-5 flex-shrink-0" />
            <span>{message}</span>
          </div>
        )}

        {!editMode ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 text-gray-800 dark:text-gray-200">
              {[
                { label: "Email", value: userData.email },
                { label: "Contact Number", value: userData.customer.contact_number },
                { label: "First Name", value: userData.customer.first_name },
                { label: "Last Name", value: userData.customer.last_name },
                { label: "Date of Birth", value: userData.customer.date_of_birth },
              ].map((field, idx) => (
                <div key={idx}>
                  <p className="font-semibold text-sm sm:text-base">{field.label}:</p>
                  <p className="mt-1 bg-white/60 dark:bg-gray-700 px-3 py-2 rounded-lg shadow border border-gray-300 dark:border-gray-600 text-sm sm:text-base">
                    {field.value}
                  </p>
                </div>
              ))}
            </div>

            <div className="flex justify-end mt-6">
              <button
                onClick={() => setEditMode(true)}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-5 sm:px-6 py-2 sm:py-2.5 rounded-xl shadow-lg transition-transform transform hover:scale-105"
              >
                Edit Profile
              </button>
            </div>
          </>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              {[
                {
                  label: "Email",
                  value: userData.email,
                  name: "email",
                  readOnly: false,
                },
                {
                  label: "Contact Number",
                  value: userData.customer.contact_number,
                  name: "contact_number",
                  readOnly: false,
                  customerField: true,
                },
                {
                  label: "First Name",
                  value: userData.customer.first_name,
                  name: "first_name",
                  readOnly: false,
                  customerField: true,
                },
                {
                  label: "Last Name",
                  value: userData.customer.last_name,
                  readOnly: true,
                  customerField: true,
                },
                {
                  label: "Date of Birth",
                  value: userData.customer.date_of_birth,
                  readOnly: true,
                  type: "date",
                  customerField: true,
                },
              ].map((field, idx) => (
                <div className="space-y-2" key={idx}>
                  <label className="block font-medium text-gray-700 dark:text-gray-300 text-sm sm:text-base">
                    {field.label}
                  </label>
                  <input
                    type={field.type || "text"}
                    value={field.value}
                    onChange={
                      field.readOnly
                        ? undefined
                        : (e) =>
                            handleChange(
                              e,
                              field.name,
                              field.customerField || false
                            )
                    }
                    readOnly={field.readOnly}
                    className={`w-full border ${
                      field.readOnly
                        ? "border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400"
                        : "border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-50"
                    } p-3 rounded-xl shadow text-sm sm:text-base`}
                  />
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row justify-end gap-3 sm:gap-4">
              <button
                type="submit"
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-5 sm:px-6 py-2 sm:py-2.5 rounded-xl shadow-lg transition-transform hover:scale-105"
              >
                Save Changes
              </button>
              <button
                type="button"
                onClick={() => setEditMode(false)}
                className="border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 font-semibold px-5 sm:px-6 py-2 sm:py-2.5 rounded-xl shadow transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        {location && (
          <div className="mt-8 space-y-4">
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-gray-50">
              Your Location
            </h3>
            <div className="relative h-[250px] sm:h-[300px] w-full rounded-2xl overflow-hidden shadow-lg border border-gray-200 dark:border-gray-700">
              <MapContainer
                center={[location.lat, location.lng]}
                zoom={13}
                scrollWheelZoom={false}
                style={{ height: "100%", width: "100%" }}
              >
                <TileLayer
                  attribution='&copy; OpenStreetMap contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker
                  position={[location.lat, location.lng]}
                  icon={L.icon({
                    iconUrl:
                      "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
                    iconSize: [25, 41],
                    iconAnchor: [12, 41],
                  })}
                >
                  <Popup>
                    You are here <br />({location.lat.toFixed(5)},{" "}
                    {location.lng.toFixed(5)})
                  </Popup>
                </Marker>
              </MapContainer>
            </div>
          </div>
        )}
      </div>
    </div>
  </div>
);

};

export default UserProfile;
