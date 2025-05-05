// src/pages/admin/Dashboard.jsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const AdminDashboard = () => {
    const rawRole = localStorage.getItem('role') || '';
    const cif     = localStorage.getItem('cif');
    const userRole = rawRole.toLowerCase();

    const [admin, setAdmin] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const adminRes = await axios.get(`http://localhost:8087/uam-carnet-sys/admin/byCif=${cif}`);
                const payload = adminRes.data;
                const adminObj =
                    payload.data !== undefined
                        ? (Array.isArray(payload.data) ? payload.data[0] : payload.data)
                        : payload;
                setAdmin(adminObj);
            } catch (error) {
                console.error('Error al cargar datos del dashboard:', error);
            }
        };
        fetchData();
    }, [cif]);

    // Mientras carga
    if (!admin) {
        return (
            <div className="max-w-5xl mx-auto mt-10 p-6 bg-white rounded shadow text-center">
                Cargando...
            </div>
        );
    }

    const fullName = `${admin.names} ${admin.surnames}`;

    return (
        <div className="max-w-5xl mx-auto mt-10 p-6 bg-white rounded shadow">
            <h1 className="text-2xl font-bold mb-2">Bienvenido/a, {fullName}</h1>
            <h2 className="text-xl font-semibold mb-6">Panel de Control del Administrador</h2>

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
