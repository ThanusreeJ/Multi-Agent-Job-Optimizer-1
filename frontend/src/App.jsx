import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ModeSelection from './pages/ModeSelection';
import Dashboard from './pages/Dashboard';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ModeSelection />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
