// src/pages/admin/AdminUsers.jsx
import React, { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../../layouts/AdminLayout';

const roleOptions  = ['ALL', 'SUPERADMIN', 'ADMIN', 'STUDENT', 'BLOCKED'];
const typeOptions  = ['ALL', 'PROFESOR', 'ESTUDIANTE'];   // Ajusta según tus valores reales

const AdminUsers = () => {
  const [allUsers, setAllUsers]       = useState([]);
  const [search, setSearch]           = useState('');
  const [roleFilter, setRoleFilter]   = useState('ALL');
  const [typeFilter, setTypeFilter]   = useState('ALL');
  const navigate = useNavigate();

  /* ──────────── Fetch inicial ──────────── */
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const { data } = await axios.get('http://localhost:8087/uam-carnet-sys/user');
        setAllUsers(data);
      } catch (err) {
        console.error('Error al cargar usuarios:', err);
      }
    };
    fetchUsers();
  }, []);

  /* ──────────── Filtro derivado ──────────── */
  const filteredUsers = useMemo(() => {
    const term = search.trim().toLowerCase();

    return allUsers.filter(u => {
      /* texto libre */
      const matchesText =
          !term ||
          u.cif.toLowerCase().includes(term) ||
          u.names.toLowerCase().includes(term) ||
          u.surnames.toLowerCase().includes(term);

      /* rol */
      const matchesRole =
          roleFilter === 'ALL' || u.role === roleFilter;

      /* tipo */
      const matchesType =
          typeFilter === 'ALL' || u.type?.toUpperCase() === typeFilter;

      return matchesText && matchesRole && matchesType;
    });
  }, [allUsers, search, roleFilter, typeFilter]);

  /* ──────────── Acciones (delete / promote / revoke) ──────────── */
  const deleteUser = async cif => { /* …igual que antes… */ };
  const promoteToAdmin = async cif => { /* …igual… */ };
  const revokeAdmin   = async cif => { /* …igual… */ };

  /* ──────────── Render ──────────── */
  return (
      <AdminLayout>
        <div className="max-w-6xl mx-auto mt-10 p-6 bg-white rounded shadow">
          <h1 className="text-2xl font-bold mb-6">Gestión de Usuarios</h1>

          {/* --- Barra de filtros --- */}
          <div className="flex flex-wrap items-center gap-2 mb-6">
            <input
                type="text"
                placeholder="Buscar por CIF, nombre o apellido…"
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="border px-3 py-2 rounded flex-grow min-w-[200px]"
            />

            {/* Filtro de Rol */}
            <select
                value={roleFilter}
                onChange={e => setRoleFilter(e.target.value)}
                className="border px-3 py-2 rounded"
            >
              {roleOptions.map(r => (
                  <option key={r} value={r}>{r === 'ALL' ? 'Todos los roles' : r}</option>
              ))}
            </select>

            {/* Filtro de Tipo */}
            <select
                value={typeFilter}
                onChange={e => setTypeFilter(e.target.value)}
                className="border px-3 py-2 rounded"
            >
              {typeOptions.map(t => (
                  <option key={t} value={t}>{t === 'ALL' ? 'Todos los tipos' : t}</option>
              ))}
            </select>

            <button
                onClick={() => navigate('/admin/createuser')}
                className="ml-auto bg-green-600 text-white px-4 py-2 rounded"
            >
              Crear Usuario
            </button>
          </div>

          {/* --- Tabla --- */}
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
                        className="bg-red-600 text-white px-3 py-1 rounded">
                      Eliminar
                    </button>
                    <button
                        onClick={() => navigate(`/admin/editUser/${u.cif}`)}
                        className="bg-indigo-600 text-white px-3 py-1 rounded hover:bg-indigo-700">
                      Editar
                    </button>

                    {['STUDENT', 'BLOCKED'].includes(u.role) && (
                        <button
                            onClick={() => promoteToAdmin(u.cif)}
                            className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700">
                          Promover a Admin
                        </button>
                    )}
                    {u.role === 'ADMIN' && (
                        <button
                            onClick={() => revokeAdmin(u.cif)}
                            className="bg-yellow-600 text-white px-3 py-1 rounded hover:bg-yellow-700">
                          Revocar Admin
                        </button>
                    )}
                  </td>
                </tr>
            ))}

            {!filteredUsers.length && (
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