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
      const response = await axios.post('http://localhost:8087/user/login', {
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
        setError('Login failed. Please try again.');
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-50">
      <form className="bg-white p-6 rounded shadow-md w-80" onSubmit={handleSubmit}>
        <h2 className="text-xl font-bold mb-4 text-center">Sign In</h2>

        {error && (
          <div className="mb-3 text-red-600 text-sm text-center">
            {error}
          </div>
        )}

        <input
          type="text"
          className="w-full border px-3 py-2 mb-3 rounded"
          placeholder="CIF"
          value={cif}
          onChange={(e) => setCif(e.target.value)}
          required
        />
        <input
          type="password"
          className="w-full border px-3 py-2 mb-3 rounded"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Log In
        </button>
      </form>
    </div>
  );
};

export default Login;
