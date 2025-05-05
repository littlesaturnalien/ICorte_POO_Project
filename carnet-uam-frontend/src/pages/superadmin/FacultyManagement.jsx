// src/pages/superadmin/FacultyManagement.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import SuperadminLayout from '../../layouts/SuperadminLayout';

// Palette (igual que en DegreeManagement)
const C = {
    tealLight:   '#4da4ab',   // secondary actions (cancel, clear)
    tealMid:     '#487e84',   // primary actions (add, save)
    tealDark:    '#0b545b',   // edit action
    danger:      '#dc2626',   // delete action (rojo)
    dangerHover: '#b91c1c'
};

export default function FacultyManagement() {
    const [faculties, setFaculties] = useState([]);
    const [editingId, setEditingId] = useState(null);
    const [nameInput, setNameInput] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    const fetchAll = async () => {
        const res = await axios.get('http://localhost:8087/uam-carnet-sys/faculty');
        setFaculties(res.data);
    };

    useEffect(() => { fetchAll(); }, []);

    const startEdit = f => {
        setEditingId(f.facultyId);
        setNameInput(f.facultyName);
    };
    const cancelEdit = () => {
        setEditingId(null);
        setNameInput('');
    };
    const saveNew = async () => {
        if (!nameInput.trim()) return;
        await axios.post('http://localhost:8087/uam-carnet-sys/faculty', { facultyName: nameInput });
        setNameInput(''); fetchAll();
    };
    const saveEdit = async id => {
        await axios.put(`http://localhost:8087/uam-carnet-sys/faculty/${id}`, { facultyName: nameInput });
        cancelEdit(); fetchAll();
    };
    const remove = async id => {
        if (window.confirm('¿Eliminar esta facultad?')) {
            await axios.delete(`http://localhost:8087/uam-carnet-sys/faculty/${id}`);
            fetchAll();
        }
    };

    const filtered = faculties.filter(f =>
        f.facultyName.toLowerCase().includes(searchTerm.trim().toLowerCase())
    );

    return (
        <SuperadminLayout>
            <div className="max-w-4xl mx-auto mt-10 bg-white p-6 rounded shadow">
                <h1 className="text-2xl font-bold mb-4">Gestión de Facultades</h1>

                {/* Búsqueda y limpiar */}
                <div className="flex gap-2 mb-4">
                    <input
                        type="text"
                        placeholder="Buscar facultad…"
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        className="border px-3 py-2 rounded flex-grow"
                    />
                    <button
                        onClick={() => setSearchTerm('')}
                        className="px-3 rounded font-semibold transition"
                        style={{ backgroundColor: C.tealLight, color: 'white' }}
                        onMouseEnter={e => e.currentTarget.style.backgroundColor = C.tealDark}
                        onMouseLeave={e => e.currentTarget.style.backgroundColor = C.tealLight}
                    >
                        Limpiar
                    </button>
                </div>

                {/* Alta / Edición */}
                <div className="flex gap-2 mb-6">
                    <input
                        type="text"
                        placeholder="Nueva Facultad"
                        className="border px-3 py-2 rounded flex-grow"
                        value={nameInput}
                        onChange={e => setNameInput(e.target.value)}
                    />
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
                                onMouseEnter={e => e.currentTarget.style.backgroundColor = C.tealDark}
                                onMouseLeave={e => e.currentTarget.style.backgroundColor = C.tealLight}
                            >
                                Cancelar
                            </button>
                        </>
                    )}
                </div>

                {/* Tabla de facultades */}
                <table className="w-full table-auto border text-left">
                    <thead className="bg-gray-100">
                    <tr>
                        <th className="p-2">Facultad</th>
                        <th className="p-2">Acciones</th>
                    </tr>
                    </thead>
                    <tbody>
                    {filtered.map(f => (
                        <tr key={f.facultyId} className="border-t">
                            <td className="p-2">
                                {editingId === f.facultyId ? (
                                    <input
                                        value={nameInput}
                                        onChange={e => setNameInput(e.target.value)}
                                        className="border px-2 py-1 rounded w-full"
                                    />
                                ) : (
                                    f.facultyName
                                )}
                            </td>
                            <td className="p-2">
                                <div className="flex items-center gap-2">
                                    {editingId !== f.facultyId && (
                                        <>
                                            <button
                                                onClick={() => startEdit(f)}
                                                className="px-3 py-1 rounded font-semibold transition"
                                                style={{ backgroundColor: C.tealDark, color: 'white' }}
                                                onMouseEnter={e => e.currentTarget.style.backgroundColor = C.tealMid}
                                                onMouseLeave={e => e.currentTarget.style.backgroundColor = C.tealDark}
                                            >
                                                Editar
                                            </button>
                                            <button
                                                onClick={() => remove(f.facultyId)}
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
                            <td colSpan={2} className="p-4 text-center text-gray-500">
                                No se encontraron facultades.
                            </td>
                        </tr>
                    )}
                    </tbody>
                </table>
            </div>
        </SuperadminLayout>
    );
}
