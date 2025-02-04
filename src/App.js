import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Register from './components/auth/Register';
import Dashboard from './components/Dashboard';
import ProtectedRoute from './components/auth/ProtectedRoute';
import Login from './components/auth/Login';
import ListaUsuarios from './components/usuarios/ListaUsuarios'; // Nuevo import

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/usuarios" element={
          <ProtectedRoute>
            <ListaUsuarios />
          </ProtectedRoute>
        } />
        <Route 
          path="/" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </Router>
  );
}

export default App;