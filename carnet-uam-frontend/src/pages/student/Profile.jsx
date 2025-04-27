// src/pages/student/Profile.jsx

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import StudentLayout from '../../layouts/StudentLayout';

const StudentProfile = () => {
  const [user, setUser] = useState(null);
  const [newPhone, setNewPhone] = useState('');

  const cif = localStorage.getItem('cif');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const studentRes = await axios.get(`http://localhost:8087/uam-carnet-sys/student/byCif=${cif}`);
        const raw = studentRes.data;
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
        <h1 className="text-2xl font-bold mb-4">
          Perfil de {user.fullName}
        </h1>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">👤 Información</h2>
          <p><strong>CIF:</strong> {user.cif}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Teléfono:</strong> {user.phoneNumber}</p>
          <p><strong>Carrera:</strong> {user.degreeName}</p>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">📞 Teléfono</h2>
          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={newPhone}
              onChange={e => setNewPhone(e.target.value)}
              className="border border-gray-300 rounded p-2 flex-grow"
            />
            <button
              onClick={async () => {
                try {
                  await axios.patch(
                    `http://localhost:8087/uam-carnet-sys/user/cif=${cif}/setNumber=${newPhone}`
                  );
                  alert('Número actualizado exitosamente');
                } catch (err) {
                  console.error('Error al actualizar número:', err);
                }
              }}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Actualizar
            </button>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">🎓 Carreras Actuales</h2>
          {user.degrees && user.degrees.length > 0 ? (
            <ul className="list-disc ml-5 space-y-1">
              {user.degrees.map((deg, idx) => {
                const key = typeof deg === 'object' ? deg.id : `${deg}-${idx}`;
                const label = typeof deg === 'object' ? deg.degreeName : deg;
                return (
                  <li key={key} className="flex justify-between items-center">
                    {label}
                    <button
                      onClick={async () => {
                        const idToRemove = typeof deg === 'object' ? deg.id : label;
                        try {
                          await axios.patch(
                            `http://localhost:8087/uam-carnet-sys/user/cif=${cif}/removeDegree=${idToRemove}`
                          );
                          alert('Carrera eliminada');
                        } catch (err) {
                          console.error('Error al eliminar carrera:', err);
                        }
                      }}
                      className="text-sm text-red-600 hover:underline"
                    >
                      Eliminar
                    </button>
                  </li>
                );
              })}
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
