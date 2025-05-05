// src/layouts/StudentLayout.jsx
import { Link } from "react-router-dom";

const C = {
  tealLight: '#4da4ab',
  tealMid:   '#487e84',
  tealDark:  '#0b545b',
  black:     '#2d2e3c',
};

const StudentLayout = ({ children }) => {
  const logout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  return (
      <div
          className="min-h-screen bg-cover bg-center"
          style={{ backgroundImage: "url('/images/background-students.png')" }}
      >
        <nav
            className="text-white px-6 py-4 flex justify-between items-center shadow"
            style={{ backgroundColor: C.tealDark }}
        >
          <div className="flex space-x-6 font-medium">
            <Link to="/student/dashboard" className="hover:underline">
              🏠 Dashboard
            </Link>
            <Link to="/student/profile" className="hover:underline">
              👤 Perfil
            </Link>
          </div>
          <button
              onClick={logout}
              className="bg-[#cc3d3d] px-3 py-1 rounded hover:bg-[#a93131]"
          >
            Cerrar Sesión
          </button>
        </nav>

        <main className="p-6">{children}</main>
      </div>
  );
};

export default StudentLayout;
