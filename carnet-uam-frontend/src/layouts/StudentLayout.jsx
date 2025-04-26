// src/layouts/StudentLayout.jsx
import { Link } from "react-router-dom";

const StudentLayout = ({ children }) => {
  const logout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  return (
    <div>
      <nav className="bg-blue-700 text-white px-6 py-4 flex justify-between items-center shadow">
        <div className="flex space-x-6">
          <Link to="/student/dashboard" className="hover:underline">🏠 Dashboard</Link>
          <Link to="/student/profile" className="hover:underline">👤 Perfil</Link>
        </div>
        <button onClick={logout} className="bg-red-500 px-3 py-1 rounded hover:bg-red-600">
          Cerrar Sesión
        </button>
      </nav>

      <main className="p-4">{children}</main>
    </div>
  );
};

export default StudentLayout;
