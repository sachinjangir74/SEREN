import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, requireAdmin = false, requireTherapist = false }: { children?: React.ReactNode, requireAdmin?: boolean, requireTherapist?: boolean }) => {
  const { user, loading } = useAuth();

  if (loading) return (
    <div className="flex justify-center items-center h-screen w-full">
      <span className="w-10 h-10 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></span>
    </div>
  );

  if (!user) return <Navigate to="/login" replace />;
  if (requireAdmin && user.role !== 'admin') return <Navigate to="/profile" replace />;
  if (requireTherapist && user.role !== 'therapist') return <Navigate to="/profile" replace />;

  return children ? <>{children}</> : <Outlet />;
};

export default ProtectedRoute;
