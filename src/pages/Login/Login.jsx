import React, { useState } from 'react';
import axios from 'axios';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await axios.post(
        'http://localhost:3000/api/auth/login',
        { email, password },
        { withCredentials: true }
      );

      const { access_token, customRole } = response.data;

      localStorage.setItem('access_token', access_token);
      localStorage.setItem('user_role', customRole);

      if (customRole === 'salon_admin') {
        window.location.href = '/admin';
      } else if (customRole === 'super_admin') {
        window.location.href = '/super-admin';
      } else if (customRole === 'customer') {
        window.location.href = '/my-bookings';
      } else {
        setError('Invalid user role. Please contact support.');
      }
    } catch (err) {
      console.error(err);
      setError(err?.response?.data?.error || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-10 rounded-xl shadow-lg w-full max-w-md text-center">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">Salon Login</h2>
        <form className="flex flex-col gap-4" onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            className="px-4 py-3 rounded-md border border-gray-300 text-base bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="px-4 py-3 rounded-md border border-gray-300 text-base bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-500"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="submit"
            className="bg-gray-900 hover:bg-gray-700 text-white px-4 py-3 rounded-md transition-colors duration-300"
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        {error && (
          <p className="text-red-600 mt-3">{error}</p>
        )}

        <p className="mt-5 text-sm">
          New Salon?{' '}
          <a href="/register" className="text-gray-900 font-medium underline">
            Register Now
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;
