// src/pages/superadmin/FacultyManagement.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import SuperadminLayout from '../../layouts/SuperadminLayout';

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
                        className="bg-gray-300 px-3 rounded"
                    >
                        Limpiar
                    </button>
                </div>

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
                            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                        >
                            Añadir
                        </button>
                    ) : (
                        <>
                            <button
                                onClick={() => saveEdit(editingId)}
                                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                            >
                                Guardar
                            </button>
                            <button
                                onClick={cancelEdit}
                                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                            >
                                Cancelar
                            </button>
                        </>
                    )}
                </div>

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
                            <td className="p-2 space-x-2">
                                {editingId !== f.facultyId && (
                                    <>
                                        <button
                                            onClick={() => startEdit(f)}
                                            className="bg-indigo-600 text-white px-3 py-1 rounded hover:bg-indigo-700"
                                        >
                                            Editar
                                        </button>
                                        <button
                                            onClick={() => remove(f.facultyId)}
                                            className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                                        >
                                            Eliminar
                                        </button>
                                    </>
                                )}
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
