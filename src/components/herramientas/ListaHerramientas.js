import React, { useState, useEffect } from "react";
import axios from "../../api/axios";

const ListaHerramientas = () => {
  const [herramientas, setHerramientas] = useState([]);
  const [error, setError] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(null);

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

  return (
    <div className="flex min-h-screen">
      <div className="flex-1 container mx-auto px-4 py-8">
        <h2 className="text-3xl font-bold mb-6 text-center">Lista de Herramientas</h2>

        {error && (
          <div
            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
            role="alert"
          >
            <span className="block sm:inline">{error}</span>
            <button
              className="absolute top-0 right-0 px-4 py-3"
              onClick={() => setError("")}
            >
              <span className="sr-only">Cerrar</span>
              <svg
                className="h-6 w-6"
                stroke="currentColor"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        )}

        <div className="overflow-x-auto bg-white shadow-md rounded-lg">
          <table className="w-full">
            <thead className="bg-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Responsable</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre Herramienta</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">En Inventario</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">En Préstamo</th>
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
                  <td className="px-6 py-4 whitespace-nowrap">{herramienta.cantidad_total}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{herramienta.cantidad_disponible}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{herramienta.cantidad_prestamo}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {new Date(herramienta.fecha_ingreso).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <button 
                      onClick={() => setConfirmDelete(herramienta.id)} 
                      className="text-red-600 hover:text-red-900"
                      disabled={herramienta.cantidad_prestamo > 0}
                      title={herramienta.cantidad_prestamo > 0 ? 
                        "No se puede eliminar una herramienta con unidades en préstamo" : 
                        "Eliminar herramienta"}
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {confirmDelete && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
              <h3 className="text-2xl font-semibold mb-6 text-center">Confirmar Eliminación</h3>
              <p className="text-center mb-6">¿Está seguro de que desea eliminar esta herramienta?</p>
              <div className="flex justify-center space-x-4">
                <button 
                  onClick={() => setConfirmDelete(null)} 
                  className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
                >
                  Cancelar
                </button>
                <button 
                  onClick={handleEliminarHerramienta} 
                  className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
                >
                  Eliminar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ListaHerramientas;