import React, { useState, useEffect } from "react";
import axios from "../../api/axios";
import Sidebar from "../Sidebar";

const ListaUsuarios = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [error, setError] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [editingUser, setEditingUser] = useState(null);

  // Cargar usuarios
  useEffect(() => {
    const cargarUsuarios = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("/usuarios", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsuarios(response.data);
      } catch (err) {
        setError(err.response?.data?.message || "Error al cargar usuarios");
      }
    };

    cargarUsuarios();
  }, []);

  // Manejar eliminación
  const handleEliminarUsuario = async () => {
    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`/usuarios/${confirmDelete}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setUsuarios(usuarios.filter((usuario) => usuario.id !== confirmDelete));
      setConfirmDelete(null);
    } catch (err) {
      setError(err.response?.data?.message || "Error al eliminar usuario");
    }
  };

  // Abrir modal de edición
  const handleEditarUsuario = async (usuarioId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`/usuarios/${usuarioId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEditingUser(response.data);
    } catch (err) {
      setError(err.response?.data?.message || "Error al cargar usuario");
    }
  };

  // Manejar cambios en formulario de edición
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditingUser((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Guardar edición
  const handleSaveEdit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        `/usuarios/${editingUser.id}`,
        editingUser,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Actualizar lista de usuarios
      setUsuarios(
        usuarios.map((u) =>
          u.id === editingUser.id ? response.data.usuario : u
        )
      );

      // Cerrar modal
      setEditingUser(null);
    } catch (err) {
      setError(err.response?.data?.message || "Error al actualizar usuario");
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <Sidebar />
  
      {/* Contenido principal */}
      <div className="flex-1 container mx-auto px-4 py-8 ml-64">
        <h2 className="text-3xl font-bold mb-6 text-center">Lista de Usuarios</h2>
  
        {/* Mostrar mensaje de error si existe */}
        {error && (
          <div
            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
            role="alert"
          >
            <span className="block sm:inline">{error}</span>
          </div>
        )}
  
        <div className="overflow-x-auto bg-white shadow-md rounded-lg">
          <table className="w-full">
            <thead className="bg-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Número de Documento</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre Completo</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Correo Electrónico</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rol</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {usuarios.map((usuario) => (
                <tr key={usuario.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">{usuario.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{usuario.numero_documento}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{usuario.nombre_completo}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{usuario.correo_electronico}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      usuario.rol === "Administrador" ? "bg-blue-100 text-blue-800" : "bg-green-100 text-green-800"
                    }`}>
                      {usuario.rol}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <button onClick={() => handleEditarUsuario(usuario.id)} className="text-blue-600 hover:text-blue-900 mr-3">
                      Editar
                    </button>
                    <button onClick={() => setConfirmDelete(usuario.id)} className="text-red-600 hover:text-red-900">
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
  
        {/* Modal de Confirmación de Eliminación */}
        {confirmDelete && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
              <h3 className="text-2xl font-semibold mb-6 text-center">Confirmar Eliminación</h3>
              <p className="text-center mb-6">¿Está seguro de que desea eliminar este usuario?</p>
              <div className="flex justify-center space-x-4">
                <button onClick={() => setConfirmDelete(null)} className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded">
                  Cancelar
                </button>
                <button onClick={handleEliminarUsuario} className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded">
                  Eliminar
                </button>
              </div>
            </div>
          </div>
        )}
  
        {/* Modal de Edición */}
        {editingUser && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
              <h3 className="text-2xl font-semibold mb-6">Editar Usuario</h3>
              <form onSubmit={handleSaveEdit} className="space-y-4">
                <div>
                  <label className="block text-gray-700 mb-2">Número de Documento</label>
                  <input
                    type="text"
                    name="numero_documento"
                    value={editingUser.numero_documento}
                    onChange={handleEditChange}
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-2">Nombre Completo</label>
                  <input
                    type="text"
                    name="nombre_completo"
                    value={editingUser.nombre_completo}
                    onChange={handleEditChange}
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-2">Correo Electrónico</label>
                  <input
                    type="email"
                    name="correo_electronico"
                    value={editingUser.correo_electronico}
                    onChange={handleEditChange}
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-2">Rol</label>
                  <select
                    name="rol"
                    value={editingUser.rol}
                    onChange={handleEditChange}
                    className="w-full p-2 border rounded"
                  >
                    <option value="Empleado">Empleado</option>
                    <option value="Administrador">Administrador</option>
                  </select>
                </div>
                <div className="flex justify-between">
                  <button type="button" onClick={() => setEditingUser(null)} className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded">
                    Cancelar
                  </button>
                  <button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
                    Guardar Cambios
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
  
};

export default ListaUsuarios;
