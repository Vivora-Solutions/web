import React, { useState } from 'react';
import axios from 'axios';

const SalonRegister = () => {
  const [form, setForm] = useState({
    salon_name: '',
    contact_number: '',
    email: '',
    password: '',
    confirmPassword: '',
    salon_address: '',
    salon_description: '',
    salon_logo_link: '',
    location: {
      latitude: '',
      longitude: '',
    },
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'latitude' || name === 'longitude') {
      setForm((prev) => ({
        ...prev,
        location: {
          ...prev.location,
          [name]: value,
        },
      }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!form.salon_name.trim()) newErrors.salon_name = 'Salon name is required';
    if (!form.contact_number.match(/^07\d{8}$/)) newErrors.contact_number = 'Invalid contact number';
    if (!form.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) newErrors.email = 'Invalid email';
    if (!form.password.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/)) {
      newErrors.password = 'Password must contain uppercase, lowercase, and number';
    }
    if (form.password !== form.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    if (!form.salon_address.trim()) newErrors.salon_address = 'Address is required';
    if (!form.salon_description.trim()) newErrors.salon_description = 'Description is required';
    if (!form.salon_logo_link.trim()) newErrors.salon_logo_link = 'Logo URL is required';
    if (!form.location.latitude || !form.location.longitude)
      newErrors.location = 'Location is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const payload = {
        email: form.email,
        password: form.password,
        salon_name: form.salon_name,
        contact_number: form.contact_number,
        salon_address: form.salon_address,
        salon_description: form.salon_description,
        salon_logo_link: form.salon_logo_link,
        location: {
          latitude: parseFloat(form.location.latitude),
          longitude: parseFloat(form.location.longitude),
        },
      };

      const res = await axios.post('http://localhost:3000/api/auth/register-salon', payload);
      alert('Salon registered successfully!');
      console.log(res.data);
    } catch (error) {
      alert('Registration failed');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white w-full max-w-md p-6 rounded shadow-md space-y-4"
      >
        <h2 className="text-2xl font-semibold">Sign Up</h2>
        <p className="text-gray-500">Create an account to continue with your booking</p>

        {/* Salon Name */}
        <div>
          <input
            type="text"
            name="salon_name"
            placeholder="Salon Name"
            value={form.salon_name}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded bg-gray-100"
          />
          {errors.salon_name && <p className="text-red-500 text-sm">{errors.salon_name}</p>}
        </div>

        {/* Contact Number */}
        <div>
          <input
            type="text"
            name="contact_number"
            placeholder="Contact Number"
            value={form.contact_number}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded bg-gray-100"
          />
          {errors.contact_number && (
            <p className="text-red-500 text-sm">{errors.contact_number}</p>
          )}
        </div>

        {/* Email */}
        <div>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded bg-gray-100"
          />
          {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
        </div>

        {/* Password */}
        <div>
          <input
            type="password"
            name="password"
            placeholder="Set Password"
            value={form.password}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded bg-gray-100"
          />
          {errors.password && (
            <p className="text-red-500 text-sm">{errors.password}</p>
          )}
        </div>

        {/* Confirm Password */}
        <div>
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={form.confirmPassword}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded bg-gray-100"
          />
          {errors.confirmPassword && (
            <p className="text-red-500 text-sm">{errors.confirmPassword}</p>
          )}
        </div>

        {/* Address */}
        <div>
          <input
            type="text"
            name="salon_address"
            placeholder="Salon Address"
            value={form.salon_address}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded bg-gray-100"
          />
          {errors.salon_address && <p className="text-red-500 text-sm">{errors.salon_address}</p>}
        </div>

        {/* Description */}
        <div>
          <input
            type="text"
            name="salon_description"
            placeholder="Salon Description"
            value={form.salon_description}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded bg-gray-100"
          />
          {errors.salon_description && (
            <p className="text-red-500 text-sm">{errors.salon_description}</p>
          )}
        </div>

        {/* Logo URL */}
        <div>
          <input
            type="text"
            name="salon_logo_link"
            placeholder="Logo Image Link"
            value={form.salon_logo_link}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded bg-gray-100"
          />
          {errors.salon_logo_link && (
            <p className="text-red-500 text-sm">{errors.salon_logo_link}</p>
          )}
        </div>

        {/* Latitude */}
        <div>
          <input
            type="text"
            name="latitude"
            placeholder="Latitude"
            value={form.location.latitude}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded bg-gray-100"
          />
        </div>

        {/* Longitude */}
        <div>
          <input
            type="text"
            name="longitude"
            placeholder="Longitude"
            value={form.location.longitude}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded bg-gray-100"
          />
          {errors.location && <p className="text-red-500 text-sm">{errors.location}</p>}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-black text-white py-2 rounded hover:opacity-90"
        >
          {loading ? 'Registering...' : 'Sign Up'}
        </button>
      </form>
    </div>
  );
};

export default SalonRegister;
