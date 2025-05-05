// src/pages/student/Profile.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import StudentLayout from '../../layouts/StudentLayout';

const StudentProfile = () => {
  const [user, setUser] = useState(null);
  const [editing, setEditing] = useState(false);
  const [newPhone, setNewPhone] = useState('');

  const cif = localStorage.getItem('cif');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(`http://localhost:8087/uam-carnet-sys/student/byCif=${cif}`);
        const raw = res.data;
        const student = raw.data
            ? Array.isArray(raw.data) ? raw.data[0] : raw.data
            : raw;
        setUser(student);
      } catch (err) {
        console.error('Error al cargar perfil:', err);
      }
    };
    fetchProfile();
  }, [cif]);

  const savePhone = async () => {
    try {
      await axios.patch(
          `http://localhost:8087/uam-carnet-sys/user/cif=${cif}/setNumber=${newPhone}`
      );
      setUser({ ...user, phoneNumber: newPhone });
      setEditing(false);
      setNewPhone('');
      alert('Número actualizado exitosamente');
    } catch (err) {
      console.error('Error al actualizar número:', err);
      alert('Error al actualizar número');
    }
  };

  if (!user) {
    return (
        <StudentLayout>
          <div className="text-center mt-10">Cargando perfil...</div>
        </StudentLayout>
    );
  }

  return (
      <StudentLayout>
        <div className="max-w-4xl mx-auto mt-10 p-6 bg-white rounded shadow">
          <h1 className="text-2xl font-bold mb-6">
            Perfil de {user.names} {user.surnames}
          </h1>

          <section className="mb-8 space-y-2">
            <h2 className="text-xl font-semibold mb-2">👤 Información</h2>
            <p className="mb-2"><strong>CIF:</strong> {user.cif}</p>
            <p className="mb-2"><strong>Email:</strong> {user.email}</p>
            <p className="flex items-center space-x-4 mb-2">
              <strong>Teléfono:</strong>
              {!editing ? (
                  <>
                    <span>{user.phoneNumber || 'No registrado'}</span>
                    <button
                        onClick={() => {
                          setNewPhone(user.phoneNumber || '');
                          setEditing(true);
                        }}
                        className="ml-4 bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                    >
                      Editar
                    </button>
                  </>
              ) : (
                  <div className="flex items-center space-x-2">
                    <input
                        type="text"
                        value={newPhone}
                        onChange={e => setNewPhone(e.target.value)}
                        className="border border-gray-300 rounded p-1"
                    />
                    <button
                        onClick={savePhone}
                        className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                    >
                      Guardar
                    </button>
                    <button
                        onClick={() => setEditing(false)}
                        className="bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-600"
                    >
                      Cancelar
                    </button>
                  </div>
              )}
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-xl font-semibold mb-2">🎓 Carreras / Facultades</h2>
            {user.studies?.length ? (
                <ul className="list-disc ml-5 space-y-1">
                  {user.studies.map(s => (
                      <li key={s.degreeId}>
                        {s.degreeName} — <span className="text-gray-500">{s.facultyName}</span>
                      </li>
                  ))}
                </ul>
            ) : (
                <p className="text-yellow-600">No tienes carreras activas.</p>
            )}
          </section>
        </div>
      </StudentLayout>
  );
};

export default StudentProfile;
