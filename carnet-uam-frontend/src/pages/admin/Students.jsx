// src/pages/admin/Students.jsx
import React, { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import AdminLayout from '../../layouts/AdminLayout';
import { useNavigate } from 'react-router-dom';

const statusOptions = ['ALL','PENDING','APPROVED','REJECTED','DELIVERED','EMITTED'];
const GRADIENT_BG = 'linear-gradient(180deg, #eaf6f7 0%, #c7e1e3 40%, #9cc8cb 100%)';

const C = {
  tealLight: '#4da4ab',
  tealMid:   '#487e84',
  tealDark:  '#0b545b',
};

export default function Students() {
  const navigate = useNavigate();
  const [allStudents, setAllStudents] = useState([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatus] = useState('ALL');
  const [degreeFilter, setDegreeFilter] = useState('ALL');
  const [facultyFilter, setFacultyFilter] = useState('ALL');
  const [degreesList, setDegreesList] = useState([]);
  const [facultiesList, setFacultiesList] = useState([]);

  const buildName = s => (s.fullName || `${s.names ?? ''} ${s.surnames ?? ''}`).trim();
  const buildDeg  = s => s.studies?.map(st => st.degreeName).join('; ') || '—';
  const buildFac  = s => s.studies?.map(st => st.facultyName).join('; ') || '—';
  const buildState = s => {
    const currentYear = new Date().getFullYear();
    const cards = s.idCards?.filter(card => card.year === currentYear) || [];

    if (!cards.length) return '—';
    const mostRecent = cards.reduce((latest, curr) =>
        curr.idCardId > latest.idCardId ? curr : latest
    );

    return mostRecent.status;
  };




  useEffect(() => {
    (async () => {
      try {
        const [stuRes,degRes,facRes] = await Promise.all([
          axios.get('http://localhost:8087/uam-carnet-sys/student'),
          axios.get('http://localhost:8087/uam-carnet-sys/degree'),
          axios.get('http://localhost:8087/uam-carnet-sys/faculty'),
        ]);
        setAllStudents(Array.isArray(stuRes.data)? stuRes.data : [stuRes.data]);
        setDegreesList(degRes.data.map(d=>d.degreeName));
        setFacultiesList(facRes.data.map(f=>f.facultyName));
      } catch(err){
        console.error(err);
      }
    })();
  },[]);

  const filtered = useMemo(()=>{
    const term = search.trim().toLowerCase();
    return allStudents.filter(s=>{
      const txt = `${s.cif} ${buildName(s)} ${buildDeg(s)} ${buildFac(s)}`.toLowerCase();
      if(term && !txt.includes(term)) return false;
      if(statusFilter!=='ALL' && buildState(s)!==statusFilter) return false;
      if(degreeFilter!=='ALL' && !buildDeg(s).split('; ').includes(degreeFilter)) return false;
      if(facultyFilter!=='ALL' && !buildFac(s).split('; ').includes(facultyFilter)) return false;
      return true;
    });
  },[allStudents,search,statusFilter,degreeFilter,facultyFilter]);

  return (
      <AdminLayout>
        {/* wrapper con position para cubrir todo el fondo */}
        <div className="relative min-h-[calc(100vh-64px)]">
          {/* fondo degradado absoluta */}
          <div
              className="absolute inset-0"
              style={{ background: GRADIENT_BG }}
          />
          {/* contenido por delante del degradado */}
          <div className="relative max-w-6xl mx-auto mt-10 p-6 bg-white rounded shadow">
            <h1 className="text-2xl font-bold mb-4">Estudiantes Registrados</h1>

            {/* filtros */}
            <div className="flex flex-wrap items-center gap-2 mb-6">
              <input
                  type="text"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Buscar por CIF, nombre, carrera o facultad…"
                  className="border px-3 py-2 rounded flex-grow min-w-[200px]"
              />
              <select
                  value={degreeFilter}
                  onChange={e => setDegreeFilter(e.target.value)}
                  className="border px-3 py-2 rounded"
              >
                <option value="ALL">Todas las carreras</option>
                {degreesList.map(deg=>(
                    <option key={deg} value={deg}>{deg}</option>
                ))}
              </select>
              <select
                  value={facultyFilter}
                  onChange={e => setFacultyFilter(e.target.value)}
                  className="border px-3 py-2 rounded"
              >
                <option value="ALL">Todas las facultades</option>
                {facultiesList.map(fac=>(
                    <option key={fac} value={fac}>{fac}</option>
                ))}
              </select>
              <select
                  value={statusFilter}
                  onChange={e => setStatus(e.target.value)}
                  className="border px-3 py-2 rounded"
              >
                {statusOptions.map(st=>(
                    <option key={st} value={st}>
                      {st==='ALL'?'Todos los estados':st}
                    </option>
                ))}
              </select>
              <button
                  onClick={()=>{
                    setSearch('');
                    setDegreeFilter('ALL');
                    setFacultyFilter('ALL');
                    setStatus('ALL');
                  }}
                  className="px-3 rounded font-semibold transition"
                  style={{ backgroundColor:C.tealLight,color:'white' }}
                  onMouseEnter={e=>e.currentTarget.style.backgroundColor=C.tealDark}
                  onMouseLeave={e=>e.currentTarget.style.backgroundColor=C.tealLight}
              >
                Limpiar
              </button>
            </div>

            {/* tabla */}
            <div className="overflow-x-auto">
              <table className="w-full table-auto border-collapse">
                <thead>
                <tr className="bg-gray-100">
                  <th className="p-2 rounded-tl">CIF</th>
                  <th className="p-2">Nombre</th>
                  <th className="p-2">Carrera(s)</th>
                  <th className="p-2">Facultad(es)</th>
                  <th className="p-2">Estado Carnet</th>
                  <th className="p-2 rounded-tr">Acciones</th>
                </tr>
                </thead>
                <tbody>
                {filtered.map(s=>(
                    <tr key={s.cif} className="border-t hover:bg-gray-50">
                      <td className="p-2">{s.cif}</td>
                      <td className="p-2">{buildName(s)||'—'}</td>
                      <td className="p-2">{buildDeg(s)}</td>
                      <td className="p-2">{buildFac(s)}</td>
                      <td className="p-2">{buildState(s)}</td>
                      <td className="p-2">
                        <button
                            onClick={()=>navigate(`/admin/students/${s.cif}/idcard`)}
                            className="px-3 py-1 rounded text-white transition"
                            style={{ backgroundColor:C.tealMid }}
                            onMouseEnter={e=>e.currentTarget.style.backgroundColor=C.tealDark}
                            onMouseLeave={e=>e.currentTarget.style.backgroundColor=C.tealMid}
                        >
                          Ver Solicitudes
                        </button>
                      </td>
                    </tr>
                ))}
                {!filtered.length && (
                    <tr>
                      <td colSpan={6} className="p-4 text-center text-gray-500">
                        No se encontraron estudiantes.
                      </td>
                    </tr>
                )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </AdminLayout>
  );
}