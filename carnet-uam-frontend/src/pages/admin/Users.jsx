import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AdminLayout from '../../layouts/AdminLayout';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);

  const fetchUsers = async () => {
    try {
      const res = await axios.get(`http://localhost:8087/uam-carnet-sys/user`);
      setUsers(res.data);
    } catch (err) {
      console.error("Error al cargar usuarios:", err);
    }
  };

  const promoteToAdmin = async (cif) => {
    try {
      await axios.post(`http://localhost:8087/uam-carnet-sys/admin/${cif}/promoteToAdmin`, { cif });
      alert("Usuario promovido a administrador.");
      fetchUsers(); // actualizar lista
    } catch (err) {
      console.error("Error al promover:", err);
    }
  };

  const revokeAdmin = async (cif) => {
    try {
      await axios.post(`http://localhost:8087/uam-carnet-sys/admin/${cif}/revokeAdminRole`, { cif });
      alert("Rol de administrador revocado.");
      fetchUsers(); // actualizar lista
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

        <table className="w-full table-auto border text-left">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2">CIF</th>
              <th className="p-2">Nombre</th>
              <th className="p-2">Teléfono</th>
              <th className="p-2">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.cif} className="border-t">
                <td className="p-2">{user.cif}</td>
                <td className="p-2">{user.fullName}</td>
                <td className="p-2">{user.phoneNumber || 'No registrado'}</td>
                <td className="p-2 space-x-2">
                  <button
                    onClick={() => promoteToAdmin(user.cif)}
                    className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                  >
                    Promover
                  </button>
                  <button
                    onClick={() => revokeAdmin(user.cif)}
                    className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                  >
                    Revocar
                  </button>
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
