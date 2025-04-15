import React, { useState } from 'react';
import axios from 'axios';

const Login = ({ onLogin }) => {
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
        onLogin(userList[0]); // Solo tomamos el primer usuario como en el backend
      } else {
        setError('No user data returned.');
      }
    } catch (err) {
      console.error(err);
      if (err.response) {
        setError(err.response.data); // Muestra mensaje de error del backend
      } else {
        setError('No se logró iniciar sesión. Por favor intente de nuevo.');
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg gradient-to-br from-blue-700 to-blue-400 px-4">
      <form className="bg-white p-8 rounded-2x1 shadow-2x1 w-full max-w-sm" 
      onSubmit={handleSubmit}>
        <h2 className="text-xl font-bold mb-6 text-center text-gray-800">Iniciar Sesión</h2>

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
          <label className="block text-gray-700 mb-1" htmlFor="password">Contraseña</label>
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
  );
};

export default Login;
