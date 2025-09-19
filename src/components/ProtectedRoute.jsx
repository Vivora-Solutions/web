

// src/components/ProtectedRoute.jsx
import { Navigate, Outlet } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { supabase } from '../utils/supabaseClient';

const ProtectedRoute = ({ allowedRoles }) => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Get current session from Supabase
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error getting session:', error);
          setLoading(false);
          return;
        }

        if (session?.user) {
          setUser(session.user);
          
          const storedRole = localStorage.getItem('user_role');
          console.log('Stored role from localStorage:', storedRole);
          
          setUserRole( storedRole );
        }
      } catch (error) {
        console.error('Error in auth check:', error);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT' || !session) {
        setUser(null);
        setUserRole(null);
        localStorage.removeItem('user_role');
      } else if (session?.user) {
        setUser(session.user);
        // const role = session.user.user_metadata?.role || 
        //             session.user.app_metadata?.role || 
        //             localStorage.getItem('user_role') || 
        //             'customer';
        const role = localStorage.getItem('user_role')
        setUserRole(role);
        console.log('Auth state changed - User role:', role);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Show loading while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin h-12 w-12 border-b-2 border-indigo-600 rounded-full"></div>
      </div>
    );
  }

  // No user → redirect to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Role not allowed → redirect accordingly
  if (allowedRoles && !allowedRoles.includes(userRole)) {
    //console.log('Role not allowed. User role:', userRole, 'Allowed roles:', allowedRoles);
    if (userRole === 'salon_admin') return <Navigate to="/admin/salon-info" replace />;
    if (userRole === 'super_admin') return <Navigate to="/super-admin" replace />;
    if (userRole === 'customer') return <Navigate to="/" replace />;
    return <Navigate to="/login" replace />;
  }
  
  //console.log('Access granted. User role:', userRole, 'Allowed roles:', allowedRoles);

  // Pass through
  return <Outlet />;
};

export default ProtectedRoute;
