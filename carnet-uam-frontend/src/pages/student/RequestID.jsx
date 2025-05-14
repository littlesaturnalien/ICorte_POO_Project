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
    semester: 'I',
    photoAppointment: '',
    photoUrl: '',
    paymentProofUrl: '',
    motive: '',
  });

  const buildDegreeOptions = stu => {
    if (!stu) return [];
    if (Array.isArray(stu.studies) && stu.studies.length) {
      return stu.studies.map(s => ({
        id: s.degreeId,
        name: `${s.degreeName} — ${s.facultyName}`,
      }));
    }
    if (Array.isArray(stu.degrees) && stu.degrees.length) {
      return [];
    }
    if (stu.degreeId && stu.degreeName) {
      return [{ id: stu.degreeId, name: stu.degreeName }];
    }
    return [];
  };

  useEffect(() => {
    if (!cif) return;
    (async () => {
      try {
        const res = await axios.get(`http://localhost:8087/uam-carnet-sys/student/byCif=${cif}`);
        const payload = res.data;
        const stu = payload.data ? (Array.isArray(payload.data) ? payload.data[0] : payload.data) : payload;

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

  const degreeOptions = buildDegreeOptions(student);

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const toLocalDateTimeString = iso => {
    const [ymd, hm] = iso.split('T');
    const [Y, M, D] = ymd.split('-');
    return `${D}-${M}-${Y} ${hm}`;
  };

  const handleSubmit = async e => {
    e.preventDefault();

    if (!degreeOptions.length) return alert('No se encontró una carrera válida.');
    if (!form.selectedDegreeId) return alert('Selecciona una carrera.');
    if (!form.photoUrl && !form.photoAppointment) return alert('Debes proporcionar una URL de la foto o agendar una cita.');
    if (!form.paymentProofUrl) return alert('Debes subir el comprobante de pago.');
    if (!form.motive) return alert('Debes indicar el motivo de la solicitud.');

    try {
      const formattedDate = form.photoAppointment ? toLocalDateTimeString(form.photoAppointment) : null;

      const { data: createdPicture } = await axios.post(
          'http://localhost:8087/uam-carnet-sys/picture',
          {
            cif,
            photoAppointment: formattedDate,
            photoUrl: form.photoUrl,
          }
      );

      const pictureId = createdPicture.pictureId;

      const { data: createdRequirement } = await axios.post(
          'http://localhost:8087/uam-carnet-sys/requirement',
          {
            cif,
            pictureId,
            paymentProofUrl: form.paymentProofUrl,
            motive: form.motive,
          }
      );

      const requirementId = createdRequirement.requirementId;

      await axios.post('http://localhost:8087/uam-carnet-sys/idcard', {
        cif,
        semester: form.semester,
        selectedDegreeId: Number(form.selectedDegreeId),
        requirementId,
        deliveryAppointment: formattedDate,
      });

      navigate('/student/dashboard', { replace: true });
    } catch (err) {
      console.error('Error completo:', err);
      alert('Error al procesar la solicitud:\n' + JSON.stringify(err.response?.data || err.message, null, 2));
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

          {!degreeOptions.length && (
              <div className="p-4 mb-6 bg-yellow-100 text-yellow-800 rounded">
                No se encontró un identificador de carrera válido asociado a tu perfil. Por favor contacta a soporte.
              </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
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
              <label className="block font-medium mb-1">Motivo de la solicitud</label>
              <textarea
                  name="motive"
                  value={form.motive}
                  onChange={handleChange}
                  placeholder="Explica por qué necesitas el carnet..."
                  required
                  className="w-full border rounded p-2"
              />
            </div>

            <div>
              <label className="block font-medium mb-1">Fecha y Hora de Cita de Foto</label>
              <input
                  type="datetime-local"
                  name="photoAppointment"
                  value={form.photoAppointment}
                  onChange={handleChange}
                  className="w-full border rounded p-2"
              />
              <p className="text-sm text-gray-500 mt-1">
                Opcional: si no usarás cita, deja vacío y coloca solo la URL.
              </p>
            </div>

            <div>
              <label className="block font-medium mb-1">URL de la Foto</label>
              <input
                  type="url"
                  name="photoUrl"
                  value={form.photoUrl}
                  onChange={handleChange}
                  placeholder="https://drive.google.com/..."
                  className="w-full border rounded p-2"
              />
              <p className="text-sm text-gray-500 mt-1">
                Opcional: si ya agendaste cita, puedes omitir esto.
              </p>
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
                disabled={!degreeOptions.length}
                className="w-full text-white py-2 rounded disabled:opacity-50"
                style={{ backgroundColor: '#487e84' }}
                onMouseOver={e => (e.currentTarget.style.backgroundColor = '#0b545b')}
                onMouseOut={e => (e.currentTarget.style.backgroundColor = '#487e84')}
            >
              Enviar Solicitud
            </button>
          </form>
        </div>
      </StudentLayout>
  );
};

export default RequestIDCard;
