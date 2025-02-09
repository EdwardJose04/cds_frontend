import React, { useState, useEffect } from "react";
import axios from "../../api/axios";

const ListaProductos = () => {
  const [productos, setProductos] = useState([]);
  const [error, setError] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [editingProducto, setEditingProducto] = useState(null);

  // Cargar productos
  useEffect(() => {
    const cargarProductos = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("/productos", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProductos(response.data);
      } catch (err) {
        setError(err.response?.data?.message || "Error al cargar productos");
      }
    };

    cargarProductos();
  }, []);

  // Manejar eliminación
  const handleEliminarProducto = async () => {
    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`/productos/${confirmDelete}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setProductos(productos.filter((producto) => producto.id !== confirmDelete));
      setConfirmDelete(null);
    } catch (err) {
      if (err.response?.status === 403) {
        setError("No tienes permiso para eliminar productos");
      } else {
        setError(err.response?.data?.message || "Error al eliminar producto");
      }
    }
  };

  // Abrir modal de edición
  const handleEditarProducto = async (productoId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`/productos/${productoId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEditingProducto(response.data);
    } catch (err) {
      setError(err.response?.data?.message || "Error al cargar producto");
    }
  };

  // Manejar cambios en formulario de edición
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditingProducto((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Guardar edición
  const handleSaveEdit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `/productos/${editingProducto.id}`,
        editingProducto,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Actualizar lista de productos
      setProductos(
        productos.map((p) =>
          p.id === editingProducto.id ? editingProducto : p
        )
      );

      // Cerrar modal
      setEditingProducto(null);
    } catch (err) {
      if (err.response?.status === 403) {
        setError("No tienes permiso para actualizar productos");
      } else if (err.response?.status === 400 && err.response?.data?.message.includes('código')) {
        setError("Ya existe otro producto con este código");
      } else {
        setError(err.response?.data?.message || "Error al actualizar producto");
      }
    }
  };

  return (
    <div className="flex min-h-screen">
      <div className="flex-1 container mx-auto px-4 py-8">
        <h2 className="text-3xl font-bold mb-6 text-center">Lista de Productos</h2>

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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cantidad</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Código</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Responsable</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha Ingreso</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {productos.map((producto) => (
                <tr key={producto.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">{producto.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{producto.nombre}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{producto.cantidad}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{producto.codigo}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{producto.responsable}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {new Date(producto.fecha_ingreso).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <button onClick={() => handleEditarProducto(producto.id)} className="text-blue-600 hover:text-blue-900 mr-3">
                      Editar
                    </button>
                    <button onClick={() => setConfirmDelete(producto.id)} className="text-red-600 hover:text-red-900">
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
              <p className="text-center mb-6">¿Está seguro de que desea eliminar este producto?</p>
              <div className="flex justify-center space-x-4">
                <button onClick={() => setConfirmDelete(null)} className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded">
                  Cancelar
                </button>
                <button onClick={handleEliminarProducto} className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded">
                  Eliminar
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal de Edición */}
        {editingProducto && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
              <h3 className="text-2xl font-semibold mb-6">Editar Producto</h3>
              <form onSubmit={handleSaveEdit} className="space-y-4">
                <div>
                  <label className="block text-gray-700 mb-2">Nombre</label>
                  <input
                    type="text"
                    name="nombre"
                    value={editingProducto.nombre}
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
                    value={editingProducto.cantidad}
                    onChange={handleEditChange}
                    className="w-full p-2 border rounded"
                    required
                    min="1"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-2">Código</label>
                  <input
                    type="text"
                    name="codigo"
                    value={editingProducto.codigo}
                    onChange={handleEditChange}
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-2">Responsable</label>
                  <input
                    type="text"
                    name="responsable"
                    value={editingProducto.responsable}
                    onChange={handleEditChange}
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>
                <div className="flex justify-between">
                  <button type="button" onClick={() => setEditingProducto(null)} className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded">
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

export default ListaProductos;