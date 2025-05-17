// src/pages/Login.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const PRIMARY = '#0099A8';      // color “celeste” original
const PRIMARY_HOVER = '#008090';
const PRIMARY_DISABLED = '#4CC4D1';

const Login = () => {
    const [cif, setCif] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            console.log('🟦 Enviando login con:', { cif, password });

            const response = await axios.post(
                'http://localhost:8087/uam-carnet-sys/user/login',
                { cif, password }
            );

            const userData = response.data;
            console.log('🟩 Respuesta de login:', userData);

            if ((Array.isArray(userData) && userData.length === 0)||
                (typeof userData === 'object' && Object.keys(userData).length === 0)) {
                setError('No se pudo validar al usuario.');
                console.warn('⚠️ Login fallido: sin datos');
                return;
            }

            const res = await axios.get(
                `http://localhost:8087/uam-carnet-sys/user/byCif=${cif}`
            );

            const profile = res.data;
            const profileInfo = profile[0];
            console.log('🟢 Perfil obtenido:', profileInfo);

            localStorage.setItem('cif', cif);
            localStorage.setItem('role', String(profileInfo.role).toLowerCase());

            console.log(`🚀 Redirigiendo a: /${String(profileInfo.role).toLowerCase()}/dashboard`);
            navigate(`/${String(profileInfo.role).toLowerCase()}/dashboard`, {
                replace: true,
            });
        } catch (err) {
            console.error(err);
            if (err.response) {
                setError(err.response.data);
            } else {
                setError('No se logró iniciar sesión. Intente de nuevo.');
            }
        } finally {
            setLoading(false);
        }
    };


    return (
        <div className="min-h-screen relative flex flex-col">
            {/* Fondo UAM*/}
            <img
                src="/images/login-bg.webp"
                alt="background"
                className="absolute inset-0 w-full h-full object-cover -z-10"
                fetchpriority="high"
            />

            {/* Barra superior */}
            <div className="w-full bg-white/90 py-3 px-6 flex justify-between items-center shadow">
                <img
                    src="/images/idkeeperlogo.png"
                    alt="ID Keeper Logo"
                    className="h-20 object-contain"
                />
                <img
                    src="/images/logo-uam-2.png"
                    alt="Logo UAM"
                    className="h-10 object-contain"
                />
            </div>

            {/* Formulario */}
            <div className="flex-grow flex items-center justify-center px-4">
                <form
                    onSubmit={handleSubmit}
                    className="relative bg-white/90 p-8 rounded-2xl shadow-2xl w-full max-w-sm"
                >
                    {/* Spinner */}
                    {loading && (
                        <div className="absolute inset-0 bg-white/80 flex items-center justify-center rounded-2xl">
                            <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
                        </div>
                    )}

                    <h2 className="text-xl font-bold mb-6 text-center text-gray-800">
                        Iniciar Sesión
                    </h2>

                    {error && (
                        <div className="mb-4 text-red-600 text-sm text-center bg-red-100 py-2 rounded">
                            {error}
                        </div>
                    )}

                    <div className="mb-4">
                        <input
                            id="cif"
                            type="text"
                            placeholder="Ingrese su CIF"
                            value={cif}
                            onChange={(e) => setCif(e.target.value)}
                            disabled={loading}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0099A8]"
                        />
                    </div>

                    <div className="mb-6">
                        <input
                            id="password"
                            type="password"
                            placeholder="Ingrese su contraseña"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            disabled={loading}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0099A8]"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        style={{
                            backgroundColor: loading ? PRIMARY_DISABLED : PRIMARY,
                        }}
                        className={`w-full py-2 rounded-md font-semibold text-white transition duration-200 ${
                            loading ? 'cursor-not-allowed' : ''
                        }`}
                        onMouseEnter={(e) => {
                            if (!loading) e.currentTarget.style.backgroundColor = PRIMARY_HOVER;
                        }}
                        onMouseLeave={(e) => {
                            if (!loading) e.currentTarget.style.backgroundColor = PRIMARY;
                        }}
                    >
                        {loading ? (
                            <div className="flex items-center justify-center">
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                                <span>Cargando...</span>
                            </div>
                        ) : (
                            'Iniciar Sesión'
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;