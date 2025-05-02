import React from 'react';

const Dashboard = ({ student, onLogout }) => {
  return (
    <div className="p-6 bg-green-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Welcome, {student.name}</h1>
      <p><strong>CIF:</strong> {student.cif}</p>
      <button
        onClick={onLogout}
        className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
      >
        Log Out
      </button>
    </div>
  );
};

export default Dashboard;
