// src/components/ProtectedRoute.jsx
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, roles = [] }) => {
  const userCif  = localStorage.getItem('cif');
  const rawRole  = localStorage.getItem('role') || '';
  const userRole = rawRole.toLowerCase();

  if (!userCif) return <Navigate to="/login" replace />;

  // Ahora comparamos minúsculas con minúsculas
  if (!roles.includes(userRole)) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
