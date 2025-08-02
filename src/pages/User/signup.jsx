import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Add this

const RegisterCustomerForm = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    first_name: '',
    last_name: '',
    date_of_birth: '',
    latitude: '',
    longitude: '',
    contact_number: '',
  });

  const [loading, setLoading] = useState(false);
  const [responseMessage, setResponseMessage] = useState(null);
  const navigate = useNavigate(); // Add this

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
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
      const response = await axios.post(
        'http://localhost:3000/api/auth/register-customer',
        payload
      );
      setResponseMessage('✅ Registration successful!');
      // Redirect to login with email and password
      setTimeout(() => {
        navigate('/login', {
          state: { email: formData.email, password: formData.password },
        });
      }, 1200);
    } catch (error) {
      setResponseMessage(
        `❌ Error: ${error.response?.data?.error || error.message}`
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 py-10 px-2">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
        <div className="flex flex-col items-center mb-6">
          <div className="bg-blue-100 rounded-full p-3 mb-2">
            <svg
              className="w-10 h-10 text-blue-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 7a4 4 0 01-8 0M12 14v7m-7-7a7 7 0 0114 0v7a2 2 0 01-2 2H7a2 2 0 01-2-2v-7z"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-1">
            Create Your Customer Account
          </h2>
          <p className="text-gray-500 text-center">
            Sign up to book appointments and enjoy exclusive salon offers.
          </p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            name="email"
            placeholder="Email"
            required
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-200 text-gray-700"
            value={formData.email}
            onChange={handleChange}
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            required
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-200 text-gray-700"
            value={formData.password}
            onChange={handleChange}
          />
          <div className="flex gap-3">
            <input
              type="text"
              name="first_name"
              placeholder="First Name"
              required
              className="w-1/2 px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-200 text-gray-700"
              value={formData.first_name}
              onChange={handleChange}
            />
            <input
              type="text"
              name="last_name"
              placeholder="Last Name"
              required
              className="w-1/2 px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-200 text-gray-700"
              value={formData.last_name}
              onChange={handleChange}
            />
          </div>
          <input
            type="date"
            name="date_of_birth"
            required
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-200 text-gray-700"
            value={formData.date_of_birth}
            onChange={handleChange}
          />
          <div className="flex gap-3">
            <input
              type="text"
              name="latitude"
              placeholder="Latitude"
              required
              className="w-1/2 px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-200 text-gray-700"
              value={formData.latitude}
              onChange={handleChange}
            />
            <input
              type="text"
              name="longitude"
              placeholder="Longitude"
              required
              className="w-1/2 px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-200 text-gray-700"
              value={formData.longitude}
              onChange={handleChange}
            />
          </div>
          <input
            type="text"
            name="contact_number"
            placeholder="Contact Number"
            required
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-200 text-gray-700"
            value={formData.contact_number}
            onChange={handleChange}
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 text-base bg-indigo-600 text-white rounded-lg shadow hover:bg-indigo-700 transition disabled:opacity-50"
          >
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>

        {responseMessage && (
          <p
            className={`mt-4 text-center text-base font-medium ${
              responseMessage.startsWith('✅')
                ? 'text-green-600'
                : 'text-red-600'
            }`}
          >
            {responseMessage}
          </p>
        )}
      </div>
    </div>
  );
};

export default RegisterCustomerForm;


