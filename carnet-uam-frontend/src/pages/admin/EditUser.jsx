import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import AdminLayout from '../../layouts/AdminLayout';

const EditUserPage = () => {
    const { cif } = useParams();
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [degrees, setDegrees] = useState([]);
    const [selectedDegreeToAdd, setSelectedDegreeToAdd] = useState('');
    const [newPassword, setNewPassword] = useState('');

    const fetchUser = async () => {
        try {
            const res = await axios.get(`http://localhost:8087/uam-carnet-sys/user/byCif=${cif}`);
            setUser(res.data[0]);
        } catch (err) {
            console.error("Error al obtener usuario:", err);
        }
    };

    const fetchDegrees = async () => {
        try {
            const res = await axios.get('http://localhost:8087/uam-carnet-sys/degree');
            setDegrees(res.data);
        } catch (err) {
            console.error("Error al cargar carreras:", err);
        }
    };

    const addDegree = async () => {
        try {
            await axios.patch(`http://localhost:8087/uam-carnet-sys/user/cif=${cif}/setDegree=${selectedDegreeToAdd}`);
            alert("Carrera agregada");
            fetchUser();
        } catch (err) {
            console.error("Error al agregar carrera:", err);
        }
    };

    const removeDegree = async (degreeId) => {
        try {
            await axios.patch(`http://localhost:8087/uam-carnet-sys/user/cif=${cif}/removeDegree=${degreeId}`);
            alert("Carrera eliminada");
            fetchUser();
        } catch (err) {
            console.error("Error al eliminar carrera:", err);
        }
    };

    const updatePassword = async () => {
        try {
            await axios.patch(`http://localhost:8087/uam-carnet-sys/user/cif=${cif}/setPassword=${newPassword}`);
            alert("Contraseña actualizada");
            setNewPassword('');
        } catch (err) {
            console.error("Error al cambiar contraseña:", err);
        }
    };

    useEffect(() => {
        fetchUser();
        fetchDegrees();
    }, []);

    if (!user) {
        return (
            <AdminLayout>
                <div className="p-10">Cargando usuario...</div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout>
            <div className="max-w-4xl mx-auto mt-10 bg-white p-6 rounded shadow">
                <h2 className="text-2xl font-bold mb-6">Editar Usuario: {user.names} {user.surnames}</h2>

                {/* Datos básicos */}
                <div className="mb-6">
                    <p><strong>CIF:</strong> {user.cif}</p>
                    <p><strong>Correo:</strong> {user.email}</p>
                    <p><strong>Rol:</strong> {user.role}</p>
                    <p><strong>Tipo:</strong> {user.type}</p>
                </div>

                {/* Actualizar contraseña */}
                <div className="mb-6">
                    <label className="block font-medium mb-1">Nueva Contraseña</label>
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="border px-3 py-2 rounded w-full"
                            placeholder="Escribe la nueva contraseña"
                        />
                        <button onClick={updatePassword} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                            Actualizar
                        </button>
                    </div>
                </div>

                {/* Carreras actuales */}
                <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-2">Carreras actuales</h3>
                    {user.studies?.length > 0 ? (
                        <ul className="list-disc ml-6">
                            {user.studies.map((s) => (
                                <li key={s.degreeId} className="mb-1 flex items-center justify-between">
                                    <span>{s.degreeName} – {s.facultyName}</span>
                                    <button
                                        onClick={() => removeDegree(s.degreeId)}
                                        className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 ml-4"
                                    >
                                        Eliminar
                                    </button>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-gray-600">Este usuario no tiene carreras asignadas.</p>
                    )}
                </div>

                {/* Agregar nueva carrera */}
                <div className="mb-6">
                    <label className="block font-medium mb-1">Agregar carrera</label>
                    <div className="flex gap-2">
                        <select
                            value={selectedDegreeToAdd}
                            onChange={(e) => setSelectedDegreeToAdd(e.target.value)}
                            className="border px-3 py-2 rounded w-full"
                        >
                            <option value="">Selecciona una carrera</option>
                            {degrees.map((d) => (
                                <option key={d.degreeId} value={d.degreeId}>
                                    {d.degreeName} – {d.facultyName}
                                </option>
                            ))}
                        </select>
                        <button
                            onClick={addDegree}
                            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                            disabled={!selectedDegreeToAdd}
                        >
                            Agregar
                        </button>
                    </div>
                </div>

                {/* Volver */}
                <div className="text-right">
                    <button
                        onClick={() => navigate('/admin/users')}
                        className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
                    >
                        Volver
                    </button>
                </div>
            </div>
        </AdminLayout>
    );
};

export default EditUserPage;
