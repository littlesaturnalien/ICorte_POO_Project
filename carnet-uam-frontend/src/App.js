import React, { useState } from 'react';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';

function App() {
  const [student, setStudent] = useState(null);

  return student ? (
    <Dashboard student={student} onLogout={() => setStudent(null)} />
  ) : (
    <Login onLogin={setStudent} />
  );
}

export default App;
