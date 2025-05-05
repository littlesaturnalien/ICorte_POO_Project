// src/pages/admin/AdminUsers.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../../layouts/AdminLayout';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [searchCif, setSearchCif] = useState('');
  const navigate = useNavigate();

  const fetchUsers = async () => {
    try {
      const res = await axios.get('http://localhost:8087/uam-carnet-sys/user');
      setUsers(res.data);
    } catch (err) {
      console.error("Error al cargar usuarios:", err);
    }
  };

  const fetchUserByCif = async () => {
    if (!searchCif) return;
    try {
      const res = await axios.get(`http://localhost:8087/uam-carnet-sys/user/byCif=${searchCif}`);
      setUsers(Array.isArray(res.data) ? res.data : [res.data]);
    } catch (err) {
      console.error("Usuario no encontrado:", err);
      setUsers([]);
    }
  };

  const deleteUser = async (cif) => {
    try {
      await axios.delete(`http://localhost:8087/uam-carnet-sys/user/delete=${cif}`);
      alert("Usuario eliminado.");
      searchCif ? fetchUserByCif() : fetchUsers();
    } catch (err) {
      console.error("Error al eliminar:", err);
    }
  };

  const promoteToAdmin = async (targetCif) => {
    try {
      const currentAdminCif = localStorage.getItem('cif');
      await axios.patch(
          `http://localhost:8087/uam-carnet-sys/admin/${currentAdminCif}/promoteToAdmin`,
          { cif: targetCif }
      );
      alert("Usuario promovido a administrador.");
      fetchUsers();
    } catch (err) {
      console.error("Error al promover:", err);
    }
  };

  const revokeAdmin = async (targetCif) => {
    try {
      const currentAdminCif = localStorage.getItem('cif');
      await axios.patch(
          `http://localhost:8087/uam-carnet-sys/admin/${currentAdminCif}/revokeAdminRole`,
          { cif: targetCif }
      );
      alert("Rol de administrador revocado.");
      fetchUsers();
    } catch (err) {
      console.error("Error al revocar:", err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
      <AdminLayout>
        <div className="max-w-6xl mx-auto mt-10 p-6 bg-white rounded shadow">
          <h1 className="text-2xl font-bold mb-6">Gestión de Usuarios</h1>

          <div className="flex items-center mb-6 gap-2">
            <input
                type="text"
                placeholder="Buscar por CIF..."
                value={searchCif}
                onChange={(e) => setSearchCif(e.target.value)}
                className="border px-3 py-2 rounded w-1/3"
            />
            <button onClick={fetchUserByCif} className="bg-blue-600 text-white px-4 py-2 rounded">
              Buscar
            </button>
            <button
                onClick={() => { setSearchCif(''); fetchUsers(); }}
                className="bg-gray-500 text-white px-4 py-2 rounded"
            >
              Ver Todos
            </button>
            <button
                onClick={() => navigate('/admin/createuser')}
                className="ml-auto bg-green-600 text-white px-4 py-2 rounded"
            >
              Crear Usuario
            </button>
          </div>

          <table className="w-full table-auto border text-left">
            <thead className="bg-gray-100">
            <tr>
              <th className="p-2">CIF</th>
              <th className="p-2">Nombres</th>
              <th className="p-2">Apellidos</th>
              <th className="p-2">Rol</th>
              <th className="p-2">Tipo</th>
              <th className="p-2">Acciones</th>
            </tr>
            </thead>
            <tbody>
            {users.map((user) => (
                <tr key={user.cif} className="border-t hover:bg-gray-50">
                  <td className="p-2">{user.cif}</td>
                  <td className="p-2">{user.names}</td>
                  <td className="p-2">{user.surnames}</td>
                  <td className="p-2">{user.role}</td>
                  <td className="p-2">{user.type}</td>
                  <td className="p-2 space-x-2">
                    <button
                        onClick={() => deleteUser(user.cif)}
                        className="bg-red-600 text-white px-3 py-1 rounded"
                    >
                      Eliminar
                    </button>
                    <button
                        onClick={() => navigate(`/admin/editUser/${user.cif}`)}
                        className="bg-indigo-600 text-white px-3 py-1 rounded hover:bg-indigo-700"
                    >
                      Editar
                    </button>

                    {['STUDENT','BLOCKED'].includes(user.role) && (
                        <button
                            onClick={() => promoteToAdmin(user.cif)}
                            className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                        >
                          Promover a Admin
                        </button>
                    )}
                    {user.role === 'ADMIN' && (
                        <button
                            onClick={() => revokeAdmin(user.cif)}
                            className="bg-yellow-600 text-white px-3 py-1 rounded hover:bg-yellow-700"
                        >
                          Revocar Admin
                        </button>
                    )}
                  </td>
                </tr>
            ))}
            </tbody>
          </table>
        </div>
      </AdminLayout>
  );
};

export default AdminUsers;
