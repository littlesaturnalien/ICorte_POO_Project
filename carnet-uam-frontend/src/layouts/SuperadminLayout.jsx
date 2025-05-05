import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';

const COLORS = {
    bar: '#0b545b',          // navbar background
    logout: '#f98806',       // logout button
    logoutHover: '#d47104',
    menuBg: '#ffffff',       // dropdown background
    menuItem: '#0b545b',
    menuItemHover: '#4da4ab',
};

const useOutsideClick = (ref, cb) => {
    useEffect(() => {
        const handler = (e) => {
            if (ref.current && !ref.current.contains(e.target)) cb();
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, [ref, cb]);
};

const SuperadminLayout = ({ children }) => {
    const [open, setOpen] = useState(false);
    const menuRef = useRef(null);
    useOutsideClick(menuRef, () => setOpen(false));

    const logout = () => {
        localStorage.clear();
        window.location.href = '/login';
    };

    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#eaf3f4] via-[#d3e8ea] to-[#b8dce0]">
            {/* Navbar */}
            <nav
                className="px-6 py-4 flex justify-between items-center"
                style={{ backgroundColor: COLORS.bar }}
            >
                {/* Dropdown */}
                <div className="relative" ref={menuRef}>
                    <button
                        aria-label="Abrir menú de roles"
                        onClick={() => setOpen((o) => !o)}
                        className="text-white font-semibold flex items-center gap-1 select-none"
                    >
                        Roles ▾
                    </button>

                    {open && (
                        <ul
                            className="absolute mt-2 w-48 rounded-lg shadow-lg border border-gray-200 overflow-hidden z-50"
                            style={{ backgroundColor: COLORS.menuBg }}
                        >
                            <li>
                                <Link
                                    to="/superadmin/dashboard"
                                    className="block px-4 py-2 text-sm font-medium"
                                    style={{ color: COLORS.menuItem }}
                                    onMouseEnter={(e) => (e.currentTarget.style.color = COLORS.menuItemHover)}
                                    onMouseLeave={(e) => (e.currentTarget.style.color = COLORS.menuItem)}
                                    onClick={() => setOpen(false)}
                                >
                                    🛡️ Superadmin
                                </Link>
                            </li>
                            <li className="border-t">
                                <Link
                                    to="/admin/dashboard"
                                    className="block px-4 py-2 text-sm font-medium"
                                    style={{ color: COLORS.menuItem }}
                                    onMouseEnter={(e) => (e.currentTarget.style.color = COLORS.menuItemHover)}
                                    onMouseLeave={(e) => (e.currentTarget.style.color = COLORS.menuItem)}
                                    onClick={() => setOpen(false)}
                                >
                                    📊 Admin
                                </Link>
                            </li>
                            <li className="border-t">
                                <Link
                                    to="/student/dashboard"
                                    className="block px-4 py-2 text-sm font-medium"
                                    style={{ color: COLORS.menuItem }}
                                    onMouseEnter={(e) => (e.currentTarget.style.color = COLORS.menuItemHover)}
                                    onMouseLeave={(e) => (e.currentTarget.style.color = COLORS.menuItem)}
                                    onClick={() => setOpen(false)}
                                >
                                    🏠 Student
                                </Link>
                            </li>
                        </ul>
                    )}
                </div>

                {/* Logout */}
                <button
                    onClick={logout}
                    className="px-3 py-1 rounded font-semibold text-white transition-colors"
                    style={{ backgroundColor: COLORS.logout }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = COLORS.logoutHover)}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = COLORS.logout)}
                >
                    Cerrar Sesión
                </button>
            </nav>

            <main className="flex-1 p-4">{children}</main>
        </div>
    );
};

export default SuperadminLayout;

