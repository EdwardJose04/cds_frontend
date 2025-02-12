import React, { useState } from 'react';
import useReportes from './hooks/useReportes';

const RegistrarReporte = () => {
    const { productos, crearReporte, loading, error } = useReportes();
    const [formData, setFormData] = useState({
        producto_id: '',
        cantidad_retirada: '',
        responsable: '',
        motivo: ''
    });
    const [mensaje, setMensaje] = useState({ tipo: '', texto: '' });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const resultado = await crearReporte(formData);
        
        if (resultado.success) {
            setMensaje({ tipo: 'success', texto: 'Reporte creado exitosamente' });
            setFormData({
                producto_id: '',
                cantidad_retirada: '',
                responsable: '',
                motivo: ''
            });
        } else {
            setMensaje({ tipo: 'error', texto: resultado.error || 'Error al crear el reporte' });
        }
    };

    return (
        <div className="p-6 bg-white rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-6">Registrar Salida de Producto</h2>
            
            {mensaje.texto && (
                <div className={`p-4 mb-4 rounded ${
                    mensaje.tipo === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                }`}>
                    {mensaje.texto}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        Producto
                    </label>
                    <select
                        name="producto_id"
                        value={formData.producto_id}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        required
                    >
                        <option value="">Seleccione un producto</option>
                        {productos.map(producto => (
                            <option key={producto.id} value={producto.id}>
                                {producto.nombre} - Stock: {producto.cantidad}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        Cantidad a Retirar
                    </label>
                    <input
                        type="number"
                        name="cantidad_retirada"
                        value={formData.cantidad_retirada}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        required
                        min="1"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        Responsable
                    </label>
                    <input
                        type="text"
                        name="responsable"
                        value={formData.responsable}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        Motivo
                    </label>
                    <textarea
                        name="motivo"
                        value={formData.motivo}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        rows="3"
                        required
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                        loading ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'
                    } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
                >
                    {loading ? 'Registrando...' : 'Registrar Salida'}
                </button>
            </form>
        </div>
    );
};

export default RegistrarReporte;