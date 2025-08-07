// src/components/PublicCustomerRoute.jsx
import { Navigate } from 'react-router-dom';

const PublicCustomerRoute = ({ children }) => {
  const role = localStorage.getItem('user_role');

  if (role === 'salon_admin') return <Navigate to="/admin" replace />;
  if (role === 'super_admin') return <Navigate to="/super-admin" replace />;
  
  // Allow access for unauthenticated or customer
  return children;
};

export default PublicCustomerRoute;
