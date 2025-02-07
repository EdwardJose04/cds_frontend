import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Register from './components/auth/Register';
import Dashboard from './components/Dashboard';
import ProtectedRoute from './components/auth/ProtectedRoute';
import Login from './components/auth/Login';
import ListaUsuarios from './components/usuarios/ListaUsuarios';
import Layout from './components/Layout';
import RegistrarHerramienta from './components/herramientas/RegistrarHerramienta';
import ListaHerramientas from './components/herramientas/ListaHerramientas';

function App() {
  return (
    <Router>
      <Routes>
        {/* Rutas públicas */}
        <Route path="/" element={<Login />} />

        {/* Rutas protegidas con Layout */}
        <Route element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }>
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/usuarios" element={<ListaUsuarios />} />
          <Route path="/herramientas/crear" element={<RegistrarHerramienta />} />
          <Route path="/herramientas" element={<ListaHerramientas />} />
          {/* Aquí puedes agregar más rutas protegidas que usarán el Layout */}
        </Route>
      </Routes>
    </Router>
  );
}

export default App;