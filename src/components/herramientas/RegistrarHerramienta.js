import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../../api/axios';

const RegistrarHerramienta = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        responsable: '',
        nombre_herramienta: '',
        cantidad: '',
        estado: 'En inventario'
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            // Validaciones
            if (!formData.responsable || !formData.nombre_herramienta || !formData.cantidad) {
                setError('Todos los campos son obligatorios');
                return;
            }

            if (formData.cantidad <= 0) {
                setError('La cantidad debe ser mayor a 0');
                return;
            }

            const token = localStorage.getItem('token');
            await axios.post('/herramientas', formData, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            alert('Herramienta registrada exitosamente');
            navigate('/herramientas');

        } catch (error) {
            console.error('Error al registrar la herramienta:', error);
            setError(error.response?.data?.message || 'Error al registrar la herramienta');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-md">
                <h2 className="text-2xl font-bold mb-6 text-gray-800">Registrar Nueva Herramienta</h2>
                
                {error && (
                    <div className="mb-4 p-4 text-red-700 bg-red-100 rounded-md">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Responsable
                        </label>
                        <input
                            type="text"
                            name="responsable"
                            value={formData.responsable}
                            onChange={handleChange}
                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Nombre del responsable"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Nombre de la Herramienta
                        </label>
                        <input
                            type="text"
                            name="nombre_herramienta"
                            value={formData.nombre_herramienta}
                            onChange={handleChange}
                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Nombre de la herramienta"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Cantidad
                        </label>
                        <input
                            type="number"
                            name="cantidad"
                            value={formData.cantidad}
                            onChange={handleChange}
                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Cantidad"
                            min="1"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Estado
                        </label>
                        <select
                            name="estado"
                            value={formData.estado}
                            onChange={handleChange}
                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="En inventario">En inventario</option>
                            <option value="En prestamo">En préstamo</option>
                        </select>
                    </div>

                    <div className="flex justify-end space-x-4">
                        <button
                            type="button"
                            onClick={() => navigate('/herramientas')}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className={`px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                                isLoading ? 'opacity-50 cursor-not-allowed' : ''
                            }`}
                        >
                            {isLoading ? 'Registrando...' : 'Registrar Herramienta'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default RegistrarHerramienta;