import React, { useState, useEffect } from "react";
import axios from "../../api/axios";
import Sidebar from "../Sidebar";

const ListaHerramientas = () => {
  const [herramientas, setHerramientas] = useState([]);
  const [error, setError] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [editingHerramienta, setEditingHerramienta] = useState(null);

  // Cargar herramientas
  useEffect(() => {
    const cargarHerramientas = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("/herramientas", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setHerramientas(response.data);
      } catch (err) {
        setError(err.response?.data?.message || "Error al cargar herramientas");
      }
    };

    cargarHerramientas();
  }, []);

  // Manejar eliminación
  const handleEliminarHerramienta = async () => {
    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`/herramientas/${confirmDelete}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setHerramientas(herramientas.filter((herramienta) => herramienta.id !== confirmDelete));
      setConfirmDelete(null);
    } catch (err) {
      setError(err.response?.data?.message || "Error al eliminar herramienta");
    }
  };

  // Abrir modal de edición
  const handleEditarHerramienta = async (herramientaId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`/herramientas/${herramientaId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEditingHerramienta(response.data);
    } catch (err) {
      setError(err.response?.data?.message || "Error al cargar herramienta");
    }
  };

  // Manejar cambios en formulario de edición
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditingHerramienta((prev) => ({
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
        `/herramientas/${editingHerramienta.id}`,
        editingHerramienta,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Actualizar lista de herramientas
      setHerramientas(
        herramientas.map((h) =>
          h.id === editingHerramienta.id ? response.data.herramienta : h
        )
      );

      // Cerrar modal
      setEditingHerramienta(null);
    } catch (err) {
      setError(err.response?.data?.message || "Error al actualizar herramienta");
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Contenido principal */}
      <div className="flex-1 container mx-auto px-4 py-8">
        <h2 className="text-3xl font-bold mb-6 text-center">Lista de Herramientas</h2>

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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Responsable</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre Herramienta</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cantidad</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha Ingreso</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {herramientas.map((herramienta) => (
                <tr key={herramienta.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">{herramienta.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{herramienta.responsable}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{herramienta.nombre_herramienta}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{herramienta.cantidad}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      herramienta.estado === "En inventario" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                    }`}>
                      {herramienta.estado}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {new Date(herramienta.fecha_ingreso).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <button onClick={() => handleEditarHerramienta(herramienta.id)} className="text-blue-600 hover:text-blue-900 mr-3">
                      Editar
                    </button>
                    <button onClick={() => setConfirmDelete(herramienta.id)} className="text-red-600 hover:text-red-900">
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
              <p className="text-center mb-6">¿Está seguro de que desea eliminar esta herramienta?</p>
              <div className="flex justify-center space-x-4">
                <button onClick={() => setConfirmDelete(null)} className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded">
                  Cancelar
                </button>
                <button onClick={handleEliminarHerramienta} className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded">
                  Eliminar
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal de Edición */}
        {editingHerramienta && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
              <h3 className="text-2xl font-semibold mb-6">Editar Herramienta</h3>
              <form onSubmit={handleSaveEdit} className="space-y-4">
                <div>
                  <label className="block text-gray-700 mb-2">Responsable</label>
                  <input
                    type="text"
                    name="responsable"
                    value={editingHerramienta.responsable}
                    onChange={handleEditChange}
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-2">Nombre Herramienta</label>
                  <input
                    type="text"
                    name="nombre_herramienta"
                    value={editingHerramienta.nombre_herramienta}
                    onChange={handleEditChange}
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-2">Cantidad</label>
                  <input
                    type="number"
                    name="cantidad"
                    value={editingHerramienta.cantidad}
                    onChange={handleEditChange}
                    className="w-full p-2 border rounded"
                    required
                    min="1"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-2">Estado</label>
                  <select
                    name="estado"
                    value={editingHerramienta.estado}
                    onChange={handleEditChange}
                    className="w-full p-2 border rounded"
                  >
                    <option value="En inventario">En inventario</option>
                    <option value="En prestamo">En préstamo</option>
                  </select>
                </div>
                <div className="flex justify-between">
                  <button type="button" onClick={() => setEditingHerramienta(null)} className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded">
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

export default ListaHerramientas;