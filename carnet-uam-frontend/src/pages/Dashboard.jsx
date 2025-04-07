import { useEffect, useState } from "react";

const Dashboard = () => {
    const [student, setStudent] = useState(null);

    useEffect(() => {
        const data = localStorage.getItem("student");
        if (data) {
            setStudent(JSON.parse(data));
        }
    }, []);

    if (!student) return <p className="text-center mt-20">Cargando...</p>;

    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Bienvenido, {student.name}</h1>
        <p><strong>CIF:</strong> {student.cif}</p>
        <p><strong>Carrera:</strong> {student.major}</p>
        
      </div>
    );
  };
  
  export default Dashboard;