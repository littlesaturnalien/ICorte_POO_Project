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

//Superadmin
import SuperadminDashboard from "./pages/superadmin/Dashboard";

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
            <ProtectedRoute roles={['student', 'superadmin']}>
              <StudentDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/profile"
          element={
            <ProtectedRoute roles={['student', 'superadmin']}>
              <StudentProfile />
            </ProtectedRoute>
          }
        />
        {/* ✅ Ruta para solicitar ID */}
        <Route
          path="/student/requestid"
          element={
            <ProtectedRoute roles={['student', 'superadmin']}>
              <RequestID />
            </ProtectedRoute>
          }
        />

        {/* ✅ Rutas para admin */}
          // Rutas de admin que ahora aceptan admin y superadmin
          <Route
              path="/admin/dashboard"
              element={
                  <ProtectedRoute roles={['admin','superadmin']}>
                      <AdminDashboard />
                  </ProtectedRoute>
              }
          />
        <Route
          path="/admin/users"
          element={
            <ProtectedRoute roles={['admin','superadmin']}>
              <AdminUsers />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/students"
          element={
            <ProtectedRoute roles={['admin','superadmin']}>
              <AdminStudents />
            </ProtectedRoute>
          }
        />
          <Route
              path="/superadmin/dashboard"
              element={
                  <ProtectedRoute roles={['superadmin']}>
                      <SuperadminDashboard />
                  </ProtectedRoute>}
          />
        {/* ✅ Cualquier otra ruta te lleva al login */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
