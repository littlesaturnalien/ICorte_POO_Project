import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ProtectedRoute from '../../components/ProtectedRoute';
import SuperadminLayout from '../../layouts/SuperadminLayout';
import axios from 'axios';

/* Palette */
const C = {
    tealLight: '#4da4ab', // Facultades / Carreras
    tealMid:   '#487e84', // Dashboards
    tealDark:  '#0b545b', // Encabezado
};

/* Card – mismo ancho para todos */
const Tile = ({ to, color, children }) => (
    <Link
        to={to}
        className="inline-block w-64 text-white text-center font-semibold py-8 px-8 rounded-2xl transition transform hover:scale-105 hover:shadow-xl border border-transparent"
        style={{ backgroundColor: color }}
    >
        <span className="text-lg leading-tight block">{children}</span>
    </Link>
);

const SuperadminDashboardContent = () => {
    const cif = localStorage.getItem('cif');
    const [user, setUser] = useState(null);

    useEffect(() => {
        (async () => {
            try {
                const { data } = await axios.get(
                    `http://localhost:8087/uam-carnet-sys/admin/byCif=${cif}`,
                );
                const u = data?.data !== undefined ? (Array.isArray(data.data) ? data.data[0] : data.data) : data;
                setUser(u);
            } catch (err) {
                console.error('Error cargando datos del superadmin:', err);
            }
        })();
    }, [cif]);

    if (!user)
        return (
            <SuperadminLayout>
                <div className="text-center mt-10">Cargando…</div>
            </SuperadminLayout>
        );

    const fullName = `${user.names} ${user.surnames}`.trim();

    return (
        <SuperadminLayout>
            <div
                className="min-h-screen w-full"
                style={{ background: 'linear-gradient(180deg, #eaf6f7 0%, #c7e1e3 40%, #9cc8cb 100%)' }}
            >
                <div className="max-w-5xl mx-auto px-4 py-16">
                    {/* Encabezado */}
                    <div className="text-white p-10 rounded-2xl shadow-lg mb-12" style={{ backgroundColor: C.tealDark }}>
                        <h1 className="text-4xl font-bold mb-2">Bienvenido/a, {fullName}</h1>
                        <p className="opacity-80 text-lg">Panel de Superadministrador</p>
                    </div>

                    {/* Tarjetas */}
                    <div className="space-y-12">
                        <div className="flex flex-col sm:flex-row gap-8 justify-center">
                            <Tile to="/admin/dashboard"   color={C.tealMid}>Dashboard Admin</Tile>
                            <Tile to="/student/dashboard" color={C.tealMid}>Dashboard Estudiante</Tile>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-8 justify-center">
                            <Tile to="/superadmin/faculties" color={C.tealLight}>🏛 Facultades</Tile>
                            <Tile to="/superadmin/degrees"   color={C.tealLight}>🎓 Carreras</Tile>
                        </div>
                    </div>
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
