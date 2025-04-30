import React, { useState } from 'react';
import axios from 'axios';

const Login = () => {
  const [cif, setCif] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await axios.post('http://localhost:8087/uam-carnet-sys/user/login', {
        cif,
        password
      });

      const userList = response.data;

      if (Array.isArray(userList) && userList.length > 0) {
        const user = userList[0];

        // Obtener info extendida con rol
        const res = await axios.get(`http://localhost:8087/uam-carnet-sys/user/byCif=${cif}`);
        const fullUser = res.data;

        // Determinar rol desde la propiedad roles
        let role = 'student';
        if (fullUser.roles && fullUser.roles.includes('ADMIN')) {
          role = 'admin';
        }

        // Guardar sesión
        localStorage.setItem('cif', cif);
        localStorage.setItem('role', role);

        // Redirigir
        window.location.href = `/${role}/dashboard`;

      } else {
        setError('No se encontró el usuario.');
      }
    } catch (err) {
      console.error(err);
      if (err.response) {
        setError(err.response.data);
      } else {
        setError('No se logró iniciar sesión. Intente de nuevo.');
      }
    }
  };

  return (
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

      <div className="flex-grow flex items-center justify-center px-4">
        <form
          className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-sm"
          onSubmit={handleSubmit}
        >
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
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md font-semibold transition duration-200"
        >
          Iniciar Sesión
        </button>
      </form>
    </div>
    </div>
  );
};

export default Login;
