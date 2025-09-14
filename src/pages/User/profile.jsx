import { useEffect, useState, useCallback } from 'react';
import { ProtectedAPI } from '../../utils/api';
import Header from './components/Header';
import Footer from "./components/Footer";
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

  // helper utilities to normalize display values for fields like date_of_birth and contact_number
  const isEmptyOrZeroDate = (val) => !val || val === '0000-00-00' || val === 'Not set yet';

  const formatDateForDisplay = (val) => {
    if (isEmptyOrZeroDate(val)) return 'Not set yet';
    try {
      const d = new Date(val);
      if (isNaN(d)) return 'Not set yet';
      return d.toISOString().split('T')[0];
    } catch (e) {
      return 'Not set yet';
    }
  };

  const formatPhoneForDisplay = (val) => {
    if (!val) return 'Not set yet';
    const digits = String(val).replace(/\D/g, '');
    if (digits.length !== 10) return 'Not set yet';
    return val;
  };

  const formatField = (fieldName) => {
    const value = userData?.customer?.[fieldName];
    if (fieldName === 'date_of_birth') return formatDateForDisplay(value);
    if (fieldName === 'contact_number') return formatPhoneForDisplay(value);
    return value || 'Not set yet';
  };

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
      date_of_birth: userData.customer.date_of_birth
        ? userData.customer.date_of_birth
        : "Not set yet",
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
    return (
      <div className="relative bg-gradient-to-br from-slate-50 via-purple-50 to-pink-50 min-h-screen">
        <Header />
        
        {/* Beautiful Loading Screen */}
        <div className="flex items-center justify-center min-h-[80vh] px-4">
          <div className="text-center">
            {/* Animated Profile Icon */}
            <div className="relative mb-8">
              <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-r from-purple-400 to-pink-400 p-1 animate-spin-slow">
                <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-r from-gray-100 to-gray-200 flex items-center justify-center animate-pulse">
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                </div>
              </div>
              
              {/* Floating dots */}
              <div className="absolute -top-2 -right-2 w-4 h-4 bg-purple-400 rounded-full animate-bounce" style={{animationDelay: '0s'}}></div>
              <div className="absolute -bottom-2 -left-2 w-3 h-3 bg-pink-400 rounded-full animate-bounce" style={{animationDelay: '0.5s'}}></div>
              <div className="absolute top-1/2 -left-6 w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{animationDelay: '1s'}}></div>
            </div>

            {/* Loading Text */}
            <div className="space-y-3">
              <h2 className="text-2xl font-bold text-gray-800 animate-fade-in">
                Loading Your Profile
              </h2>
              <p className="text-gray-600 animate-fade-in-delay">
                Fetching your personal information...
              </p>
            </div>

            {/* Progress Dots */}
            <div className="flex justify-center space-x-2 mt-8">
              <div className="w-3 h-3 bg-purple-400 rounded-full animate-bounce" style={{animationDelay: '0s'}}></div>
              <div className="w-3 h-3 bg-pink-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
              <div className="w-3 h-3 bg-blue-400 rounded-full animate-bounce" style={{animationDelay: '0.4s'}}></div>
            </div>

            {/* Skeleton Cards Preview */}
            <div className="max-w-md mx-auto mt-12 space-y-4">
              <div className="bg-white rounded-xl p-4 shadow-sm animate-pulse">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-xl p-4 shadow-sm animate-pulse" style={{animationDelay: '0.2s'}}>
                <div className="space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-full"></div>
                  <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                  <div className="h-4 bg-gray-200 rounded w-4/6"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Custom Styles */}
        <style jsx>{`
          @keyframes spin-slow {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          
          @keyframes fade-in {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
          
          @keyframes fade-in-delay {
            0% { opacity: 0; transform: translateY(10px); }
            50% { opacity: 0; transform: translateY(10px); }
            100% { opacity: 1; transform: translateY(0); }
          }
          
          .animate-spin-slow {
            animation: spin-slow 3s linear infinite;
          }
          
          .animate-fade-in {
            animation: fade-in 1s ease-out;
          }
          
          .animate-fade-in-delay {
            animation: fade-in-delay 2s ease-out;
          }
        `}</style>
      </div>
    );
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
                  { label: "Contact Number", value: formatField('contact_number') },
                  { label: "First Name", value: formatField('first_name') },
                  { label: "Last Name", value: formatField('last_name') },
                  { label: "Date of Birth", value: formatField('date_of_birth') },
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
                      value={
                        field.name === 'date_of_birth'
                          ? (isEmptyOrZeroDate(userData.customer.date_of_birth) ? '' : (userData.customer.date_of_birth ? new Date(userData.customer.date_of_birth).toISOString().split('T')[0] : ''))
                          : (field.value || '')
                      }
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

      <Footer />
    </div>
  );
};

export default UserProfile;
