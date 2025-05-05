// src/pages/admin/CreateUserPage.jsx
import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import AdminLayout from '../../layouts/AdminLayout';
import { useNavigate } from 'react-router-dom';

const CreateUser = () => {
    const [degrees, setDegrees] = useState([]);
    const [showDropdown1, setShowDropdown1] = useState(false);
    const [showDropdown2, setShowDropdown2] = useState(false);
    const [selectedDegree1, setSelectedDegree1] = useState(null);
    const [selectedDegree2, setSelectedDegree2] = useState(null);
    const dropdownRef1 = useRef(null);
    const dropdownRef2 = useRef(null);
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        cif: '',
        password: '',
        names: '',
        surnames: '',
        email: '',
        role: '',
        type: '',
    });

    useEffect(() => {
        const fetchDegrees = async () => {
            try {
                const res = await axios.get('http://localhost:8087/uam-carnet-sys/degree');
                setDegrees(res.data);
            } catch (err) {
                console.error("Error al cargar carreras:", err);
            }
        };
        fetchDegrees();

        const handleClickOutside = (e) => {
            if (dropdownRef1.current && !dropdownRef1.current.contains(e.target)) setShowDropdown1(false);
            if (dropdownRef2.current && !dropdownRef2.current.contains(e.target)) setShowDropdown2(false);
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedDegree1) {
            alert("Debes seleccionar al menos una carrera obligatoria");
            return;
        }
        const degreesToSend = selectedDegree2
            ? [selectedDegree1, selectedDegree2]
            : [selectedDegree1];
        try {
            await axios.post('http://localhost:8087/uam-carnet-sys/user/create', {
                ...formData,
                degrees: degreesToSend,
            });
            alert('Usuario creado correctamente');
            navigate('/admin/usuarios');
        } catch (err) {
            console.error("Error al crear usuario:", err);
        }
    };

    const renderDropdown = ({ label, selected, onSelect, show, setShow, refEl, isRequired }) => (
        <div className="col-span-2 relative" ref={refEl}>
            <label className="block mb-1 text-gray-700 font-medium">
                {label} {isRequired && <span className="text-red-500">*</span>}
            </label>
            <div
                className="border px-3 py-2 rounded bg-white cursor-pointer"
                onClick={() => setShow(!show)}
            >
        <span className="text-gray-800">
          {selected
              ? degrees.find((d) => d.degreeId === selected)?.degreeName
              : `Selecciona una carrera${isRequired ? ' (obligatoria)' : ' (opcional)'}`}
        </span>
            </div>
            {show && (
                <div className="absolute z-10 mt-1 w-full max-h-60 overflow-y-auto bg-white border rounded shadow">
                    <div className="px-4 py-2 text-right border-b">
                        <button
                            type="button"
                            onClick={() => onSelect(null)}
                            className="text-sm text-red-600 hover:underline"
                        >
                            Limpiar selección
                        </button>
                    </div>
                    {degrees.map((d) => (
                        <div
                            key={d.degreeId}
                            onClick={() => { onSelect(d.degreeId); setShow(false); }}
                            className={`px-4 py-2 hover:bg-blue-100 cursor-pointer ${
                                selected === d.degreeId ? 'bg-blue-50 font-semibold' : ''
                            }`}
                        >
                            {d.degreeName} – {d.facultyName}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );

    return (
        <AdminLayout>
            <div className="max-w-4xl mx-auto mt-10 bg-white p-6 rounded shadow">
                <h2 className="text-2xl font-bold mb-4">Crear Nuevo Usuario</h2>
                <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
                    <input
                        type="text"
                        required
                        placeholder="CIF"
                        value={formData.cif}
                        onChange={(e) => setFormData({ ...formData, cif: e.target.value })}
                        className="border px-3 py-2 rounded"
                    />
                    <input
                        type="password"
                        required
                        placeholder="PASSWORD"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        className="border px-3 py-2 rounded"
                    />
                    <input
                        type="text"
                        required
                        placeholder="NAMES"
                        value={formData.names}
                        onChange={(e) => setFormData({ ...formData, names: e.target.value })}
                        className="border px-3 py-2 rounded"
                    />
                    <input
                        type="text"
                        required
                        placeholder="SURNAMES"
                        value={formData.surnames}
                        onChange={(e) => setFormData({ ...formData, surnames: e.target.value })}
                        className="border px-3 py-2 rounded"
                    />
                    <input
                        type="email"
                        required
                        placeholder="EMAIL"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="border px-3 py-2 rounded"
                    />

                    {/* Rol predefinido */}
                    <select
                        value={formData.role}
                        onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                        className="border px-3 py-2 rounded"
                        required
                    >
                        <option value="">Selecciona un rol</option>
                        <option value="ADMIN">ADMIN</option>
                        <option value="SUPERADMIN">SUPERADMIN</option>
                        <option value="BLOCKED">BLOCKED</option>
                        <option value="STUDENT">STUDENT</option>
                    </select>

                    {/* Tipo predefinido */}
                    <select
                        value={formData.type}
                        onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                        className="border px-3 py-2 rounded"
                        required
                    >
                        <option value="">Selecciona un tipo</option>
                        <option value="Profesor">Profesor</option>
                        <option value="Estudiante">Estudiante</option>
                    </select>

                    {renderDropdown({
                        label: 'Carrera principal',
                        selected: selectedDegree1,
                        onSelect: setSelectedDegree1,
                        show: showDropdown1,
                        setShow: setShowDropdown1,
                        refEl: dropdownRef1,
                        isRequired: true,
                    })}

                    {renderDropdown({
                        label: 'Carrera secundaria (opcional)',
                        selected: selectedDegree2,
                        onSelect: setSelectedDegree2,
                        show: showDropdown2,
                        setShow: setShowDropdown2,
                        refEl: dropdownRef2,
                        isRequired: false,
                    })}

                    <div className="col-span-2 flex justify-end gap-2 mt-4">
                        <button
                            type="submit"
                            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                        >
                            Guardar
                        </button>
                        <button
                            type="button"
                            onClick={() => navigate('/admin/users')}
                            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                        >
                            Cancelar
                        </button>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
};

export default CreateUser;
