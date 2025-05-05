// src/pages/student/Dashboard.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { format, parseISO, parse } from 'date-fns';
import StudentLayout from '../../layouts/StudentLayout';

function formatDate(dateStr) {
  if (!dateStr) return '';

  let dt;
  // Si viene en formato ISO “YYYY-MM-DDTHH:mm…”
  if (dateStr.includes('T')) {
    dt = parseISO(dateStr);
  } else {
    // Si viene en “dd-MM-yyyy HH:mm”
    dt = parse(dateStr, 'dd-MM-yyyy HH:mm', new Date());
  }

  // Si parse falla, devolvemos la cadena original
  if (isNaN(dt)) {
    return dateStr;
  }

  return format(dt, 'dd-MM-yyyy HH:mm');
}

const StudentDashboard = () => {
  const [student, setStudent] = useState(null);
  const [idCard, setIdCard] = useState(null);
  const [picture, setPicture] = useState(null);
  const [requirement, setRequirement] = useState(null);

  const cif = localStorage.getItem('cif');
  const rawRole = localStorage.getItem('role') || '';
  const userRole = rawRole.toLowerCase();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [stuRes, idcRes, picRes, reqRes] = await Promise.all([
          axios.get(`http://localhost:8087/uam-carnet-sys/student/byCif=${cif}`),
          axios.get('http://localhost:8087/uam-carnet-sys/idcard'),
          axios.get('http://localhost:8087/uam-carnet-sys/picture'),
          axios.get('http://localhost:8087/uam-carnet-sys/requirement'),
        ]);

        const payload = stuRes.data;
        const studentObj =
            payload.data !== undefined
                ? Array.isArray(payload.data) ? payload.data[0] : payload.data
                : payload;
        setStudent(studentObj);

        setIdCard(idcRes.data.find((c) => c.cif === cif) || null);
        setPicture(picRes.data.find((p) => p.cif === cif) || null);
        setRequirement(reqRes.data.find((r) => r.cif === cif) || null);
      } catch (error) {
        console.error('Error al cargar datos del dashboard:', error);
      }
    };
    fetchData();
  }, [cif]);

  if (!student) {
    return (
        <StudentLayout>
          <div className="text-center mt-10">Cargando información...</div>
        </StudentLayout>
    );
  }

  return (
      <StudentLayout>
        <div className="max-w-4xl mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg">
          <h1 className="text-2xl font-bold mb-4">
            Bienvenido, {student.names} {student.surnames}
          </h1>

          {/* Información Académica */}
          <section className="mb-6">
            <h2 className="text-xl font-semibold mb-2">📘 Información Académica</h2>
            <p><strong>CIF:</strong> {student.cif}</p>
            <p><strong>Teléfono:</strong> {student.phoneNumber || 'No registrado'}</p>
            <p className="mt-2 font-semibold">Carrera / Facultad:</p>
            {student.studies?.length ? (
                <ul className="list-disc ml-6">
                  {student.studies.map((s) => (
                      <li key={s.degreeId}>
                        {s.degreeName} — <span className="text-gray-500">{s.facultyName}</span>
                      </li>
                  ))}
                </ul>
            ) : (
                <p className="text-yellow-600 ml-6">Sin carreras registradas</p>
            )}
          </section>

          {/* Estado del Carnet */}
          <section className="mb-6">
            <h2 className="text-xl font-semibold mb-2">🪪 Estado del Carnet</h2>
            {idCard ? (
                <p className="text-blue-600">Solicitud en proceso (Estado: {idCard.status})</p>
            ) : (
                <div className="flex items-center justify-between">
                  <p className="text-yellow-600">No has solicitado un carnet aún.</p>
                  <Link
                      to="/student/requestid"
                      className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                  >
                    Solicitar Carnet
                  </Link>
                </div>
            )}
          </section>

          {/* Fotografía y Cita */}
          <section className="mb-6">
            <h2 className="text-xl font-semibold mb-2">📷 Fotografía</h2>
            {idCard?.deliveryAppointment ? (
                <p>Cita agendada: {formatDate(idCard.deliveryAppointment)}</p>
            ) : picture ? (
                <>
                  <p>Foto subida: {formatDate(picture.uploadedAt)}</p>
                  <a href={picture.photoUrl} target="_blank" rel="noreferrer">
                    Ver imagen
                  </a>
                </>
            ) : (
                <p className="text-yellow-600">
                  Aún no has agendado cita ni subido foto.
                </p>
            )}
          </section>

          {/* Botón Volver a Superadmin */}
          {userRole === 'superadmin' && (
              <div className="text-right">
                <Link
                    to="/superadmin/dashboard"
                    className="inline-block bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-800 transition"
                >
                  ← Volver a Superadmin
                </Link>
              </div>
          )}
        </div>
      </StudentLayout>
  );
};

export default StudentDashboard;
