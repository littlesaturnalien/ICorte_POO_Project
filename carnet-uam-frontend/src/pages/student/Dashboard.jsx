// src/pages/student/Dashboard.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { format, parseISO, parse } from 'date-fns';
import StudentLayout from '../../layouts/StudentLayout';

function formatDate(dateStr) {
  if (!dateStr) return '';
  let dt;
  if (dateStr.includes('T')) {
    dt = parseISO(dateStr);
  } else {
    dt = parse(dateStr, 'dd-MM-yyyy HH:mm', new Date());
  }
  return isNaN(dt) ? dateStr : format(dt, 'dd-MM-yyyy HH:mm');
}

export default function StudentDashboard() {
  const [student, setStudent] = useState(null);
  const [idCards, setIdCards] = useState([]);
  const [picture, setPicture] = useState(null);
  const [openIdx, setOpenIdx] = useState(null);

  const cif = localStorage.getItem('cif');
  const rawRole = localStorage.getItem('role') || '';
  const userRole = rawRole.toLowerCase();

  useEffect(() => {
    async function fetchData() {
      const [stuRes, idcRes, picRes] = await Promise.all([
        axios.get(`http://localhost:8087/uam-carnet-sys/student/byCif=${cif}`),
        axios.get('http://localhost:8087/uam-carnet-sys/idcard'),
        axios.get('http://localhost:8087/uam-carnet-sys/picture'),
      ]);
      const payload = stuRes.data;
      const stu = payload.data !== undefined
          ? Array.isArray(payload.data) ? payload.data[0] : payload.data
          : payload;
      setStudent(stu);
      setIdCards(idcRes.data.filter(c => c.cif === cif));
      setPicture(picRes.data.find(p => p.cif === cif) || null);
    }
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
            Bienvenido/a, {student.names} {student.surnames}
          </h1>

          {/* Información Académica */}
          <section className="mb-6">
            <h2 className="text-xl font-semibold mb-2">📘 Información Académica</h2>
            <p><strong>CIF:</strong> {student.cif}</p>
            <p><strong>Teléfono:</strong> {student.phoneNumber || 'No registrado'}</p>
            <p className="mt-2 font-semibold">Carrera / Facultad:</p>
            {student.studies?.length ? (
                <ul className="list-disc ml-6">
                  {student.studies.map(s => (
                      <li key={s.degreeId}>
                        {s.degreeName} — <span className="text-gray-500">{s.facultyName}</span>
                      </li>
                  ))}
                </ul>
            ) : (
                <p className="text-yellow-600 ml-6">Sin carreras registradas</p>
            )}
          </section>

          {/* Solicitudes de Carnet */}
          <section className="mb-6">
            <h2 className="text-xl font-semibold mb-2">🪪 Solicitudes de Carnet</h2>
            {idCards.length === 0 && (
                <p className="text-gray-500">Aún no has solicitado un carnet.</p>
            )}
            <div className="space-y-4">
              {idCards.map((c, idx) => (
                  <div key={c.idCardId} className="border rounded-lg">
                    <button
                        onClick={() => setOpenIdx(openIdx === idx ? null : idx)}
                        className="w-full p-4 bg-gray-100 hover:bg-gray-200 flex justify-between items-center rounded-t-lg"
                    >
                  <span className="font-semibold">
                    Semestre {c.semester} {c.year} — {c.status}
                  </span>
                      <span>{openIdx === idx ? '−' : '+'}</span>
                    </button>
                    {openIdx === idx && (
                        <div className="p-4 bg-white space-y-2 rounded-b-lg">
                          <p><strong>Entrega agendada:</strong> {formatDate(c.deliveryAppointment)}</p>
                          {c.notes && <p><strong>Observaciones:</strong> {c.notes}</p>}
                        </div>
                    )}
                  </div>
              ))}
            </div>
            <div className="text-right mt-4">
              <Link
                  to="/student/requestid"
                  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                Solicitar Carnet
              </Link>
            </div>
          </section>

          {/* Fotografía */}
          <section className="mb-6">
            <h2 className="text-xl font-semibold mb-2">📷 Fotografía</h2>
            {picture ? (
                <div className="flex flex-wrap items-center gap-4">
              <span>
                <strong>Foto subida:</strong> {formatDate(picture.uploadedAt)}
              </span>
                  <Link
                      to={picture.photoUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-blue-600 hover:underline"
                  >
                    Ver imagen
                  </Link>
                  <span>
                <strong>Cita agendada:</strong> {formatDate(picture.photoAppointment)}
              </span>
                </div>
            ) : (
                <p className="text-yellow-600">Aún no has agendado cita ni subido foto.</p>
            )}
          </section>

          {/* Volver a Superadmin */}
          {userRole === 'superadmin' && (
              <div className="text-right">
                <Link
                    to="/superadmin/dashboard"
                    className="inline-block bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-800"
                >
                  ← Volver a Superadmin
                </Link>
              </div>
          )}
        </div>
      </StudentLayout>
  );
}
