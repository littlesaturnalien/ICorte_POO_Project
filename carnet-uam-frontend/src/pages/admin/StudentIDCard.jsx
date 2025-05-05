// src/pages/admin/StudentIdCardPage.jsx
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import AdminLayout from '../../layouts/AdminLayout';

export default function StudentIdCard() {
    const { cif } = useParams();
    const [idCards, setIdCards] = useState([]);
    const [requirements, setRequirements] = useState([]);
    const [student, setStudent] = useState([])
    const [expandedIndex, setExpandedIndex] = useState(null);


    // Tomamos el nombre completo del primer registro
    const studentName = student.length ? `${student[0].names} ${student[0].surnames}` : '';

    useEffect(() => {
        const fetchAll = async () => {
            try {
                const [idcRes, reqRes, stdRes] = await Promise.all([
                    axios.get('http://localhost:8087/uam-carnet-sys/idcard'),
                    axios.get('http://localhost:8087/uam-carnet-sys/requirement'),
                    axios.get('http://localhost:8087/uam-carnet-sys/student')
                ]);
                setIdCards(idcRes.data.filter(i => i.cif === cif));
                setRequirements(reqRes.data.filter(r => r.cif === cif));
                setStudent(stdRes.data.filter(s => s.cif === cif));
            } catch (err) {
                console.error('Error al cargar datos de carnet:', err);
            }
        };
        fetchAll();
    }, [cif]);

    const toggleExpand = idx => {
        setExpandedIndex(expandedIndex === idx ? null : idx);
    };

    return (
        <AdminLayout>
            <div className="max-w-4xl mx-auto mt-10 p-6 bg-white rounded shadow">
                <h1 className="text-2xl font-bold mb-4">Solicitudes de Carnet de {studentName}</h1>
                <Link to="/admin/students" className="text-blue-600 hover:underline mb-6 block">
                    ← Volver a Estudiantes
                </Link>

                {idCards.length === 0 && (
                    <p className="text-gray-500">No hay solicitudes de carnet para este estudiante.</p>
                )}

                <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
                    {idCards.map((i, idx) => (
                        <div key={i.idCardId} className="border rounded-lg">
                            <button
                                onClick={() => toggleExpand(idx)}
                                className="w-full text-left p-4 bg-gray-100 hover:bg-gray-200 flex justify-between items-center rounded-t-lg"
                            >
                <span className="font-semibold">
                  Solicitud: Semestre {i.semester} {i.year} — {i.status}
                </span>
                                <span>{expandedIndex === idx ? '−' : '+'}</span>
                            </button>

                            {expandedIndex === idx && (
                                <div className="p-4 bg-white space-y-4 rounded-b-lg">
                                    {/* Información del Estudiante */}
                                    <section>
                                        <h2 className="text-lg font-medium mb-1">Información del Estudiante</h2>
                                        <p><strong>Nombre:</strong> {i.names} {i.surnames}</p>
                                        <p><strong>Carrera:</strong> {i.selectedDegreeName}</p>
                                        <p><strong>Facultad:</strong> {i.selectedFacultyName}</p>
                                    </section>

                                    {/* Detalles de la Solicitud */}
                                    <section>
                                        <h2 className="text-lg font-medium mb-1">Detalles de la Solicitud</h2>
                                        <p><strong>Emisión:</strong> {i.issueDate}</p>
                                        <p><strong>Expiración:</strong> {i.expirationDate}</p>
                                        <p><strong>Cita de entrega:</strong> {i.deliveryAppointment}</p>
                                        <p><strong>Notas:</strong> {i.notes}</p>
                                    </section>

                                    {/* Requisito de Pago */}
                                    <section>
                                        <h2 className="text-lg font-medium mb-1">Requisito de Pago</h2>
                                        <p>
                                            <strong>Comprobante:</strong>{' '}
                                            <a
                                                href={i.payment_proof_url}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="text-blue-600 hover:underline"
                                            >
                                                Ver comprobante de pago
                                            </a>
                                        </p>
                                    </section>

                                    {/* Fotografía */}
                                    <section>
                                        <h2 className="text-lg font-medium mb-1">Fotografía</h2>
                                        <p><strong>Fecha agendada:</strong> {i.photoAppointment}</p>
                                        <p>
                                            <strong>Enlace a la foto:</strong>{' '}
                                            <a
                                                href={i.picture_url}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="text-blue-600 hover:underline"
                                            >
                                                Ver fotografía
                                            </a>
                                        </p>
                                    </section>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </AdminLayout>
    );
}
