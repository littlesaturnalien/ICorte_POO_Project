// src/pages/admin/Dashboard.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
    // Leer y normalizar el rol
    const rawRole = localStorage.getItem('role') || '';
    const userRole = rawRole.toLowerCase();

    return (
        <div className="max-w-5xl mx-auto mt-10 p-6 bg-white rounded shadow">
            <h1 className="text-2xl font-bold mb-6">Panel de Control del Administrador</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <Link
                    to="/admin/students"
                    className="bg-blue-600 text-white p-4 rounded shadow hover:bg-blue-700 transition"
                >
                    📚 Gestión de Estudiantes
                </Link>
                <Link
                    to="/admin/users"
                    className="bg-indigo-600 text-white p-4 rounded shadow hover:bg-indigo-700 transition"
                >
                    👤 Gestión de Usuarios
                </Link>
            </div>

            {userRole === 'superadmin' && (
                <div className="text-right">
                    <Link
                        to="/superadmin/dashboard"
                        className="inline-block bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-800 transition"
                    >
                        ← Volver a Superadmin
                    </Link>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;
