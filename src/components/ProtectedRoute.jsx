// src/components/ProtectedRoute.jsx
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = ({ allowedRoles }) => {
  const token = localStorage.getItem('access_token');
  const role = localStorage.getItem('user_role');

  if (!token) {
    // Not logged in, send to login
    return <Navigate to="/" replace />;
  }

  if (!allowedRoles.includes(role)) {
    // Logged in but role is not allowed
    if (role === 'salon_admin') return <Navigate to="/admin" replace />;
    if (role === 'super_admin') return <Navigate to="/super-admin" replace />;
    if (role === 'customer') return <Navigate to="/" replace />;
    return <Navigate to="/login" replace />;
  }

  // Role is allowed
  return <Outlet />;
};

export default ProtectedRoute;
