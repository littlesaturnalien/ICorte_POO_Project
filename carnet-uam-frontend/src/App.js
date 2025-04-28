import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Rutas protegidas por rol
import ProtectedRoute from './components/ProtectedRoute';

// Página de login
import Login from './pages/Login';

// Estudiante
import StudentDashboard from './pages/student/Dashboard';
import StudentProfile from './pages/student/Profile';
import RequestID from './pages/student/RequestID';

// Admin
import AdminDashboard from './pages/admin/Dashboard';
import AdminUsers from './pages/admin/Users';
import AdminStudents from './pages/admin/Students';

function App() {
  return (
    <Router>
      <Routes>

        {/* ✅ Login es la ruta inicial */}
        <Route path="/login" element={<Login />} />

        {/* ✅ Rutas para estudiante */}
        <Route
          path="/student/dashboard"
          element={
            <ProtectedRoute role="student">
              <StudentDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/profile"
          element={
            <ProtectedRoute role="student">
              <StudentProfile />
            </ProtectedRoute>
          }
        />
        {/* ✅ Ruta para solicitar ID */}
        <Route
          path="/student/requestid"
          element={
            <ProtectedRoute role="student">
              <RequestID />
            </ProtectedRoute>
          }
        />

        {/* ✅ Rutas para admin */}
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute role="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/users"
          element={
            <ProtectedRoute role="admin">
              <AdminUsers />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/students"
          element={
            <ProtectedRoute role="admin">
              <AdminStudents />
            </ProtectedRoute>
          }
        />

        {/* ✅ Cualquier otra ruta te lleva al login */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
