import { useState } from "react";
import { X, Phone } from "lucide-react";
import { ProtectedAPI } from "../utils/api";

const PhoneNumberModal = ({ isOpen, onClose, onSuccess }) => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Basic validation
    if (!phoneNumber.trim()) {
      setError("Phone number is required");
      return;
    }

    if (phoneNumber.trim().length < 10) {
      setError("Please enter a valid phone number");
      return;
    }

    setLoading(true);

    try {
      const response = await ProtectedAPI.put("/auth/update-phone", {
        phone_number: phoneNumber.trim(),
      });

      console.log("Phone updated successfully:", response.data);
      onSuccess(phoneNumber.trim());
      onClose();
    } catch (error) {
      console.error("Phone update error:", error);
      setError(error.response?.data?.error || "Failed to update phone number");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setPhoneNumber("");
      setError("");
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="bg-blue-100 p-2 rounded-full">
              <Phone className="w-5 h-5 text-blue-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">
              Add Phone Number
            </h2>
          </div>
          <button
            onClick={handleClose}
            disabled={loading}
            className="text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="mb-4">
            <p className="text-gray-600 mb-4">
              We need your phone number to complete your booking. This helps
              salons contact you if needed.
            </p>

            <label
              htmlFor="phone"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Phone Number
            </label>
            <input
              id="phone"
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="Enter your phone number"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              disabled={loading}
              required
            />
            {error && <p className="text-red-600 text-sm mt-2">{error}</p>}
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleClose}
              disabled={loading}
              className="flex-1 py-3 px-4 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !phoneNumber.trim()}
              className="flex-1 py-3 px-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Saving..." : "Save Phone Number"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PhoneNumberModal;
