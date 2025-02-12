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
import RegistrarProducto from './components/productos/RegistrarProducto';
import ListaProductos from './components/productos/ListaProductos';
import RegistrarPrestamo from './components/prestamos/RegistrarPrestamo';
import ListaPrestamos from './components/prestamos/ListaPrestamos';

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
          <Route path="/productos/crear" element={<RegistrarProducto/>} />
          <Route path="/productos" element={<ListaProductos/>} />
          <Route path="/prestamos/solicitar" element={<RegistrarPrestamo/>} />
          <Route path="/prestamos" element={<ListaPrestamos/>} />
          {/* Aquí puedes agregar más rutas protegidas que usarán el Layout */}
        </Route>
      </Routes>
    </Router>
  );
}

export default App;