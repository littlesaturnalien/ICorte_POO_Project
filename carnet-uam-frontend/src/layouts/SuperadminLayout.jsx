import { Link } from 'react-router-dom';

const SuperadminLayout = ({ children }) => {
    const logout = () => {
        localStorage.clear();
        window.location.href = '/login';
    };

    return (
        <div>
            <nav className="bg-purple-800 text-white px-6 py-4 flex justify-between items-center">
                <div className="flex space-x-4">
                    <Link to="/superadmin/dashboard" className="hover:underline">🛡️ Superadmin</Link>
                    <Link to="/admin/dashboard" className="hover:underline">📊 Admin</Link>
                    <Link to="/student/dashboard" className="hover:underline">🏠 Student</Link>
                </div>
                <button
                    onClick={logout}
                    className="bg-red-600 px-3 py-1 rounded hover:bg-red-700"
                >
                    Cerrar Sesión
                </button>
            </nav>
            <main className="p-4">{children}</main>
        </div>
    );
};

export default SuperadminLayout;
