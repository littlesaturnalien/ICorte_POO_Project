import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import StudentLayout from '../../layouts/StudentLayout';

const StudentDashboard = () => {
  const [student, setStudent] = useState(null);
  const [idCard, setIdCard] = useState(null);
  const [picture, setPicture] = useState(null);
  const [requirement, setRequirement] = useState(null);

  const cif = localStorage.getItem('cif');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [stuRes, idcRes, picRes, reqRes] = await Promise.all([
          axios.get(`http://localhost:8087/uam-carnet-sys/student/byCif=${cif}`),
          axios.get('http://localhost:8087/uam-carnet-sys/idcard'),
          axios.get('http://localhost:8087/uam-carnet-sys/picture'),
          axios.get('http://localhost:8087/uam-carnet-sys/requirement'),
        ]);
        console.log('respuesta studentRes.data:', stuRes.data);


        // Extraer el objeto Student real (ResponseApiDTO.data[0] o directo)
        const payload = stuRes.data;
        let studentObj;
        if (payload.data !== undefined) {
          //si es un array, toma el primero elemento, si es un objeto, lo toma directamente
          studentObj = Array.isArray(payload.data)
            ? payload.data[0]
            : payload.data;
        } else {
          studentObj = payload;
        }
        setStudent(studentObj);
        console.log('payload:', payload);
        console.log('studentObj:', studentObj);


        // Buscar ID card, picture y requirement por cif directamente
        setIdCard(idcRes.data.find(c => c.cif === cif) || null);
        setPicture(picRes.data.find(p => p.cif === cif) || null);
        setRequirement(reqRes.data.find(r => r.cif === cif) || null);
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

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">📘 Información Personal</h2>
          <p><strong>CIF:</strong> {student.cif}</p>
          <p><strong>Teléfono:</strong> {student.phoneNumber || 'No registrado'}</p>
          <p><strong>Carrera:</strong> {student.degreeName || 'No registrada'}</p>
          <p><strong>Facultad:</strong> {student.facultyName || 'No registrada'}</p>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">🪪 Estado del Carnet</h2>
          {idCard ? (
            <div>
              <p className="text-blue-600">Solicitud en proceso (Estado: {idCard.status})</p>
            </div>
          ) : (
            <div className="flex items-center space-x-4">
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

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">📷 Fotografía</h2>
          {picture ? (
            <>
              <p><strong>Fecha:</strong> {picture.photoAppointment}</p>
              <a
                className="text-blue-600 underline"
                href={picture.photoUrl}
                target="_blank"
                rel="noreferrer"
              >
                Ver Foto
              </a>
            </>
          ) : (
            <p className="text-yellow-600">Aún no has agendado una cita para tu foto.</p>
          )}
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">📎 Requisitos</h2>
          {requirement ? (
            <p>
              <strong>Comprobante de pago:</strong>{' '}
              <a
                className="text-blue-600 underline"
                href={requirement.paymentProofUrl}
                target="_blank"
                rel="noreferrer"
              >
                Ver Comprobante
              </a>
            </p>
          ) : (
            <p className="text-yellow-600">Aún no has subido tus requisitos.</p>
          )}
        </section>
      </div>
    </StudentLayout>
  );
};

export default StudentDashboard;