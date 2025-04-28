// src/pages/student/RequestIDCard.jsx

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import StudentLayout from '../../layouts/StudentLayout';

const RequestIDCard = () => {
  const [student, setStudent] = useState(null);
  const [form, setForm] = useState({
    semester: 'I',
    photoAppointment: '',
    photoUrl: '',
    paymentProofUrl: '',
    selectedDegreeId: '',
  });
  const navigate = useNavigate();
  const cif = localStorage.getItem('cif');

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const res = await axios.get(`http://localhost:8087/uam-carnet-sys/student/byCif=${cif}`);
        const raw = res.data;
        const stu = raw.data 
          ? Array.isArray(raw.data) 
            ? raw.data[0] 
            : raw.data 
          : raw;
        setStudent(stu);
        if (stu.degrees?.[0]?.id) {
          setForm(f => ({ ...f, selectedDegreeId: stu.degrees[0].id }));
        }
      } catch (err) {
        console.error('Error al cargar estudiante:', err);
      }
    };
    fetchStudent();
  }, [cif]);

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      // 1) Crear fotografía
      const picRes = await axios.post('http://localhost:8087/uam-carnet-sys/picture', {
        cif,
        photoAppointment: form.photoAppointment,
        photoUrl: form.photoUrl,
      });
      const pictureId = picRes.data.data?.id ?? picRes.data.id;

      // 2) Crear requisito
      const reqRes = await axios.post('http://localhost:8087/uam-carnet-sys/requirement', {
        cif,
        pictureId,
        paymentProofUrl: form.paymentProofUrl,
      });
      const requirementId = reqRes.data.data?.id ?? reqRes.data.id;

      // 3) Solicitar carnet
      await axios.post('http://localhost:8087/uam-carnet-sys/idcard', {
        cif,
        semester: form.semester,
        requirementId,
        selectedDegreeId: form.selectedDegreeId,
        deliveryAppointment: form.photoAppointment,
      });

      // Redirigir a dashboard y recargar
      navigate('/student/dashboard', { replace: true });
    } catch (err) {
      console.error('Error al solicitar carnet:', err);
      alert('Hubo un error al procesar tu solicitud.');
    }
  };

  if (!student) {
    return (
      <StudentLayout>
        <div className="text-center mt-10">Cargando formulario...</div>
      </StudentLayout>
    );
  }

  return (
    <StudentLayout>
      <div className="max-w-2xl mx-auto mt-10 p-6 bg-white shadow rounded">
        <h1 className="text-2xl font-bold mb-6">Solicitar Carnet</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-medium mb-1">Semestre</label>
            <select
              name="semester"
              value={form.semester}
              onChange={handleChange}
              className="w-full border rounded p-2"
            >
              <option value="I">I</option>
              <option value="II">II</option>
            </select>
          </div>

          <div>
            <label className="block font-medium mb-1">Carrera</label>
            <input
              type="text"
              value={student.degrees?.[0]?.degreeName || ''}
              disabled
              className="w-full border rounded p-2 bg-gray-100"
            />
          </div>

          <div>
            <label className="block font-medium mb-1">Fecha y Hora de Cita de Foto</label>
            <input
              type="datetime-local"
              name="photoAppointment"
              value={form.photoAppointment}
              onChange={handleChange}
              required
              className="w-full border rounded p-2"
            />
          </div>

          <div>
            <label className="block font-medium mb-1">URL de la Foto</label>
            <input
              type="url"
              name="photoUrl"
              value={form.photoUrl}
              onChange={handleChange}
              placeholder="https://drive.google.com/..."
              required
              className="w-full border rounded p-2"
            />
          </div>

          <div>
            <label className="block font-medium mb-1">URL del Comprobante de Pago</label>
            <input
              type="url"
              name="paymentProofUrl"
              value={form.paymentProofUrl}
              onChange={handleChange}
              placeholder="https://drive.google.com/..."
              required
              className="w-full border rounded p-2"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          >
            Enviar Solicitud
          </button>
        </form>
      </div>
    </StudentLayout>
  );
};

export default RequestIDCard;
