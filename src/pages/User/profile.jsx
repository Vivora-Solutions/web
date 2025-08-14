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
    <div className="flex flex-col sm:flex-row justify-center items-center min-h-[calc(100vh-80px)] px-4 bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="animate-spin rounded-full h-12 w-12 sm:h-16 sm:w-16 border-t-4 border-b-4 border-emerald-500 dark:border-emerald-400"></div>
      <p className="mt-4 sm:mt-0 sm:ml-4 text-base sm:text-lg text-gray-700 dark:text-gray-300">
        Loading profile...
      </p>
    </div>
  );
}

 return (
    <div className="relative bg-white min-h-screen">
      <Header />

      <div className="flex justify-center py-6 sm:py-10 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-3xl rounded-2xl shadow-lg border border-gray-200 bg-white p-5 sm:p-8 space-y-6">
          <h2 className="text-xl sm:text-2xl font-bold text-center text-black">
            User Profile
          </h2>

          {message && (
            <div
              className={`flex items-center gap-3 p-3 rounded-lg text-sm ${
                message.includes("fail")
                  ? "bg-gray-100 text-gray-800 border border-gray-300"
                  : "bg-gray-50 text-gray-900 border border-gray-300"
              }`}
            >
              <Terminal className="w-5 h-5 flex-shrink-0" />
              <span>{message}</span>
            </div>
          )}

          {!editMode ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-800">
                {[
                  { label: "Email", value: userData.email },
                  { label: "Contact Number", value: userData.customer.contact_number },
                  { label: "First Name", value: userData.customer.first_name },
                  { label: "Last Name", value: userData.customer.last_name },
                  { label: "Date of Birth", value: userData.customer.date_of_birth },
                ].map((field, idx) => (
                  <div key={idx}>
                    <p className="font-semibold text-sm">{field.label}:</p>
                    <p className="mt-1 bg-gray-50 px-3 py-2 rounded-lg border border-gray-200 text-sm">
                      {field.value}
                    </p>
                  </div>
                ))}
              </div>

              <div className="flex justify-end mt-4">
                <button
                  onClick={() => setEditMode(true)}
                  className="bg-black hover:bg-gray-800 text-white font-semibold px-4 py-2 rounded-lg text-sm transition"
                >
                  Edit Profile
                </button>
              </div>
            </>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { label: "Email", value: userData.email, name: "email", readOnly: false },
                  { label: "Contact Number", value: userData.customer.contact_number, name: "contact_number", readOnly: false, customerField: true },
                  { label: "First Name", value: userData.customer.first_name, name: "first_name", readOnly: false, customerField: true },
                  { label: "Last Name", value: userData.customer.last_name, readOnly: true, customerField: true },
                  { label: "Date of Birth", value: userData.customer.date_of_birth, readOnly: true, type: "date", customerField: true },
                ].map((field, idx) => (
                  <div className="space-y-1" key={idx}>
                    <label className="block font-medium text-gray-700 text-sm">
                      {field.label}
                    </label>
                    <input
                      type={field.type || "text"}
                      value={field.value}
                      onChange={
                        field.readOnly
                          ? undefined
                          : (e) =>
                              handleChange(e, field.name, field.customerField || false)
                      }
                      readOnly={field.readOnly}
                      className={`w-full border rounded-lg px-3 py-2 text-sm ${
                        field.readOnly
                          ? "bg-gray-100 border-gray-200 text-gray-500"
                          : "bg-white border-gray-300 text-black"
                      }`}
                    />
                  </div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row justify-end gap-3">
                <button
                  type="submit"
                  className="bg-black hover:bg-gray-800 text-white font-semibold px-4 py-2 rounded-lg text-sm"
                >
                  Save Changes
                </button>
                <button
                  type="button"
                  onClick={() => setEditMode(false)}
                  className="border border-gray-300 text-gray-700 hover:bg-gray-100 font-semibold px-4 py-2 rounded-lg text-sm"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}

          {location && (
            <div className="mt-6 space-y-3">
              <h3 className="text-lg font-semibold text-black">
                Your Location
              </h3>
              <div className="relative h-[220px] sm:h-[280px] w-full rounded-lg overflow-hidden border border-gray-200">
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
