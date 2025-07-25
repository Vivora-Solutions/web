import React, { useState } from 'react';
import './SalonAdminLogin.css';
import axios from 'axios';

const SalonLogin = () => {
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
        { withCredentials: true } // ✅ enables cookies like refresh_token to be sent/received
      );

      const { access_token, customRole } = response.data;

      // ✅ Store access_token in localStorage (refresh token is stored in cookie)
      localStorage.setItem('access_token', access_token);
      localStorage.setItem('user_role', customRole);

      // ✅ Redirect user based on role
      if (customRole === 'salon_admin') {
        window.location.href = '/admin';
      } else {
        window.location.href = '/';
      }
    } catch (err) {
      console.error(err);
      setError(err?.response?.data?.error || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2 className="login-title">Salon Login</h2>
        <form className="login-form" onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            className="login-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="login-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" className="login-button" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        {error && <p style={{ color: 'red', marginTop: '12px' }}>{error}</p>}
        <p className="register-link">
          New Salon? <a href="/register">Register Now</a>
        </p>
      </div>
    </div>
  );
};

export default SalonLogin;
