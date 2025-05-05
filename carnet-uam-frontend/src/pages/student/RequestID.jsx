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

  const buildDegreeOptions = stu => {
    if (Array.isArray(stu.studies) && stu.studies.length) {
      return stu.studies.map(s => ({
        id: s.degreeId,
        name: `${s.degreeName} — ${s.facultyName}`,
      }));
    }
    if (Array.isArray(stu.degrees) && stu.degrees.length) {
      return stu.degrees.map((d, idx) =>
        typeof d === 'object'
          ? { id: d.id ?? d.degreeId ?? idx + 1, name: d.name ?? d.degreeName }
          : { id: idx + 1, name: d }
      );
    }
    if (stu.degreeId && stu.degreeName) {
      return [{ id: stu.degreeId, name: stu.degreeName }];
    }
    return [];
  };

  /* ───────────── Fetch del estudiante ───────────── */
  useEffect(() => {
    if (!cif) return;
    (async () => {
      try {
        const res = await axios.get(
          `http://localhost:8087/uam-carnet-sys/student/byCif=${cif}`
        );
        const payload = res.data;
        const stu = payload.data
          ? (Array.isArray(payload.data) ? payload.data[0] : payload.data)
          : payload;
        setStudent(stu);

        // Ahora sí podemos usar buildDegreeOptions
        const opts = buildDegreeOptions(stu);
        setForm(f => ({
          ...f,
          selectedDegreeId: opts.length ? String(opts[0].id) : '',
        }));
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

  /* ───────────── Helper para normalizar carreras ───────────── */
  

  const degreeOptions = buildDegreeOptions(student);

  /* ───────────── Handlers ───────────── */
  const handleChange = e => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
  
    // 0) Validaciones
    if (!form.selectedDegreeId) {
      return alert('Por favor selecciona una carrera.');
    }
    if (!form.academicYear) {
      return alert('Por favor selecciona el año de la carrera.');
    }
    if (!form.photoAppointment || !form.photoUrl || !form.paymentProofUrl) {
      return alert('Todos los campos son obligatorios.');
    }
  
    // 1) Formatear la cita a "dd-MM-yyyy HH:mm"
    const [ymd, hm] = form.photoAppointment.split('T');      // ["2025-05-05","16:52"]
    const [Y, M, D] = ymd.split('-');                        // ["2025","05","05"]
    const formatted = `${D}-${M}-${Y} ${hm}`;                // "05-05-2025 16:52"
  
    try {
      // ────── FOTO (upsert) ──────
      let pictureId;
      // 1a) Busco todas las fotos y veo si ya hay una para este cif
      const { data: allPics } = await axios.get('http://localhost:8087/uam-carnet-sys/picture');
      const existing = allPics.find(p => p.cif === cif);
  
      if (existing) {
        // 1b) Si existe, la actualizo
        console.log('✏️ Actualizando foto existente, id=', existing.pictureId);
        const { data: updated } = await axios.put(
          `http://localhost:8087/uam-carnet-sys/picture/${existing.pictureId}`,
          {
            cif,
            photoAppointment: formatted,
            photoUrl: form.photoUrl,
          }
        );
        pictureId = updated.pictureId;
      } else {
        // 1c) Si no existe, la creo
        console.log('▶️ Creando nueva foto…');
        const { data: created } = await axios.post(
          'http://localhost:8087/uam-carnet-sys/picture',
          {
            cif,
            photoAppointment: formatted,
            photoUrl: form.photoUrl,
          }
        );
        pictureId = created.pictureId;
      }
      console.log('✅ pictureId final =', pictureId);
  
      if (!pictureId) {
        throw new Error('No pudimos obtener pictureId');
      }
  
      // ────── REQUISITO ──────
      console.log('▶️ POST /requirement', { cif, pictureId, paymentProofUrl: form.paymentProofUrl });
      const { data: reqData } = await axios.post(
        'http://localhost:8087/uam-carnet-sys/requirement',
        {
          cif,
          pictureId,
          paymentProofUrl: form.paymentProofUrl,
        }
      );
      // ───── REQUISITO (upsert) ─────
      let requirementId;
      // 1) Traigo todos los requisitos y busco el que tenga el mismo pictureId
      const { data: allReqs } = await axios.get(
        'http://localhost:8087/uam-carnet-sys/requirement'
      );
      const existingReq = allReqs.find(r => r.fotoId === pictureId);
      
      if (existingReq) {
        // 2a) Si existe, lo actualizo vía PUT
        console.log('✏️ Actualizando requisito existente, id=', existingReq.requirementId);
        const { data: upd } = await axios.put(
          `http://localhost:8087/uam-carnet-sys/requirement/${existingReq.requirementId}`,
          {
            cif,
            fotoId: pictureId,
            paymentProofUrl: form.paymentProofUrl,
          }
        );
        requirementId = upd.requirementId;
      } else {
        // 2b) Si no existe, lo creo vía POST
        console.log('▶️ Creando nuevo requisito…');
        const { data: created } = await axios.post(
          'http://localhost:8087/uam-carnet-sys/requirement',
          {
            cif,
            pictureId,
            paymentProofUrl: form.paymentProofUrl,
          }
        );
        requirementId = created.requirementId;
      }
      
      if (!requirementId) {
        throw new Error('No se obtuvo requirementId');
      }
      console.log('✅ requirementId final =', requirementId);
  
      // ────── SOLICITUD DE CARNET ──────
      const payload = {
        cif,
        semester: form.semester,
        selectedDegreeId: Number(form.selectedDegreeId),
        requirementId,
        deliveryAppointment: formatted,
      };
      console.log('▶️ POST /idcard', payload);
      await axios.post('http://localhost:8087/uam-carnet-sys/idcard', payload);
      console.log('✅ Carnet solicitado correctamente');
  
      // ────── REDIRECCIÓN ──────
      navigate('/student/dashboard', { replace: true });
  
    } catch (err) {
      console.error('❌ Error completo:', err);
      console.error('❌ err.response.data:', err.response?.data);
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
                    <option key={opt.id} value={String(opt.id)}>
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