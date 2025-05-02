// src/components/ProtectedRoute.jsx
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, roles = [] }) => {
  const userCif  = localStorage.getItem('cif');
  const userRole = localStorage.getItem('role');

  if (!userCif) return <Navigate to="/login" replace />;

  // roles podría ser ['student'], ['admin','superadmin'], etc.
  if (!roles.includes(userRole)) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
