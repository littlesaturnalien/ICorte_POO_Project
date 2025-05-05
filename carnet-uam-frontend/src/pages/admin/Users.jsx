// src/pages/admin/AdminUsers.jsx
import React, { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../../layouts/AdminLayout';

// Paleta personalizada
const C = {
  tealLight: '#4da4ab',
  tealMid:   '#487e84',
  tealDark:  '#0b545b',
  danger:    '#c0392b',
  warning:   '#f39c12',
};

const roleOptions = ['ALL', 'SUPERADMIN', 'ADMIN', 'STUDENT', 'BLOCKED'];
const typeOptions = ['ALL', 'PROFESOR', 'ESTUDIANTE'];

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [typeFilter, setTypeFilter] = useState('ALL');
  const navigate = useNavigate();

  // Carga inicial de usuarios
  const fetchUsers = async () => {
    try {
      const { data } = await axios.get('http://localhost:8087/uam-carnet-sys/user');
      setUsers(data);
    } catch (err) {
      console.error('Error al cargar usuarios:', err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Filtros de búsqueda
  const filteredUsers = useMemo(() => {
    const term = search.trim().toLowerCase();
    return users.filter(u => {
      const txt = `${u.cif} ${u.names} ${u.surnames}`.toLowerCase();
      if (term && !txt.includes(term)) return false;
      if (roleFilter !== 'ALL' && u.role !== roleFilter) return false;
      if (typeFilter !== 'ALL' && u.type?.toUpperCase() !== typeFilter) return false;
      return true;
    });
  }, [users, search, roleFilter, typeFilter]);

  // Eliminar usuario
  const deleteUser = async cif => {
    if (!window.confirm('¿Eliminar este usuario?')) return;
    try {
      await axios.delete(`http://localhost:8087/uam-carnet-sys/user/${cif}`);
      alert('Usuario eliminado');
      fetchUsers();
    } catch (err) {
      console.error('Error al eliminar usuario:', err);
      alert('No se pudo eliminar el usuario');
    }
  };

  // Promover a ADMIN
  const promoteToAdmin = async targetCif => {
    try {
      const myCif = localStorage.getItem('cif');
      await axios.patch(
          `http://localhost:8087/uam-carnet-sys/admin/${myCif}/promoteToAdmin`,
          { cif: targetCif }
      );
      alert('✅ Usuario promovido a ADMIN');
      fetchUsers();
    } catch (err) {
      console.error('Error al promover:', err);
      alert('No se pudo promover al usuario');
    }
  };

  // Revocar rol ADMIN
  const revokeAdmin = async targetCif => {
    try {
      const myCif = localStorage.getItem('cif');
      await axios.patch(
          `http://localhost:8087/uam-carnet-sys/admin/${myCif}/revokeAdminRole`,
          { cif: targetCif }
      );
      alert('⚠️ Rol ADMIN revocado');
      fetchUsers();
    } catch (err) {
      console.error('Error al revocar:', err);
      alert('No se pudo revocar el rol');
    }
  };

  return (
      <AdminLayout>
        <div className="max-w-6xl mx-auto mt-10 p-6 bg-white rounded shadow">
          <h1 className="text-2xl font-bold mb-6">Gestión de Usuarios</h1>

          <div className="flex flex-wrap items-center gap-2 mb-6">
            <input
                type="text"
                placeholder="Buscar por CIF, nombre o apellido…"
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="border px-3 py-2 rounded flex-grow min-w-[200px]"
            />

            <select
                value={roleFilter}
                onChange={e => setRoleFilter(e.target.value)}
                className="border px-3 py-2 rounded"
            >
              {roleOptions.map(r => (
                  <option key={r} value={r}>
                    {r === 'ALL' ? 'Todos los roles' : r}
                  </option>
              ))}
            </select>

            <select
                value={typeFilter}
                onChange={e => setTypeFilter(e.target.value)}
                className="border px-3 py-2 rounded"
            >
              {typeOptions.map(t => (
                  <option key={t} value={t}>
                    {t === 'ALL' ? 'Todos los tipos' : t}
                  </option>
              ))}
            </select>

            <button
                onClick={() => navigate('/admin/createuser')}
                className="ml-auto text-white px-4 py-2 rounded transition"
                style={{ backgroundColor: C.tealDark }}
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
            {filteredUsers.map(u => (
                <tr key={u.cif} className="border-t hover:bg-gray-50">
                  <td className="p-2">{u.cif}</td>
                  <td className="p-2">{u.names}</td>
                  <td className="p-2">{u.surnames}</td>
                  <td className="p-2">{u.role}</td>
                  <td className="p-2">{u.type}</td>
                  <td className="p-2 space-x-2">
                    <button
                        onClick={() => deleteUser(u.cif)}
                        className="text-white px-3 py-1 rounded transition"
                        style={{ backgroundColor: C.danger }}
                    >
                      Eliminar
                    </button>
                    <button
                        onClick={() => navigate(`/admin/editUser/${u.cif}`)}
                        className="text-white px-3 py-1 rounded transition"
                        style={{ backgroundColor: C.tealMid }}
                    >
                      Editar
                    </button>

                    {['STUDENT', 'BLOCKED'].includes(u.role) && (
                        <button
                            onClick={() => promoteToAdmin(u.cif)}
                            className="text-white px-3 py-1 rounded transition"
                            style={{ backgroundColor: C.tealDark }}
                        >
                          Promover a Admin
                        </button>
                    )}
                    {u.role === 'ADMIN' && (
                        <button
                            onClick={() => revokeAdmin(u.cif)}
                            className="text-white px-3 py-1 rounded transition"
                            style={{ backgroundColor: C.warning }}
                        >
                          Revocar Admin
                        </button>
                    )}
                  </td>
                </tr>
            ))}
            {filteredUsers.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center py-4 text-gray-500">
                    No se encontraron usuarios que coincidan.
                  </td>
                </tr>
            )}
            </tbody>
          </table>
        </div>
      </AdminLayout>
  );
};

export default AdminUsers;