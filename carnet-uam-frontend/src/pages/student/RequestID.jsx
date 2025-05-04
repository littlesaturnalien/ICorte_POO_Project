
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

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const res = await axios.get(
          `http://localhost:8087/uam-carnet-sys/student/byCif=${cif}`
        );
        const raw = res.data;
        const stu = raw.data
          ? Array.isArray(raw.data)
            ? raw.data[0]
            : raw.data
          : raw;

        setStudent(stu);

        // Construye un array homogéneo de carreras
        const degreeOptions = Array.isArray(stu.degrees) && stu.degrees.length > 0
          ? stu.degrees.map(d => ({ id: d.id, name: d.name }))
          : (stu.degreeId && stu.degreeName)
            ? [{ id: stu.degreeId, name: stu.degreeName }]
            : [];

        // Preselecciona la primera carrera si existe
        if (degreeOptions.length > 0) {
          setForm(f => ({ ...f, selectedDegreeId: degreeOptions[0].id }));
        }
      } catch (err) {
        console.error('Error al cargar estudiante:', err);
      }
    };
    fetchStudent();
  }, [cif]);

  if (!student) {
    return (
      <StudentLayout>
        <div className="text-center mt-10">Cargando formulario...</div>
      </StudentLayout>
    );
  }

  // Reconstruye degreeOptions en cada render
  const degreeOptions = Array.isArray(student.degrees) && student.degrees.length > 0
    ? student.degrees.map(d => ({ id: d.id, name: d.name }))
    : (student.degreeId && student.degreeName)
      ? [{ id: student.degreeId, name: student.degreeName }]
      : [];

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!form.selectedDegreeId) {
      alert('Por favor selecciona una carrera.');
      return;
    }
    if (!form.academicYear) {
      alert('Por favor selecciona el año de la carrera.');
      return;
    }

    try {
      // 1) Crear fotografía
      const picRes = await axios.post(
        'http://localhost:8087/uam-carnet-sys/picture',
        {
          cif,
          photoAppointment: form.photoAppointment,
          photoUrl: form.photoUrl,
        }
      );
      const pictureId = picRes.data.data?.id ?? picRes.data.id;

      // 2) Crear requisito
      const reqRes = await axios.post(
        'http://localhost:8087/uam-carnet-sys/requirement',
        {
          cif,
          pictureId,
          paymentProofUrl: form.paymentProofUrl,
        }
      );
      const requirementId = reqRes.data.data?.id ?? reqRes.data.id;

      // 3) Solicitar carnet
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

  return (
    <StudentLayout>
      <div className="max-w-2xl mx-auto mt-10 p-6 bg-white shadow rounded">
        <h1 className="text-2xl font-bold mb-6">Solicitar Carnet</h1>
        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Carreras */}
          <div>
            <label className="block font-medium mb-1">Carrera</label>
            {degreeOptions.length > 0 ? (
              <select
                name="selectedDegreeId"
                value={form.selectedDegreeId}
                onChange={handleChange}
                required
                className="w-full border rounded p-2"
              >
                {degreeOptions.map(d => (
                  <option key={d.id} value={d.id}>
                    {d.name}
                  </option>
                ))}
              </select>
            ) : (
              <div className="text-red-600">No se encontraron carreras</div>
            )}
          </div>

          {/* Año de Carrera */}
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

          {/* Semestre */}
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

          {/* Cita de Foto */}
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

          {/* URL de la Foto */}
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

          {/* URL del Comprobante de Pago */}
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

          {/* Botón de envío */}
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
