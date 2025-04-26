// src/components/ProtectedRoute.jsx
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, role }) => {
  const userCif = localStorage.getItem('cif');
  const userRole = localStorage.getItem('role');

  if (!userCif) return <Navigate to="/login" replace />;
  if (role && role !== userRole) return <Navigate to="/login" replace />;

  return children;
};

export default ProtectedRoute;
