// src/layouts/AdminLayout.jsx
import { Link } from 'react-router-dom';
import { useEffect } from 'react';

const BAR_HEIGHT = 64; // Tailwind h‑16

const AdminLayout = ({ children }) => {
  /* asegura que el body nunca quede oculto tras la barra fija */
  useEffect(() => {
    document.body.style.paddingTop = `${BAR_HEIGHT}px`;
    return () => (document.body.style.paddingTop = '');
  }, []);

  const logout = () => {
    localStorage.clear();
    window.location.href = '/login';
  };

  return (
      <div className="min-h-screen">
        {/* Barra superior translúcida, fija y con blur */}
        <nav
            className="fixed inset-x-0 top-0 z-50 flex items-center justify-between px-6 h-16 text-white backdrop-blur-md"
            style={{ backgroundColor: 'rgba(45,46,60,255)' }} /* #2d2e3c + 85 % */
        >
          <div className="flex space-x-6 text-sm sm:text-base font-semibold">
            <Link to="/admin/dashboard" className="hover:text-[#f98806]">
              📊 Dashboard
            </Link>
            <Link to="/admin/users" className="hover:text-[#f98806]">
              👥 Usuarios
            </Link>
            <Link to="/admin/students" className="hover:text-[#f98806]">
              🎓 Estudiantes
            </Link>
          </div>

          <button
              onClick={logout}
              className="px-3 py-1 rounded-md font-semibold bg-[#f98806] hover:bg-[#d47104] transition"
          >
            Cerrar Sesión
          </button>
        </nav>

        {/* contenido principal */}
        <main className="p-4">{children}</main>
      </div>
  );
};

export default AdminLayout;
