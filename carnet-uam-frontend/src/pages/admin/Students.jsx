// src/pages/admin/Students.jsx
import React, { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import AdminLayout from '../../layouts/AdminLayout';

const statusOptions = ['ALL', 'SOLICITADO', 'EN_PROCESO', 'IMPRESO', 'ENTREGADO'];

export default function Students() {
  const [allStudents, setAllStudents] = useState([]);

  /* filtros */
  const [search, setSearch]           = useState('');   // cif, nombre, carrera, facultad
  const [statusFilter, setStatus]     = useState('ALL');

  /* ───────────────── helpers de extracción ───────────────── */
  const buildName  = s => s.fullName || `${s.names ?? ''} ${s.surnames ?? ''}`.trim();
  const buildDeg   = s =>
      s.studies?.map(st => st.degreeName).join(', ')
      || s.degrees?.join(', ')
      || s.degreeName
      || '—';
  const buildFac   = s =>
      s.studies?.map(st => st.facultyName).join(', ')
      || s.faculties?.join(', ')
      || s.facultyName
      || '—';
  const buildState = s =>
      s.idCardStatus
      || (s.idCards?.length ? s.idCards[0].status : '—');

  /* ───────────────── fetch ───────────────── */
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const { data } = await axios.get(
            'http://localhost:8087/uam-carnet-sys/student'
        );
        setAllStudents(Array.isArray(data) ? data : [data]);
      } catch (err) {
        console.error('Error cargando estudiantes:', err);
      }
    };
    fetchStudents();
  }, []);

  /* ───────────────── filtro interactivo ───────────────── */
  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();

    return allStudents.filter(s => {
      /* texto: coincide con cif, nombre, carrera o facultad */
      const textMatch =
          !term ||
          s.cif.toLowerCase().includes(term) ||
          buildName(s).toLowerCase().includes(term) ||
          buildDeg(s).toLowerCase().includes(term) ||
          buildFac(s).toLowerCase().includes(term);

      /* estado carnet */
      const state = buildState(s);
      const stateMatch =
          statusFilter === 'ALL' || state === statusFilter;

      return textMatch && stateMatch;
    });
  }, [allStudents, search, statusFilter]);

  /* ───────────────── render ───────────────── */
  return (
      <AdminLayout>
        <div className="max-w-6xl mx-auto mt-10 p-6 bg-white rounded shadow">
          <h1 className="text-2xl font-bold mb-4">Estudiantes Registrados</h1>

          {/* Barra de búsqueda / filtros */}
          <div className="flex flex-wrap items-center gap-2 mb-6">
            <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Buscar por CIF, nombre, carrera o facultad…"
                className="border px-3 py-2 rounded flex-grow min-w-[200px]"
            />

            <select
                value={statusFilter}
                onChange={e => setStatus(e.target.value)}
                className="border px-3 py-2 rounded"
            >
              {statusOptions.map(st => (
                  <option key={st} value={st}>
                    {st === 'ALL' ? 'Todos los estados' : st}
                  </option>
              ))}
            </select>
          </div>

          {/* Tabla */}
          <table className="w-full table-auto border text-left">
            <thead className="bg-gray-100">
            <tr>
              <th className="p-2">CIF</th>
              <th className="p-2">Nombre</th>
              <th className="p-2">Carrera(s)</th>
              <th className="p-2">Facultad(es)</th>
              <th className="p-2">Estado Carnet</th>
            </tr>
            </thead>
            <tbody>
            {filtered.map(s => (
                <tr key={s.cif} className="border-t">
                  <td className="p-2">{s.cif}</td>
                  <td className="p-2">{buildName(s) || '—'}</td>
                  <td className="p-2">{buildDeg(s)}</td>
                  <td className="p-2">{buildFac(s)}</td>
                  <td className="p-2">{buildState(s)}</td>
                </tr>
            ))}

            {!filtered.length && (
                <tr>
                  <td colSpan={5} className="text-center py-4 text-gray-500">
                    No se encontraron estudiantes que coincidan.
                  </td>
                </tr>
            )}
            </tbody>
          </table>
        </div>
      </AdminLayout>
  );
}