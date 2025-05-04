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

    console.log('▶️ handleSubmit disparado', { cif, password });

    try {
      console.log('📤 POST /user/login →', { cif, password });
      const { data } = await axios.post(
          'http://localhost:8087/uam-carnet-sys/user/login',
          { cif, password }
      );
      console.log('✅ /user/login respondió:', data);

      let profile;
      if (Array.isArray(data)) {
        console.log('🔄 Flujo ONLINE, array de UserDataDTO');
        if (data.length === 0) {
          setError('No se encontró el usuario.');
          return;
        }
        const res = await axios.get(
            `http://localhost:8087/uam-carnet-sys/user/byCif=${cif}`
        );
        console.log('✅ /user/byCif respondió:', res.data);
        profile = res.data;
      } else {
        console.log('🔄 Flujo OFFLINE, UserProfileResponseDTO directo');
        profile = data;
      }

      console.log('👤 Perfil final:', profile);
      const roleStr = String(profile.role).toLowerCase(); // 'student', 'admin', 'superadmin', etc.
      console.log('🎯 roleStr calculado:', roleStr);
      //const navRole = roleStr === 'superadmin' ? 'admin' : roleStr;

      localStorage.setItem('cif', cif);
      localStorage.setItem('role', roleStr);

      console.log('⏩ Navegando in-app a', `/${roleStr}/dashboard`);
      navigate(`/${roleStr}/dashboard`, { replace: true });

    } catch (err) {
      console.error('❌ Error en handleSubmit:', err);
      setError(err.response?.data || 'No se logró iniciar sesión. Intente de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
<<<<<<< Updated upstream
      <div className="min-h-screen bg-[#0099A8] flex flex-col">
        {/* Barra superior blanca con logos */}
        <div className="w-full bg-white py-3 px-6 flex justify-between items-center shadow">
          <img
              src="/images/idkeeperlogo.jpeg"
              alt="ID Keeper Logo"
              className="h-10 object-contain"
          />
          <img
              src="/images/logo-uam-2.png"
              alt="Logo UAM"
              className="h-10 object-contain"
          />
        </div>
=======
    <div className="min-h-screen bg-[#0099A8] flex flex-col">
      {/* Barra superior blanca con logos */}
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
>>>>>>> Stashed changes
=======
    <div className="min-h-screen bg-[#0099A8] flex flex-col">
      {/* Barra superior blanca con logos */}
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
>>>>>>> Stashed changes

        <div className="flex-grow flex items-center justify-center px-4">
          <form
              className="relative bg-white p-8 rounded-2xl shadow-2xl w-full max-w-sm"
              onSubmit={handleSubmit}
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
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Ingrese su CIF"
                  value={cif}
                  onChange={(e) => setCif(e.target.value)}
                  disabled={loading}
                  required
              />
            </div>

            <div className="mb-6">
              <input
                  id="password"
                  type="password"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Ingrese su contraseña"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  required
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
