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

  /* ───────────── Normalizar carreras ───────────── */
  const buildDegreeOptions = stu => {
    if (Array.isArray(stu.studies) && stu.studies.length) {
      return stu.studies.map(s => ({
        id: s.degreeId,
        name: `${s.degreeName} — ${s.facultyName}`,
      }));
    }
    if (Array.isArray(stu.degrees) && stu.degrees.length) {
      return []; // sin IDs reales → deshabilita solicitud
    }
    if (stu.degreeId && stu.degreeName) {
      return [{ id: stu.degreeId, name: stu.degreeName }];
    }
    return [];
  };

  /* ───────────── Fetch estudiante ───────────── */
  useEffect(() => {
    if (!cif) return;
    (async () => {
      try {
        const res = await axios.get(
            `http://localhost:8087/uam-carnet-sys/student/byCif=${cif}`
        );
        const payload = res.data;
        const stu = payload.data
            ? Array.isArray(payload.data) ? payload.data[0] : payload.data
            : payload;

        setStudent(stu);

        const opts = buildDegreeOptions(stu);
        if (opts.length) {
          setForm(f => ({ ...f, selectedDegreeId: String(opts[0].id) }));
        }
      } catch (err) {
        console.error('Error al cargar estudiante:', err);
      }
    })();
  }, [cif]);

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

  const toLocalDateTimeString = iso => {
    // "2025-05-07T15:20" → "07-05-2025 15:20"
    const [ymd, hm] = iso.split('T');
    const [Y, M, D] = ymd.split('-');
    return `${D}-${M}-${Y} ${hm}`;
  };

  const handleSubmit = async e => {
    e.preventDefault();

    if (!degreeOptions.length) {
      return alert('No se encontró una carrera válida. Contacta a soporte.');
    }
    if (!form.selectedDegreeId) return alert('Selecciona una carrera.');
    if (!form.photoAppointment || !form.photoUrl || !form.paymentProofUrl) {
      return alert('Todos los campos son obligatorios.');
    }

    const formattedDate = toLocalDateTimeString(form.photoAppointment);

    try {
      /* ─── FOTO (upsert) ─── */
      const { data: allPics } = await axios.get(
          'http://localhost:8087/uam-carnet-sys/picture'
      );
      const existingPic = allPics.find(p => p.cif === cif);

      let pictureId;
      if (existingPic) {
        const { data: upd } = await axios.put(
            `http://localhost:8087/uam-carnet-sys/picture/${existingPic.pictureId}`,
            { cif, photoAppointment: formattedDate, photoUrl: form.photoUrl }
        );
        pictureId = upd.pictureId;
      } else {
        const { data: created } = await axios.post(
            'http://localhost:8087/uam-carnet-sys/picture',
            { cif, photoAppointment: formattedDate, photoUrl: form.photoUrl }
        );
        pictureId = created.pictureId;
      }

      /* ─── REQUISITO (upsert) ─── */
      const { data: allReqs } = await axios.get(
          'http://localhost:8087/uam-carnet-sys/requirement'
      );
      const existingReq = allReqs.find(r => r.pictureId === pictureId);

      let requirementId;
      if (existingReq) {
        const { data: upd } = await axios.put(
            `http://localhost:8087/uam-carnet-sys/requirement/${existingReq.requirementId}`,
            { cif, pictureId, paymentProofUrl: form.paymentProofUrl }
        );
        requirementId = upd.requirementId;
      } else {
        const { data: created } = await axios.post(
            'http://localhost:8087/uam-carnet-sys/requirement',
            { cif, pictureId, paymentProofUrl: form.paymentProofUrl }
        );
        requirementId = created.requirementId;
      }

      /* ─── SOLICITUD DE CARNET ─── */
      await axios.post('http://localhost:8087/uam-carnet-sys/idcard', {
        cif,
        semester: form.semester,
        selectedDegreeId: Number(form.selectedDegreeId),
        requirementId,
        deliveryAppointment: formattedDate, // patrón dd-MM-yyyy HH:mm
      });

      navigate('/student/dashboard', { replace: true });
    } catch (err) {
      console.error('Error completo:', err);
      alert(
          'Error al procesar la solicitud:\n' +
          JSON.stringify(err.response?.data || err.message, null, 2)
      );
    }
  };

  /* ───────────── Render ───────────── */
  return (
      <StudentLayout>
        <div className="max-w-2xl mx-auto mt-10 p-6 bg-white shadow rounded">
          <h1 className="text-2xl font-bold mb-6">Solicitar Carnet</h1>

          {!degreeOptions.length && (
              <div className="p-4 mb-6 bg-yellow-100 text-yellow-800 rounded">
                No se encontró un identificador de carrera válido asociado a tu
                perfil. Por favor contacta a soporte.
              </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* ▸ Carreras */}
            <div>
              <label className="block font-medium mb-1">Carrera</label>
              <select
                  name="selectedDegreeId"
                  value={form.selectedDegreeId}
                  onChange={handleChange}
                  required
                  className="w-full border rounded p-2 disabled:bg-gray-100"
                  disabled={!degreeOptions.length}
              >
                {degreeOptions.map(opt => (
                    <option key={opt.id} value={String(opt.id)}>
                      {opt.name}
                    </option>
                ))}
              </select>
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
                    <option key={year} value={year}>
                      {year}
                    </option>
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
              <label className="block font-medium mb-1">
                Fecha y Hora de Cita de Foto
              </label>
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
              <label className="block font-medium mb-1">
                URL del Comprobante de Pago
              </label>
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
                disabled={!degreeOptions.length}
                className="w-full bg-[#0099A8] text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50"
            >
              Enviar Solicitud
            </button>
          </form>
        </div>
      </StudentLayout>
  );
};

export default RequestIDCard;