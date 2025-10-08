import React from 'react';
import Dashboard from './components/Dashboard';
import Login from './components/Login';
import './App.css';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';


function App() {
  return (
    <Router>

      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </Router>
  );

}

export default App;
