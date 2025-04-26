import React, { useEffect, useState } from 'react';
import axios from 'axios';
import StudentLayout from '../../layouts/StudentLayout';

const StudentProfile = () => {
  const [user, setUser] = useState(null);
  const [degrees, setDegrees] = useState([]);
  const [newPhone, setNewPhone] = useState('');
  const [selectedDegree, setSelectedDegree] = useState('');

  const cif = localStorage.getItem("cif");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [userRes, degreeRes] = await Promise.all([
          axios.get(`http://localhost:8087/uam-carnet-sys/user/byCif=${cif}`),
          axios.get(`http://localhost:8087/uam-carnet-sys/degree`)
        ]);
        setUser(userRes.data);
        setNewPhone(userRes.data.phoneNumber || '');
        setDegrees(degreeRes.data);
      } catch (err) {
        console.error("Error al cargar perfil:", err);
      }
    };

    fetchData();
  }, [cif]);

  const handlePhoneUpdate = async () => {
    try {
      await axios.patch(`http://localhost:8087/uam-carnet-sys/user/cif=${cif}/setNumber=${newPhone}`);
      alert("Número actualizado exitosamente");
    } catch (err) {
      console.error("Error al actualizar número:", err);
    }
  };

  const handleAddDegree = async () => {
    try {
      await axios.patch(`http://localhost:8087/uam-carnet-sys/user/cif=${cif}/setDegree=${selectedDegree}`);
      alert("Carrera añadida correctamente");
    } catch (err) {
      console.error("Error al añadir carrera:", err);
    }
  };

  const handleRemoveDegree = async (degreeId) => {
    try {
      await axios.patch(`http://localhost:8087/uam-carnet-sys/user/cif=${cif}/removeDegree=${degreeId}`);
      alert("Carrera eliminada");
    } catch (err) {
      console.error("Error al eliminar carrera:", err);
    }
  };

  if (!user) return <StudentLayout><div className="text-center mt-10">Cargando perfil...</div></StudentLayout>;

  return (
    <StudentLayout>
      <div className="max-w-4xl mx-auto mt-10 p-6 bg-white rounded shadow">
        <h1 className="text-2xl font-bold mb-4">Perfil de {user.fullName}</h1>

        <div className="mb-6">
          <label className="block font-semibold mb-1">CIF</label>
          <p className="bg-gray-100 p-2 rounded">{user.cif}</p>
        </div>

        <div className="mb-6">
          <label className="block font-semibold mb-1">Número de Teléfono</label>
          <input
            type="text"
            value={newPhone}
            onChange={(e) => setNewPhone(e.target.value)}
            className="border border-gray-300 rounded p-2 w-full"
          />
          <button
            onClick={handlePhoneUpdate}
            className="mt-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Actualizar Número
          </button>
        </div>

        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">🎓 Carreras Actuales</h2>
          {user.degrees?.length > 0 ? (
            <ul className="list-disc ml-5 space-y-1">
              {user.degrees.map((deg) => (
                <li key={deg.id} className="flex justify-between items-center">
                  {deg.degreeName}
                  <button
                    onClick={() => handleRemoveDegree(deg.id)}
                    className="text-sm text-red-600 hover:underline"
                  >
                    Eliminar
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-yellow-600">No tienes carreras activas.</p>
          )}
        </div>

        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">➕ Añadir Nueva Carrera</h2>
          <select
            className="border border-gray-300 rounded p-2 w-full"
            onChange={(e) => setSelectedDegree(e.target.value)}
            value={selectedDegree}
          >
            <option value="">Seleccione una carrera</option>
            {degrees.map((deg) => (
              <option key={deg.id} value={deg.id}>
                {deg.degreeName}
              </option>
            ))}
          </select>
          <button
            onClick={handleAddDegree}
            className="mt-2 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Añadir Carrera
          </button>
        </div>
      </div>
    </StudentLayout>
  );
};

export default StudentProfile;
