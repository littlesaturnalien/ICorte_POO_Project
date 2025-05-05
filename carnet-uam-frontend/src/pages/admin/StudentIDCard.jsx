// src/pages/admin/StudentIdCardPage.jsx
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import AdminLayout from '../../layouts/AdminLayout';

const STATUS_OPTS = ['PENDING', 'APPROVED', 'REJECTED', 'DELIVERED', 'EMITTED'];

export default function StudentIdCardPage() {
    const { cif } = useParams();

    const [idCards, setIdCards]         = useState([]);
    const [requirements, setRequirements] = useState([]);
    const [student, setStudent]         = useState([]);
    const [expanded, setExpanded]       = useState(null);

    /** estado local de edición por idCardId */
    const [edit, setEdit] = useState({});

    const studentName =
        student.length ? `${student[0].names} ${student[0].surnames}` : '';

    /* ─────────── fetch ─────────── */
    useEffect(() => {
        const fetchAll = async () => {
            try {
                const [idcRes, reqRes, stuRes] = await Promise.all([
                    axios.get('http://localhost:8087/uam-carnet-sys/idcard'),
                    axios.get('http://localhost:8087/uam-carnet-sys/requirement'),
                    axios.get('http://localhost:8087/uam-carnet-sys/student'),
                ]);

                const idcFiltered = idcRes.data.filter(i => i.cif === cif);
                const reqFiltered = reqRes.data.filter(r => r.cif === cif);

                setIdCards(idcFiltered);
                setRequirements(reqFiltered);
                setStudent(stuRes.data.filter(s => s.cif === cif));

                /* init edición */
                const init = {};
                idcFiltered.forEach(card => {
                    const req = reqFiltered.find(r => r.requirementId === card.requirement_id);
                    init[card.idCardId] = {
                        status: card.status,
                        notes: card.notes || '',
                        /* Foto */
                        pictureUrl: card.picture_url || '',
                        photoAppointment: card.photoAppointment
                            ? card.photoAppointment.replace(' ', 'T')
                            : '',
                        pictureId: card.picture_id,
                        /* Requisito */
                        paymentProofUrl: req?.paymentProofUrl || '',
                        requirementId: req?.requirementId,
                    };
                });
                setEdit(init);
            } catch (err) {
                console.error(err);
            }
        };
        fetchAll();
    }, [cif]);

    /* ─────────── helpers save ─────────── */
    const saveStateAndNotes = async card => {
        const e = edit[card.idCardId];
        try {
            if (e.status !== card.status) {
                await axios.patch(
                    `http://localhost:8087/uam-carnet-sys/idcard/${card.idCardId}/status`,
                    { status: e.status }
                );
            }
            if (e.notes !== (card.notes || '')) {
                await axios.patch(
                    `http://localhost:8087/uam-carnet-sys/idcard/${card.idCardId}/addNotes`,
                    { notes: e.notes }
                );
            }
            alert('Estado / notas guardados');
        } catch (err) {
            console.error(err);
            alert('Error al guardar estado o notas');
        }
    };

    const savePicture = async card => {
        const e = edit[card.idCardId];
        if (!e.pictureId) return alert('pictureId no encontrado');
        try {
            await axios.put(
                `http://localhost:8087/uam-carnet-sys/picture/${e.pictureId}`,
                {
                    photoAppointment: e.photoAppointment.replace('T', ' '),
                    photoUrl: e.pictureUrl,
                }
            );
            alert('Foto actualizada');
        } catch (err) {
            console.error(err);
            alert('Error al guardar foto');
        }
    };

    const saveRequirement = async card => {
        const e = edit[card.idCardId];
        if (!e.requirementId) return alert('requirementId no encontrado');
        try {
            await axios.put(
                `http://localhost:8087/uam-carnet-sys/requirement/${e.requirementId}`,
                { paymentProofUrl: e.paymentProofUrl }
            );
            alert('Comprobante actualizado');
        } catch (err) {
            console.error(err);
            alert('Error al guardar comprobante');
        }
    };

    /* ─────────── render ─────────── */
    return (
        <AdminLayout>
            <div className="max-w-4xl mx-auto mt-10 p-6 bg-white rounded shadow">
                <h1 className="text-2xl font-bold mb-4">
                    Solicitudes de Carnet de {studentName}
                </h1>
                <Link
                    to="/admin/students"
                    className="text-blue-600 hover:underline mb-6 block"
                >
                    ← Volver a Estudiantes
                </Link>

                {!idCards.length && (
                    <p className="text-gray-500">
                        No hay solicitudes de carnet para este estudiante.
                    </p>
                )}

                <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
                    {idCards.map((card, idx) => {
                        const e = edit[card.idCardId] || {};
                        return (
                            <div key={card.idCardId} className="border rounded-lg">
                                <button
                                    onClick={() => setExpanded(expanded === idx ? null : idx)}
                                    className="w-full text-left p-4 bg-gray-100 hover:bg-gray-200 flex justify-between items-center rounded-t-lg"
                                >
                  <span className="font-semibold">
                    Semestre {card.semester} {card.year} — {card.status}
                  </span>
                                    <span>{expanded === idx ? '−' : '+'}</span>
                                </button>

                                {expanded === idx && (
                                    <div className="p-4 bg-white space-y-5 rounded-b-lg">
                                        {/* Estudiante */}
                                        <section>
                                            <h2 className="text-lg font-medium mb-1">
                                                Información del Estudiante
                                            </h2>
                                            <p>
                                                <strong>Nombre:</strong> {card.names} {card.surnames}
                                            </p>
                                            <p>
                                                <strong>Carrera:</strong> {card.selectedDegreeName}
                                            </p>
                                            <p>
                                                <strong>Facultad:</strong> {card.selectedFacultyName}
                                            </p>
                                        </section>

                                        {/* Carnet (estado y notas) */}
                                        <section className="space-y-2">
                                            <h2 className="text-lg font-medium">
                                                Estado y Notas del Carnet
                                            </h2>

                                            {/* Estado */}
                                            <div className="flex items-center gap-2">
                                                <label className="w-44 font-semibold">Estado</label>
                                                <select
                                                    value={e.status}
                                                    onChange={ev =>
                                                        setEdit({
                                                            ...edit,
                                                            [card.idCardId]: {
                                                                ...e,
                                                                status: ev.target.value,
                                                            },
                                                        })
                                                    }
                                                    className="border px-2 py-1 rounded"
                                                >
                                                    {STATUS_OPTS.map(s => (
                                                        <option key={s}>{s}</option>
                                                    ))}
                                                </select>
                                            </div>

                                            {/* Fechas solo lectura */}
                                            <p>
                                                <strong>Emisión:</strong> {card.issueDate}
                                            </p>
                                            <p>
                                                <strong>Cita Entrega:</strong>{' '}
                                                {card.deliveryAppointment}
                                            </p>

                                            {/* Notas */}
                                            <div className="flex items-start gap-2">
                                                <label className="w-44 font-semibold">Notas</label>
                                                <textarea
                                                    value={e.notes}
                                                    onChange={ev =>
                                                        setEdit({
                                                            ...edit,
                                                            [card.idCardId]: {
                                                                ...e,
                                                                notes: ev.target.value,
                                                            },
                                                        })
                                                    }
                                                    rows={3}
                                                    className="border px-2 py-1 rounded w-full"
                                                />
                                            </div>

                                            <button
                                                onClick={() => saveStateAndNotes(card)}
                                                className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                                            >
                                                Guardar Estado / Notas
                                            </button>
                                        </section>

                                        {/* Foto editable */}
                                        <section className="space-y-2 pt-4 border-t">
                                            <h2 className="text-lg font-medium">Fotografía</h2>

                                            <div className="flex items-center gap-2">
                                                <label className="w-44 font-semibold">URL Foto</label>
                                                <input
                                                    type="url"
                                                    value={e.pictureUrl}
                                                    onChange={ev =>
                                                        setEdit({
                                                            ...edit,
                                                            [card.idCardId]: {
                                                                ...e,
                                                                pictureUrl: ev.target.value,
                                                            },
                                                        })
                                                    }
                                                    className="border px-2 py-1 rounded w-full"
                                                />
                                            </div>

                                            <div className="flex items-center gap-2">
                                                <label className="w-44 font-semibold">
                                                    Cita Fotografía
                                                </label>
                                                <input
                                                    type="datetime-local"
                                                    value={e.photoAppointment}
                                                    onChange={ev =>
                                                        setEdit({
                                                            ...edit,
                                                            [card.idCardId]: {
                                                                ...e,
                                                                photoAppointment: ev.target.value,
                                                            },
                                                        })
                                                    }
                                                    className="border px-2 py-1 rounded"
                                                />
                                            </div>

                                            <button
                                                onClick={() => savePicture(card)}
                                                className="bg-indigo-600 text-white px-3 py-1 rounded hover:bg-indigo-700"
                                            >
                                                Guardar Foto
                                            </button>

                                            {e.pictureUrl && (
                                                <p className="mt-1">
                                                    <a
                                                        href={e.pictureUrl}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        className="text-blue-600 underline"
                                                    >
                                                        Ver fotografía actual
                                                    </a>
                                                </p>
                                            )}
                                        </section>

                                        {/* Requisito editable */}
                                        <section className="space-y-2 pt-4 border-t">
                                            <h2 className="text-lg font-medium">
                                                Comprobante de Pago
                                            </h2>

                                            <div className="flex items-center gap-2">
                                                <label className="w-44 font-semibold">URL</label>
                                                <input
                                                    type="url"
                                                    value={e.paymentProofUrl}
                                                    onChange={ev =>
                                                        setEdit({
                                                            ...edit,
                                                            [card.idCardId]: {
                                                                ...e,
                                                                paymentProofUrl: ev.target.value,
                                                            },
                                                        })
                                                    }
                                                    className="border px-2 py-1 rounded w-full"
                                                />
                                            </div>

                                            <button
                                                onClick={() => saveRequirement(card)}
                                                className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                                            >
                                                Guardar Comprobante
                                            </button>

                                            {e.paymentProofUrl && (
                                                <p className="mt-1">
                                                    <a
                                                        href={e.paymentProofUrl}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        className="text-blue-600 underline"
                                                    >
                                                        Ver comprobante actual
                                                    </a>
                                                </p>
                                            )}
                                        </section>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </AdminLayout>
    );
}