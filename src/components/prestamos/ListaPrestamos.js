import React, { useState, useEffect } from "react";
import axios from "../../api/axios";

const ListaPrestamos = () => {
  const [prestamos, setPrestamos] = useState([]);
  const [error, setError] = useState("");
  const [selectedPrestamo, setSelectedPrestamo] = useState(null);
  const [showDevolutionModal, setShowDevolutionModal] = useState(false);
  const [observaciones, setObservaciones] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [pagination, setPagination] = useState({
    total: 0,
    pages: 0,
    currentPage: 1,
    limit: 10
  });

  useEffect(() => {
    cargarPrestamos();
  }, []);

  const cargarPrestamos = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("token");
      const response = await axios.get("prestamos", {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      // Actualizar tanto los préstamos como la paginación
      setPrestamos(response.data.prestamos || []);
      setPagination(response.data.pagination || {
        total: 0,
        pages: 0,
        currentPage: 1,
        limit: 10
      });
      setError("");
    } catch (err) {
      setPrestamos([]);
      setError(err.response?.data?.message || "Error al cargar préstamos");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerDetalles = async (prestamoId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`prestamos/${prestamoId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSelectedPrestamo(response.data);
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Error al cargar detalles del préstamo");
    }
  };

  const handleDevolverPrestamo = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `prestamos/${selectedPrestamo.id}/devolver`,
        { observaciones },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      
      await cargarPrestamos();
      setShowDevolutionModal(false);
      setSelectedPrestamo(null);
      setObservaciones("");
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Error al devolver el préstamo");
    }
  };

  if (isLoading) {
    return (
      <div className="flex-1 container mx-auto px-4 py-8">
        <div className="text-center">
          <p className="text-gray-600">Cargando préstamos...</p>
        </div>
      </div>
    );
  }

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

      {prestamos.length === 0 && !error ? (
        <div className="text-center py-4">
          <p className="text-gray-600">No hay préstamos registrados</p>
        </div>
      ) : (
        <div className="overflow-x-auto bg-white shadow-md rounded-lg">
          <table className="w-full">
            <thead className="bg-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nº Ticket</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Herramienta</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cantidad</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Responsable</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Lugar de Uso</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha Préstamo</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {prestamos.map((prestamo) => (
                <tr key={prestamo.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">{prestamo.numero_ticket}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{prestamo.nombre_herramienta}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{prestamo.cantidad} unidad(es)</td>
                  <td className="px-6 py-4 whitespace-nowrap">{prestamo.responsable}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{prestamo.lugar_uso}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        prestamo.estado === 'Activo'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {prestamo.estado}
                    </span>
                  </td>
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
                    {prestamo.estado === 'Activo' && (
                      <button
                        onClick={() => {
                          setSelectedPrestamo(prestamo);
                          setShowDevolutionModal(true);
                        }}
                        className="text-green-600 hover:text-green-900"
                      >
                        Devolver
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal de Detalles */}
      {selectedPrestamo && !showDevolutionModal && (
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
                <p className="font-semibold">Cantidad:</p>
                <p>{selectedPrestamo.cantidad} unidad(es)</p>
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
                <p className="font-semibold">Estado:</p>
                <p>{selectedPrestamo.estado}</p>
              </div>
              <div>
                <p className="font-semibold">Fecha de Préstamo:</p>
                <p>{new Date(selectedPrestamo.fecha_prestamo).toLocaleString()}</p>
              </div>
              {selectedPrestamo.fecha_devolucion && (
                <div>
                  <p className="font-semibold">Fecha de Devolución:</p>
                  <p>{new Date(selectedPrestamo.fecha_devolucion).toLocaleString()}</p>
                </div>
              )}
              {selectedPrestamo.observaciones && (
                <div>
                  <p className="font-semibold">Observaciones:</p>
                  <p>{selectedPrestamo.observaciones}</p>
                </div>
              )}
              <div>
                <p className="font-semibold">Registrado por:</p>
                <p>{selectedPrestamo.nombre_usuario}</p>
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

      {/* Modal de Devolución */}
      {showDevolutionModal && selectedPrestamo && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
            <h3 className="text-2xl font-semibold mb-6">Devolver Préstamo</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Observaciones
                </label>
                <textarea
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                  rows="4"
                  value={observaciones}
                  onChange={(e) => setObservaciones(e.target.value)}
                  placeholder="Ingrese las observaciones de la devolución..."
                />
              </div>
            </div>
            <div className="mt-6 flex justify-center space-x-4">
              <button
                onClick={() => {
                  setShowDevolutionModal(false);
                  setSelectedPrestamo(null);
                  setObservaciones("");
                }}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
              >
                Cancelar
              </button>
              <button
                onClick={handleDevolverPrestamo}
                className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
              >
                Confirmar Devolución
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ListaPrestamos;