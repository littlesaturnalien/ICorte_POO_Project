import React, { useEffect, useState } from 'react';
import axios from 'axios';
import StudentLayout from '../../layouts/StudentLayout';

const StudentDashboard = () => {
  const [student, setStudent] = useState(null);
  const [idCard, setIdCard] = useState(null);
  const [picture, setPicture] = useState(null);
  const [requirement, setRequirement] = useState(null);

  const cif = localStorage.getItem("cif");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [studentRes, idcardRes, picRes, reqRes] = await Promise.all([
          axios.get(`http://localhost:8087/uam-carnet-sys/student/byCif=${cif}`),
          axios.get(`http://localhost:8087/uam-carnet-sys/idcard`),
          axios.get(`http://localhost:8087/uam-carnet-sys/picture`),
          axios.get(`http://localhost:8087/uam-carnet-sys/requirement`)
        ]);

        setStudent(studentRes.data);
        setIdCard(idcardRes.data.find(c => c.user.cif === cif));
        setPicture(picRes.data.find(p => p.user.cif === cif));
        setRequirement(reqRes.data.find(r => r.user.cif === cif));
      } catch (error) {
        console.error("Error al cargar datos del dashboard:", error);
      }
    };

    fetchData();
  }, [cif]);

  if (!student) return <StudentLayout><div className="text-center mt-10">Cargando información...</div></StudentLayout>;

  return (
    <StudentLayout>
      <div className="max-w-4xl mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg">
        <h1 className="text-2xl font-bold mb-4">Bienvenido, {student.fullName}</h1>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">📘 Información Personal</h2>
          <p><strong>CIF:</strong> {student.cif}</p>
          <p><strong>Teléfono:</strong> {student.phoneNumber || "No registrado"}</p>
          <p><strong>Carrera:</strong> {student.degreeName}</p>
          <p><strong>Facultad:</strong> {student.facultyName}</p>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">🪪 Estado del Carnet</h2>
          {idCard ? (
            <div>
              <p><strong>Estado:</strong> {idCard.status}</p>
              <p><strong>Cita de Entrega:</strong> {idCard.deliveryAppointment || "No asignada"}</p>
            </div>
          ) : (
            <p className="text-yellow-600">No has solicitado un carnet aún.</p>
          )}
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">📷 Fotografía</h2>
          {picture ? (
            <>
              <p><strong>Fecha:</strong> {picture.photoAppointment}</p>
              <a className="text-blue-600 underline" href={picture.photoUrl} target="_blank" rel="noreferrer">
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
            <>
              <p><strong>Comprobante de pago:</strong> 
                <a className="text-blue-600 underline ml-1" href={requirement.paymentProofUrl} target="_blank" rel="noreferrer">
                  Ver Comprobante
                </a>
              </p>
            </>
          ) : (
            <p className="text-yellow-600">Aún no has subido tus requisitos.</p>
          )}
        </section>
      </div>
    </StudentLayout>
  );
};

export default StudentDashboard;
