import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

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
      latitude: '',
      longitude: '',
    },
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'latitude' || name === 'longitude') {
      setFormData((prev) => ({
        ...prev,
        location: {
          ...prev.location,
          [name]: parseFloat(value),
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
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
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-xl">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Register Your Salon</h2>
        <form className="grid gap-4" onSubmit={handleSubmit}>
          <input name="email" type="email" placeholder="Email" value={formData.email} onChange={handleChange} required className="input" />
          <input name="password" type="password" placeholder="Password" value={formData.password} onChange={handleChange} required className="input" />
          <input name="salon_name" placeholder="Salon Name" value={formData.salon_name} onChange={handleChange} required className="input" />
          <input name="contact_number" placeholder="Contact Number" value={formData.contact_number} onChange={handleChange} required className="input" />
          <input name="salon_address" placeholder="Address" value={formData.salon_address} onChange={handleChange} required className="input" />
          <input name="salon_description" placeholder="Description" value={formData.salon_description} onChange={handleChange} required className="input" />
          <input name="salon_logo_link" placeholder="Logo URL" value={formData.salon_logo_link} onChange={handleChange} required className="input" />
          <div className="grid grid-cols-2 gap-2">
            <input name="latitude" type="number" step="any" placeholder="Latitude" value={formData.location.latitude} onChange={handleChange} required className="input" />
            <input name="longitude" type="number" step="any" placeholder="Longitude" value={formData.location.longitude} onChange={handleChange} required className="input" />
          </div>

          <button type="submit" className="bg-indigo-600 text-white py-3 rounded-md hover:bg-indigo-700 transition" disabled={loading}>
            {loading ? 'Registering...' : 'Register'}
          </button>

          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        </form>
      </div>
    </div>
  );
};

export default RegisterSalon;
