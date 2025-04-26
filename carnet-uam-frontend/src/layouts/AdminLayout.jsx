// src/layouts/AdminLayout.jsx
import { Link } from 'react-router-dom';

const AdminLayout = ({ children }) => {
  const logout = () => {
    localStorage.clear();
    window.location.href = '/login';
  };

  return (
    <div>
      <nav className="bg-gray-800 text-white px-6 py-4 flex justify-between items-center">
        <div className="flex space-x-4">
          <Link to="/admin/dashboard" className="hover:underline">📊 Dashboard</Link>
          <Link to="/admin/users" className="hover:underline">👥 Usuarios</Link>
          <Link to="/admin/students" className="hover:underline">🎓 Estudiantes</Link>
        </div>
        <button onClick={logout} className="bg-red-600 px-3 py-1 rounded hover:bg-red-700">
          Cerrar Sesión
        </button>
      </nav>
      <main className="p-4">{children}</main>
    </div>
  );
};

export default AdminLayout;
