import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AdminLayout from '../../layouts/AdminLayout'; // Asegúrate de tener este layout creado

const Students = () => {
  const [students, setStudents] = useState([]);

  const fetchStudents = async () => {
    try {
      const res = await axios.get(`http://localhost:8087/uam-carnet-sys/student`);
      setStudents(res.data);
    } catch (err) {
      console.error("Error cargando estudiantes:", err);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  return (
    <AdminLayout>
      <div className="max-w-6xl mx-auto mt-10 p-6 bg-white rounded shadow">
        <h1 className="text-2xl font-bold mb-4">Estudiantes Registrados</h1>
        <table className="w-full table-auto border text-left">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2">CIF</th>
              <th className="p-2">Nombre</th>
              <th className="p-2">Carrera</th>
              <th className="p-2">Facultad</th>
              <th className="p-2">Carnet</th>
            </tr>
          </thead>
          <tbody>
            {students.map((s) => (
              <tr key={s.cif} className="border-t">
                <td className="p-2">{s.cif}</td>
                <td className="p-2">{s.fullName}</td>
                <td className="p-2">{s.degreeName}</td>
                <td className="p-2">{s.facultyName}</td>
                <td className="p-2">{s.idCardStatus}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
};

export default Students;
