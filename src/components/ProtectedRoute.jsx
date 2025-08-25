

// src/components/ProtectedRoute.jsx
import { Navigate, Outlet } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const ProtectedRoute = ({ allowedRoles }) => {
  const token = localStorage.getItem('access_token');
  const role = localStorage.getItem('user_role');

  // No token → redirect to login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Decode token and check expiry
  try {
    const decoded = jwtDecode(token);
    //console.log('Decoded token:', decoded);
    if (decoded.exp * 1000 < Date.now()) {
      localStorage.removeItem('access_token');
      localStorage.removeItem('user_role');
      return <Navigate to="/login" replace />;
    }
  } catch (err) {
    // Invalid token
    localStorage.removeItem('access_token');
    localStorage.removeItem('user_role');
    return <Navigate to="/login" replace />;
  }

  // Role not allowed → redirect accordingly
  if (!allowedRoles.includes(role)) {
    if (role === 'salon_admin') return <Navigate to="/admin" replace />;
    if (role === 'super_admin') return <Navigate to="/super-admin" replace />;
    if (role === 'customer') return <Navigate to="/" replace />;
    return <Navigate to="/login" replace />;
  }

  // Pass through
  return <Outlet />;
};

export default ProtectedRoute;
