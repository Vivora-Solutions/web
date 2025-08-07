import  { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

import { PublicAPI } from '../../utils/api'; 

const Login = () => {
  const location = useLocation(); 
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (location.state?.email) setEmail(location.state.email);
    if (location.state?.password) setPassword(location.state.password);
  }, [location.state]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await PublicAPI.post('/auth/login', {
        email,
        password,
      });


      const { access_token, customRole } = response.data;
      
      localStorage.setItem('access_token', access_token);
      localStorage.setItem('user_role', customRole);

      const redirectPath = localStorage.getItem("redirectAfterLogin");

      if (redirectPath) {
        localStorage.removeItem("redirectAfterLogin");
        window.location.replace(`/${redirectPath}`);
      } else if (customRole === 'salon_admin') {
        window.location.replace('/admin');
      } else if (customRole === 'super_admin') {
        window.location.replace('/super-admin');
      } else if (customRole === 'customer') {
        window.location.replace('/');
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
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">Login</h2>
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
          Not a member?{' '}
          <a href="/signup" className="text-gray-900 font-medium underline">
            Register Now
          </a>          
        </p>
        <p>
          Or
        </p>

        <p>
          <a href="/salon-register" className="text-gray-900 font-medium underline">
            Register As a Salon
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;
