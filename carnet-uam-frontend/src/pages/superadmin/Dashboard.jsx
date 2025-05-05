// src/pages/superadmin/Dashboard.jsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ProtectedRoute from '../../components/ProtectedRoute';
import SuperadminLayout from '../../layouts/SuperadminLayout';
import axios from 'axios';

const SuperadminDashboardContent = () => {
    const cif = localStorage.getItem('cif');
    const [user, setUser] = useState(null);

    useEffect(() => {
        const fetchSelf = async () => {
            try {
                // Usamos el endpoint de admin para cargar el superadmin por CIF
                const res = await axios.get(`http://localhost:8087/uam-carnet-sys/admin/byCif=${cif}`);
                const payload = res.data;
                const userObj =
                    payload.data !== undefined
                        ? (Array.isArray(payload.data) ? payload.data[0] : payload.data)
                        : payload;
                setUser(userObj);
            } catch (err) {
                console.error('Error cargando datos del superadmin:', err);
            }
        };
        fetchSelf();
    }, [cif]);

    if (!user) {
        return (
            <SuperadminLayout>
                <div className="text-center mt-10">Cargando...</div>
            </SuperadminLayout>
        );
    }

    const fullName = `${user.names} ${user.surnames}`.trim();

    return (
        <SuperadminLayout>
            <div className="max-w-4xl mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg">
                <h1 className="text-2xl font-bold mb-2">Bienvenido/a, {fullName}</h1>
                <h2 className="text-xl font-semibold mb-6">Panel de Superadministrador</h2>
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
                    <Link
                        to="/superadmin/faculties"
                        className="block p-6 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg text-center font-semibold"
                    >
                        🏛 Gestión de Facultades
                    </Link>
                    <Link
                        to="/superadmin/degrees"
                        className="block p-6 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-center font-semibold"
                    >
                        🎓 Gestión de Carreras
                    </Link>
                </div>
            </div>
        </SuperadminLayout>
    );
};

const SuperadminDashboard = () => (
    <ProtectedRoute roles={['superadmin']}>
        <SuperadminDashboardContent />
    </ProtectedRoute>
);

export default SuperadminDashboard;
