// src/pages/admin/Dashboard.jsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import AdminLayout from '../../layouts/AdminLayout';

const C = {
    tealLight: '#4da4ab',
    tealMid:   '#487e84',
    tealDark:  '#0b545b',
};

const AdminDashboard = () => {
    const rawRole = localStorage.getItem('role') || '';
    const cif     = localStorage.getItem('cif');
    const userRole = rawRole.toLowerCase();

    const [admin, setAdmin] = useState(null);

    useEffect(() => {
        (async () => {
            try {
                const { data } = await axios.get(
                    `http://localhost:8087/uam-carnet-sys/admin/byCif=${cif}`
                );
                const adminObj =
                    data?.data !== undefined
                        ? Array.isArray(data.data) ? data.data[0] : data.data
                        : data;
                setAdmin(adminObj);
            } catch (err) {
                console.error('Error al cargar datos del dashboard:', err);
            }
        })();
    }, [cif]);

    if (!admin) {
        return (
            <AdminLayout disableGradient>
                <div className="text-center mt-10">Cargando…</div>
            </AdminLayout>
        );
    }

    const fullName = `${admin.names} ${admin.surnames}`;

    return (
        <AdminLayout disableGradient>
            {/* Wrapper relativo para el fondo */}
            <div
                className="relative flex justify-center items-start pt-16 px-4 pb-20"
                style={{ minHeight: 'calc(100vh - 64px)' }}
            >
                {/* Imagen de fondo SIN FILTRO ni OPACIDAD */}
                <div
                    className="absolute inset-0 bg-no-repeat bg-cover bg-center"
                    style={{
                        backgroundImage: "url('/images/student-id-keeper.png')"
                    }}
                />

                {/* Contenido encima de la imagen */}
                <div className="z-10 w-full max-w-6xl bg-white rounded-lg shadow-lg p-8">
                    <h1 className="text-2xl font-bold mb-2">Bienvenido/a, {fullName}</h1>
                    <h2 className="text-xl font-semibold mb-6">Panel de Control del Administrador</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <Link
                            to="/admin/students"
                            className="text-white font-semibold py-4 px-6 rounded-2xl text-center transition transform hover:scale-105 hover:shadow-xl"
                            style={{ backgroundColor: C.tealLight }}
                        >
                            📚 Gestión de Estudiantes
                        </Link>
                        <Link
                            to="/admin/users"
                            className="text-white font-semibold py-4 px-6 rounded-2xl text-center transition transform hover:scale-105 hover:shadow-xl"
                            style={{ backgroundColor: C.tealMid }}
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
            </div>
        </AdminLayout>
    );
};

export default AdminDashboard;