import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const Login = () => {
    const [cif, setCif] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const res = await api.get('/students/login', {
                params: { cif, password }
            });
            if (res.data) {
                localStorage.setItem('student', JSON.stringify(res.data));
                navigate('/dashboard');
            } else {
                setError('Invalid CIF or password');
            }
        } catch (err) {
            console.error(err);
            setError('An error occurred. Please try again.');
        }
    }

    return (<div className="min-h-screen flex items-center justify-center bg-gray-100">
        <form
          onSubmit={handleLogin}
          className="bg-white p-6 rounded shadow-md w-full max-w-sm"
        >
          <h2 className="text-2xl font-bold mb-4 text-center">Iniciar SesiÃ³n</h2>
          {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
          <input
            type="text"
            placeholder="CIF"
            value={cif}
            onChange={(e) => setCif(e.target.value)}
            className="w-full mb-4 px-3 py-2 border rounded"
            required
          />
          <input
            type="password"
            placeholder="password"
            value={clave}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full mb-4 px-3 py-2 border rounded"
            required
          />
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
            >
                Login 
            </button>
        </form>
    </div>
    );
};

export default Login;