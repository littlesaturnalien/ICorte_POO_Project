import React from 'react';
import { Link } from 'react-router-dom';
import ProtectedRoute from '../../components/ProtectedRoute';
import SuperadminLayout from '../../layouts/SuperadminLayout';

const SuperadminDashboardContent = () => (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg">
        <h1 className="text-2xl font-bold mb-6">Panel de Superadministrador</h1>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Link
                to="/admin/dashboard"
                className="block p-6 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-center font-semibold"
            >
                Ir al Dashboard de Admin
            </Link>
            <Link
                to="/student/dashboard"
                className="block p-6 bg-green-600 hover:bg-green-700 text-white rounded-lg text-center font-semibold"
            >
                Ir al Dashboard de Estudiante
            </Link>
        </div>
    </div>
);

const SuperadminDashboard = () => (
    <ProtectedRoute roles={['superadmin']}>
        <SuperadminLayout>
            <SuperadminDashboardContent />
        </SuperadminLayout>
    </ProtectedRoute>
);

export default SuperadminDashboard;
