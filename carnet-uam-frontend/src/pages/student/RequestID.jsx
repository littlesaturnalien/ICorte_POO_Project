// src/pages/student/RequestIDCard.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import StudentLayout from '../../layouts/StudentLayout';

const RequestIDCard = () => {
  const navigate = useNavigate();
  const cif = localStorage.getItem('cif');

  const [student, setStudent] = useState(null);
  const [form, setForm] = useState({
    selectedDegreeId: '',
    academicYear: '',
    semester: 'I',
    photoAppointment: '',
    photoUrl: '',
    paymentProofUrl: '',
  });

  /* ───────────── Fetch del estudiante ───────────── */
  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const { data } = await axios.get(
            `http://localhost:8087/uam-carnet-sys/student/byCif=${cif}`
        );
        const stu = data.data
            ? Array.isArray(data.data) ? data.data[0] : data.data
            : data;

        setStudent(stu);

        /*  ▸ Preselecciona la primera carrera disponible  */
        const opts = buildDegreeOptions(stu);
        if (opts.length) {
          setForm(f => ({ ...f, selectedDegreeId: opts[0].id }));
        }
      } catch (err) {
        console.error('Error al cargar estudiante:', err);
      }
    };
    fetchStudent();
  }, [cif]);

  /* ───────────── Helper para normalizar carreras ───────────── */
  const buildDegreeOptions = stu => {
    /* 1. Formato nuevo ─ studies */
    if (Array.isArray(stu.studies) && stu.studies.length) {
      return stu.studies.map(s => ({
        id: s.degreeId,
        name: `${s.degreeName} — ${s.facultyName}`,
      }));
    }

    /* 2. Formato antiguo ─ degrees (strings u objetos) */
    if (Array.isArray(stu.degrees) && stu.degrees.length) {
      return stu.degrees.map((d, idx) =>
          typeof d === 'object'
              ? { id: d.id ?? d.degreeId ?? idx + 1, name: d.name ?? d.degreeName }
              : { id: idx + 1, name: d }              // solo nombre, sin id real
      );
    }

    /* 3. Fallback legacy (un solo par id‑nombre) */
    if (stu.degreeId && stu.degreeName) {
      return [{ id: stu.degreeId, name: stu.degreeName }];
    }

    return [];
  };

  if (!student) {
    return (
        <StudentLayout>
          <div className="text-center mt-10">Cargando formulario...</div>
        </StudentLayout>
    );
  }

  const degreeOptions = buildDegreeOptions(student);

  /* ───────────── Handlers ───────────── */
  const handleChange = e => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!form.selectedDegreeId) {
      return alert('Por favor selecciona una carrera.');
    }
    if (!form.academicYear) {
      return alert('Por favor selecciona el año de la carrera.');
    }

    try {
      /* 1. Fotografía */
      const picRes = await axios.post(
          'http://localhost:8087/uam-carnet-sys/picture',
          { cif, photoAppointment: form.photoAppointment, photoUrl: form.photoUrl }
      );
      const pictureId = picRes.data.data?.id ?? picRes.data.id;

      /* 2. Requisitos */
      const reqRes = await axios.post(
          'http://localhost:8087/uam-carnet-sys/requirement',
          { cif, pictureId, paymentProofUrl: form.paymentProofUrl }
      );
      const requirementId = reqRes.data.data?.id ?? reqRes.data.id;

      /* 3. Solicitud de carnet */
      await axios.post(
          'http://localhost:8087/uam-carnet-sys/idcard',
          {
            cif,
            semester: form.semester,
            academicYear: form.academicYear,
            requirementId,
            degreeId: form.selectedDegreeId,
            deliveryAppointment: form.photoAppointment,
          }
      );

      navigate('/student/dashboard', { replace: true });
    } catch (err) {
      console.error('Error al solicitar carnet:', err);
      alert('Hubo un error al procesar tu solicitud.');
    }
  };

  /* ───────────── Render ───────────── */
  return (
      <StudentLayout>
        <div className="max-w-2xl mx-auto mt-10 p-6 bg-white shadow rounded">
          <h1 className="text-2xl font-bold mb-6">Solicitar Carnet</h1>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* ▸ Carreras */}
            <div>
              <label className="block font-medium mb-1">Carrera</label>
              {degreeOptions.length ? (
                  <select
                      name="selectedDegreeId"
                      value={form.selectedDegreeId}
                      onChange={handleChange}
                      required
                      className="w-full border rounded p-2"
                  >
                    {degreeOptions.map(opt => (
                        <option key={opt.id} value={opt.id}>
                          {opt.name}
                        </option>
                    ))}
                  </select>
              ) : (
                  <p className="text-red-600">No se encontraron carreras</p>
              )}
            </div>

            {/* ▸ Año de Carrera */}
            <div>
              <label className="block font-medium mb-1">Año de Carrera</label>
              <select
                  name="academicYear"
                  value={form.academicYear}
                  onChange={handleChange}
                  required
                  className="w-full border rounded p-2"
              >
                <option value="">Seleccione año...</option>
                {[1, 2, 3, 4, 5].map(year => (
                    <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>

            {/* ▸ Semestre */}
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

            {/* ▸ Cita de Foto */}
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

            {/* ▸ URL Foto */}
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

            {/* ▸ URL Comprobante */}
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
                className="w-full bg-[#0099A8] text-white py-2 rounded hover:bg-blue-700"
            >
              Enviar Solicitud
            </button>
          </form>
        </div>
      </StudentLayout>
  );
};

export default RequestIDCard;