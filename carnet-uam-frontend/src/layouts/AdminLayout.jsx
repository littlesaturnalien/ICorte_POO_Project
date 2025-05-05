// src/layouts/AdminLayout.jsx
import { Link } from 'react-router-dom';
import { useEffect } from 'react';

const BAR_HEIGHT = 64; // Tailwind h-16

// Degradado por defecto
const DEFAULT_BG = 'linear-gradient(180deg, #eaf6f7 0%, #c7e1e3 40%, #9cc8cb 100%)';

const C = {
    tealDark:    '#0b545b',  // barra superior
    orange:      '#f98806',  // botón logout
    orangeHover: '#d47104',
};

const AdminLayout = ({ children, disableGradient = false }) => {
    useEffect(() => {
        document.body.style.paddingTop = `${BAR_HEIGHT}px`;
        return () => { document.body.style.paddingTop = ''; };
    }, []);

    const logout = () => {
        localStorage.clear();
        window.location.href = '/login';
    };

    return (
        <div className="min-h-screen flex flex-col">
            {/* Barra fija */}
            <nav
                className="fixed inset-x-0 top-0 z-50 flex items-center justify-between px-6 h-16 text-white backdrop-blur-md"
                style={{ backgroundColor: C.tealDark }}
            >
                <div className="flex space-x-6 text-sm sm:text-base font-semibold">
                    <Link to="/admin/dashboard" className="hover:text-[#f98806]">📊 Dashboard</Link>
                    <Link to="/admin/users"     className="hover:text-[#f98806]">👥 Usuarios</Link>
                    <Link to="/admin/students"  className="hover:text-[#f98806]">🎓 Estudiantes</Link>
                </div>
                <button
                    onClick={logout}
                    className="px-3 py-1 rounded-md font-semibold transition"
                    style={{ backgroundColor: C.orange }}
                    onMouseEnter={e => e.currentTarget.style.backgroundColor = C.orangeHover}
                    onMouseLeave={e => e.currentTarget.style.backgroundColor = C.orange}
                >
                    Cerrar Sesión
                </button>
            </nav>

            {/* Main: si disableGradient, fondo transparente, si no, degradado */}
            <main
                className="flex-grow"
                style={{
                    background: disableGradient ? 'none' : DEFAULT_BG,
                    minHeight: `calc(100vh - ${BAR_HEIGHT}px)`
                }}
            >
                {children}
            </main>
        </div>
    );
};

export default AdminLayout;