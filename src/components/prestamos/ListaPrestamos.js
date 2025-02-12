import React, { useState, useEffect } from "react";
import axios from "../../api/axios";

const ListaPrestamos = () => {
  const [prestamos, setPrestamos] = useState([]);
  const [error, setError] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [selectedPrestamo, setSelectedPrestamo] = useState(null);

  useEffect(() => {
    const cargarPrestamos = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("prestamos", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPrestamos(response.data);
      } catch (err) {
        setError(err.response?.data?.message || "Error al cargar préstamos");
      }
    };

    cargarPrestamos();
  }, []);

  const handleEliminarPrestamo = async () => {
    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`prestamos/${confirmDelete}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setPrestamos(prestamos.filter((prestamo) => prestamo.id !== confirmDelete));
      setConfirmDelete(null);
    } catch (err) {
      setError(err.response?.data?.message || "Error al eliminar préstamo");
    }
  };

  const handleVerDetalles = async (prestamoId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`prestamos/${prestamoId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSelectedPrestamo(response.data);
    } catch (err) {
      setError(err.response?.data?.message || "Error al cargar detalles del préstamo");
    }
  };

  return (
    <div className="flex-1 container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold mb-6 text-center">Lista de Préstamos</h2>

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
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nº Ticket</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Herramienta</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Responsable</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Lugar de Uso</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha Préstamo</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {prestamos.map((prestamo) => (
              <tr key={prestamo.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">{prestamo.numero_ticket}</td>
                <td className="px-6 py-4 whitespace-nowrap">{prestamo.nombre_herramienta}</td>
                <td className="px-6 py-4 whitespace-nowrap">{prestamo.responsable}</td>
                <td className="px-6 py-4 whitespace-nowrap">{prestamo.lugar_uso}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {new Date(prestamo.fecha_prestamo).toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  <button
                    onClick={() => handleVerDetalles(prestamo.id)}
                    className="text-blue-600 hover:text-blue-900 mr-3"
                  >
                    Ver Detalles
                  </button>
                  <button
                    onClick={() => setConfirmDelete(prestamo.id)}
                    className="text-red-600 hover:text-red-900"
                  >
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
            <p className="text-center mb-6">¿Está seguro de que desea eliminar este préstamo?</p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={() => setConfirmDelete(null)}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
              >
                Cancelar
              </button>
              <button
                onClick={handleEliminarPrestamo}
                className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Detalles */}
      {selectedPrestamo && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
            <h3 className="text-2xl font-semibold mb-6">Detalles del Préstamo</h3>
            <div className="space-y-4">
              <div>
                <p className="font-semibold">Número de Ticket:</p>
                <p>{selectedPrestamo.numero_ticket}</p>
              </div>
              <div>
                <p className="font-semibold">Herramienta:</p>
                <p>{selectedPrestamo.nombre_herramienta}</p>
              </div>
              <div>
                <p className="font-semibold">Responsable:</p>
                <p>{selectedPrestamo.responsable}</p>
              </div>
              <div>
                <p className="font-semibold">Lugar de Uso:</p>
                <p>{selectedPrestamo.lugar_uso}</p>
              </div>
              <div>
                <p className="font-semibold">Fecha de Préstamo:</p>
                <p>{new Date(selectedPrestamo.fecha_prestamo).toLocaleString()}</p>
              </div>
            </div>
            <div className="mt-6 flex justify-center">
              <button
                onClick={() => setSelectedPrestamo(null)}
                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ListaPrestamos;