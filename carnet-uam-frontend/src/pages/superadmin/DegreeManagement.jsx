// src/pages/superadmin/DegreeManagement.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import SuperadminLayout from '../../layouts/SuperadminLayout';

// Palette
const C = {
    tealLight:   '#4da4ab',   // secondary actions (cancel, clear)
    tealMid:     '#487e84',   // primary actions (add, save)
    tealDark:    '#0b545b',   // edit action
    danger:      '#dc2626',   // delete action (red)
    dangerHover: '#b91c1c'
};

export default function DegreeManagement() {
    const [degrees, setDegrees] = useState([]);
    const [faculties, setFaculties] = useState([]);
    const [editingId, setEditingId] = useState(null);
    const [nameInput, setNameInput] = useState('');
    const [facultyId, setFacultyId] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [facultyFilter, setFacultyFilter] = useState('ALL');

    const fetchAll = async () => {
        const [degRes, facRes] = await Promise.all([
            axios.get('http://localhost:8087/uam-carnet-sys/degree'),
            axios.get('http://localhost:8087/uam-carnet-sys/faculty'),
        ]);
        setDegrees(degRes.data);
        setFaculties(facRes.data);
    };

    useEffect(() => {
        fetchAll();
    }, []);

    const startEdit = (d) => {
        setEditingId(d.degreeId);
        setNameInput(d.degreeName);
        const fac = faculties.find(f => f.facultyName === d.facultyName);
        setFacultyId(fac?.facultyName || '');
    };

    const cancelEdit = () => {
        setEditingId(null);
        setNameInput('');
        setFacultyId('');
    };

    const saveNew = async () => {
        if (!nameInput.trim() || !facultyId) return;
        const fac = faculties.find(f => f.facultyName === facultyId);
        await axios.post('http://localhost:8087/uam-carnet-sys/degree', {
            degreeName: nameInput,
            facultyId: fac.facultyId,
        });
        setNameInput('');
        setFacultyId('');
        fetchAll();
    };

    const saveEdit = async (id) => {
        const fac = faculties.find(f => f.facultyName === facultyId);
        await axios.put(`http://localhost:8087/uam-carnet-sys/degree/${id}`, {
            degreeName: nameInput,
            facultyId: fac.facultyId,
        });
        cancelEdit();
        fetchAll();
    };

    const remove = async (id) => {
        if (!window.confirm('¿Eliminar esta carrera?')) return;
        await axios.delete(`http://localhost:8087/uam-carnet-sys/degree/${id}`);
        fetchAll();
    };

    const filtered = degrees.filter(d => {
        const term = searchTerm.trim().toLowerCase();
        const nameMatch = !term || d.degreeName.toLowerCase().includes(term);
        const facMatch = facultyFilter === 'ALL' || d.facultyName === facultyFilter;
        return nameMatch && facMatch;
    });

    return (
        <SuperadminLayout>
            <div className="max-w-5xl mx-auto mt-10 bg-white p-6 rounded shadow">
                <h1 className="text-2xl font-bold mb-4">Gestión de Carreras</h1>

                {/* Búsqueda y filtro */}
                <div className="flex flex-wrap gap-2 mb-4">
                    <input
                        type="text"
                        placeholder="Buscar carrera…"
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        className="border px-3 py-2 rounded flex-grow min-w-[200px]"
                    />
                    <select
                        value={facultyFilter}
                        onChange={e => setFacultyFilter(e.target.value)}
                        className="border px-3 py-2 rounded"
                    >
                        <option value="ALL">Todas las facultades</option>
                        {faculties.map(f => (
                            <option key={f.facultyId} value={f.facultyName}>
                                {f.facultyName}
                            </option>
                        ))}
                    </select>
                    <button
                        onClick={() => {
                            setSearchTerm('');
                            setFacultyFilter('ALL');
                        }}
                        className="px-3 rounded font-semibold transition"
                        style={{ backgroundColor: C.tealLight, color: 'white' }}
                        onMouseEnter={e => e.currentTarget.style.backgroundColor = C.tealDark}
                        onMouseLeave={e => e.currentTarget.style.backgroundColor = C.tealLight}
                    >
                        Limpiar
                    </button>
                </div>

                {/* Formulario de alta/edición */}
                <div className="grid grid-cols-3 gap-2 mb-6">
                    <input
                        type="text"
                        placeholder="Nueva Carrera"
                        className="border px-3 py-2 rounded col-span-2"
                        value={nameInput}
                        onChange={e => setNameInput(e.target.value)}
                    />
                    <select
                        className="border px-3 py-2 rounded"
                        value={facultyId}
                        onChange={e => setFacultyId(e.target.value)}
                    >
                        <option value="">Facultad…</option>
                        {faculties.map(f => (
                            <option key={f.facultyId} value={f.facultyName}>
                                {f.facultyName}
                            </option>
                        ))}
                    </select>
                    <div className="col-span-3 flex gap-2">
                        {editingId == null ? (
                            <button
                                onClick={saveNew}
                                className="px-4 py-2 rounded font-semibold transition"
                                style={{ backgroundColor: C.tealMid, color: 'white' }}
                                onMouseEnter={e => e.currentTarget.style.backgroundColor = C.tealDark}
                                onMouseLeave={e => e.currentTarget.style.backgroundColor = C.tealMid}
                            >
                                Añadir
                            </button>
                        ) : (
                            <>
                                <button
                                    onClick={() => saveEdit(editingId)}
                                    className="px-4 py-2 rounded font-semibold transition"
                                    style={{ backgroundColor: C.tealMid, color: 'white' }}
                                    onMouseEnter={e => e.currentTarget.style.backgroundColor = C.tealDark}
                                    onMouseLeave={e => e.currentTarget.style.backgroundColor = C.tealMid}
                                >
                                    Guardar
                                </button>
                                <button
                                    onClick={cancelEdit}
                                    className="px-4 py-2 rounded font-semibold transition"
                                    style={{ backgroundColor: C.tealLight, color: 'white' }}
                                    onMouseEnter={e => e.currentTarget.style.backgroundColor = C.tealMid}
                                    onMouseLeave={e => e.currentTarget.style.backgroundColor = C.tealLight}
                                >
                                    Cancelar
                                </button>
                            </>
                        )}
                    </div>
                </div>

                {/* Tabla de carreras */}
                <table className="w-full table-auto border text-left">
                    <thead className="bg-gray-100">
                    <tr>
                        <th className="p-2">Carrera</th>
                        <th className="p-2">Facultad</th>
                        <th className="p-2">Acciones</th>
                    </tr>
                    </thead>
                    <tbody>
                    {filtered.map(d => (
                        <tr key={d.degreeId} className="border-t">
                            <td className="p-2">
                                {editingId === d.degreeId ? (
                                    <input
                                        value={nameInput}
                                        onChange={e => setNameInput(e.target.value)}
                                        className="border px-2 py-1 rounded w-full"
                                    />
                                ) : (
                                    d.degreeName
                                )}
                            </td>
                            <td className="p-2">
                                {editingId === d.degreeId ? (
                                    <select
                                        value={facultyId}
                                        onChange={e => setFacultyId(e.target.value)}
                                        className="border px-2 py-1 rounded w-full"
                                    >
                                        <option value="">Facultad…</option>
                                        {faculties.map(f => (
                                            <option key={f.facultyId} value={f.facultyName}>
                                                {f.facultyName}
                                            </option>
                                        ))}
                                    </select>
                                ) : (
                                    d.facultyName
                                )}
                            </td>
                            <td className="p-2">
                                <div className="flex items-center gap-2">
                                    {editingId !== d.degreeId && (
                                        <>
                                            <button
                                                onClick={() => startEdit(d)}
                                                className="px-3 py-1 rounded font-semibold transition"
                                                style={{ backgroundColor: C.tealDark, color: 'white' }}
                                                onMouseEnter={e => e.currentTarget.style.backgroundColor = C.tealMid}
                                                onMouseLeave={e => e.currentTarget.style.backgroundColor = C.tealDark}
                                            >
                                                Editar
                                            </button>
                                            <button
                                                onClick={() => remove(d.degreeId)}
                                                className="px-3 py-1 rounded font-semibold transition"
                                                style={{ backgroundColor: C.danger, color: 'white' }}
                                                onMouseEnter={e => e.currentTarget.style.backgroundColor = C.dangerHover}
                                                onMouseLeave={e => e.currentTarget.style.backgroundColor = C.danger}
                                            >
                                                Eliminar
                                            </button>
                                        </>
                                    )}
                                </div>
                            </td>
                        </tr>
                    ))}
                    {filtered.length === 0 && (
                        <tr>
                            <td colSpan={3} className="p-4 text-center text-gray-500">
                                No se encontraron carreras.
                            </td>
                        </tr>
                    )}
                    </tbody>
                </table>
            </div>
        </SuperadminLayout>
    );
}