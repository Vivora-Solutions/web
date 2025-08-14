import { useEffect, useState, useCallback } from 'react';
import { ProtectedAPI } from '../../utils/api';
import Header from './components/Header';
import toast from 'react-hot-toast';

const UserProfile = () => {
  const [userData, setUserData] = useState({
    customer: {
      first_name: '',
      last_name: '',
      date_of_birth: '',
      contact_number: '',
      location: '',
    },
  });
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showPopup, setShowPopup] = useState(false);

  const fetchUserData = useCallback(async () => {
    try {
      const res = await ProtectedAPI.get('/profile');
      setUserData(res.data);
    } catch (err) {
      console.error('Failed to fetch user profile:', err);
      toast.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

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

  const validateFields = () => {
    const { contact_number, date_of_birth } = userData.customer;

    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(contact_number)) {
      toast.error('Please enter a valid 10-digit contact number');
      return false;
    }

    if (!date_of_birth) {
      toast.error('Please select your date of birth');
      return false;
    }
    const dob = new Date(date_of_birth);
    if (dob > new Date()) {
      toast.error('Date of birth cannot be in the future');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateFields()) return;

    try {
      const payload = {
        userData: { email: userData.email },
        customerData: {
          first_name: userData.customer.first_name,
          last_name: userData.customer.last_name,
          contact_number: userData.customer.contact_number,
          date_of_birth: userData.customer.date_of_birth,
        },
      };
      await ProtectedAPI.put('/profile', payload);

      setShowPopup(true);
      await fetchUserData();
      setEditMode(false);
    } catch (err) {
      console.error('Update failed:', err);
      toast.error('Failed to update profile');
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="relative bg-white min-h-screen">
      <Header />

      {/* Popup Modal with blur */}
      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm bg-white/30 z-50">
          <div className="bg-white rounded-xl shadow-xl p-6 max-w-sm w-full text-center">
            <h3 className="text-lg font-bold mb-2">Profile Updated!</h3>
            <p className="text-gray-600">Your profile has been updated successfully.</p>
            <button
              onClick={() => setShowPopup(false)}
              className="mt-4 bg-black text-white px-5 py-2 rounded-lg hover:bg-gray-800 transition"
            >
              OK
            </button>
          </div>
        </div>
      )}

      <div className="flex justify-center py-6 sm:py-10 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-3xl rounded-2xl shadow-lg border border-gray-200 bg-white p-5 sm:p-8 space-y-6">
          <h2 className="text-xl sm:text-2xl font-bold text-center text-black">
            User Profile
          </h2>

          {!editMode ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-800">
                {[
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
                  { label: "Contact Number", value: userData.customer.contact_number, name: "contact_number", type: "text", customerField: true },
                  { label: "First Name", value: userData.customer.first_name, name: "first_name", type: "text", customerField: true },
                  { label: "Last Name", value: userData.customer.last_name, name: "last_name", type: "text", customerField: true },
                  { label: "Date of Birth", value: userData.customer.date_of_birth, name: "date_of_birth", type: "date", customerField: true },
                ].map((field, idx) => (
                  <div className="space-y-1" key={idx}>
                    <label className="block font-medium text-gray-700 text-sm">
                      {field.label}
                    </label>
                    <input
                      type={field.type}
                      value={field.value || ''}
                      onChange={(e) =>
                        handleChange(e, field.name, field.customerField || false)
                      }
                      className="w-full border rounded-lg px-3 py-2 text-sm bg-white border-gray-300 text-black"
                      max={field.name === "date_of_birth" ? new Date().toISOString().split("T")[0] : undefined}
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
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
