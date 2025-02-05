import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Register from './components/auth/Register';
import Dashboard from './components/Dashboard';
import ProtectedRoute from './components/auth/ProtectedRoute';
import Login from './components/auth/Login';
import ListaUsuarios from './components/usuarios/ListaUsuarios';
import Layout from './components/Layout';

function App() {
  return (
    <Router>
      <Routes>
        {/* Rutas públicas */}
        <Route path="/login" element={<Login />} />

        {/* Rutas protegidas con Layout */}
        <Route element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }>
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<Dashboard />} />
          <Route path="/usuarios" element={<ListaUsuarios />} />
          {/* Aquí puedes agregar más rutas protegidas que usarán el Layout */}
        </Route>
      </Routes>
    </Router>
  );
}

export default App;