// src/pages/Login.jsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

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
      // 1) Intento de login
      const loginRes = await axios.post(
        'http://localhost:8087/uam-carnet-sys/user/login',
        { cif, password }
      );
      const data = loginRes.data;

      // 2) Obtener perfil según el formato de respuesta
      let profile;
      if (Array.isArray(data)) {
        if (data.length === 0) {
          setError('No se encontró el usuario.');
          setLoading(false);
          return;
        }
        const profileRes = await axios.get(
          `http://localhost:8087/uam-carnet-sys/user/byCif/${cif}`
        );
        profile = profileRes.data;
      } else {
        profile = data;
      }

      // 3) Guardar datos en localStorage y navegar según rol
      const roleStr = String(profile.role).toLowerCase();
      localStorage.setItem('cif', cif);
      localStorage.setItem('role', roleStr);
      navigate(`/${roleStr}/dashboard`, { replace: true });

    } catch (err) {
      console.error('Error en handleSubmit:', err);
      setError(err.response?.data || 'No se logró iniciar sesión. Intente de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0099A8] flex flex-col">
      {/* Barra superior */}
      <div className="w-full bg-white py-3 px-6 flex justify-between items-center shadow">
        <img
          src="/images/idkeeperlogo.jpeg"
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
          className="relative bg-white p-8 rounded-2xl shadow-2xl w-full max-w-sm"
        >
          {/* Overlay de carga */}
          {loading && (
            <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center rounded-2xl">
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
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 rounded-md font-semibold transition duration-200 ${
              loading
                ? 'bg-blue-400 cursor-not-allowed text-white'
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
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
