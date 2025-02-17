import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../../api/axios';

const RegistrarPrestamo = () => {
    const navigate = useNavigate();
    const [herramientas, setHerramientas] = useState([]);
    const [mensaje, setMensaje] = useState({ tipo: '', texto: '' });
    const [formData, setFormData] = useState({
        herramienta_id: '',
        responsable: '',
        lugar_uso: '',
        numero_ticket: '',
        cantidad: 1
    });
    const [cargando, setCargando] = useState(true);
    const [herramientaSeleccionada, setHerramientaSeleccionada] = useState(null);

    useEffect(() => {
        const inicializarFormulario = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    navigate('/login');
                    return;
                }

                // Obtener número de ticket
                const responseTicket = await axios.get('prestamos/generar-ticket', {
                    headers: { Authorization: `Bearer ${token}` }
                });

                if (responseTicket.data.numero_ticket) {
                    setFormData(prev => ({
                        ...prev,
                        numero_ticket: responseTicket.data.numero_ticket
                    }));
                }

                // Obtener herramientas disponibles
                const responseHerramientas = await axios.get('herramientas', {
                    headers: { Authorization: `Bearer ${token}` }
                });

                // Filtrar solo herramientas con cantidad disponible > 0
                const herramientasDisponibles = responseHerramientas.data.filter(
                    h => h.cantidad_disponible > 0
                );
                
                setHerramientas(herramientasDisponibles);
                setCargando(false);
            } catch (error) {
                console.error('Error al inicializar formulario:', error);
                let mensajeError = 'Error al cargar los datos. Por favor, recarga la página.';
                
                if (error.response?.status === 401) {
                    mensajeError = 'Sesión expirada. Por favor, vuelve a iniciar sesión';
                    setTimeout(() => navigate('/login'), 1500);
                }

                setMensaje({
                    tipo: 'error',
                    texto: mensajeError
                });
                setCargando(false);
            }
        };

        inicializarFormulario();
    }, [navigate]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setMensaje({ tipo: '', texto: '' });

        if (name === 'herramienta_id') {
            const herramientaEncontrada = herramientas.find(h => h.id === parseInt(value));
            setHerramientaSeleccionada(herramientaEncontrada);
            
            setFormData(prev => ({
                ...prev,
                [name]: value,
                cantidad: 1
            }));
        } else if (name === 'cantidad') {
            const cantidadNumerica = parseInt(value);
            if (!cantidadNumerica || cantidadNumerica <= 0) {
                setMensaje({
                    tipo: 'error',
                    texto: 'La cantidad debe ser mayor a 0'
                });
                return;
            }
            
            if (herramientaSeleccionada && cantidadNumerica > herramientaSeleccionada.cantidad_disponible) {
                setMensaje({
                    tipo: 'error',
                    texto: `Stock insuficiente. Stock disponible: ${herramientaSeleccionada.cantidad_disponible}`
                });
                return;
            }

            setFormData(prev => ({
                ...prev,
                [name]: cantidadNumerica
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value.trim()
            }));
        }
    };

    const validarFormulario = () => {
        // Validar formato del ticket
        const ticketRegex = /^TICKET-\d{8}-\d{4}$/;
        if (!ticketRegex.test(formData.numero_ticket)) {
            setMensaje({
                tipo: 'error',
                texto: 'Formato de ticket inválido'
            });
            return false;
        }

        // Validar campos requeridos
        const camposFaltantes = [];
        if (!formData.numero_ticket?.trim()) camposFaltantes.push('Número de ticket');
        if (!formData.herramienta_id) camposFaltantes.push('Herramienta');
        if (!formData.responsable?.trim()) camposFaltantes.push('Responsable');
        if (!formData.lugar_uso?.trim()) camposFaltantes.push('Lugar de uso');
        if (!formData.cantidad || formData.cantidad <= 0) camposFaltantes.push('Cantidad');

        if (camposFaltantes.length > 0) {
            setMensaje({
                tipo: 'error',
                texto: `Los siguientes campos son requeridos: ${camposFaltantes.join(', ')}`
            });
            return false;
        }

        // Validar disponibilidad de herramienta
        if (herramientaSeleccionada) {
            if (formData.cantidad > herramientaSeleccionada.cantidad_disponible) {
                setMensaje({
                    tipo: 'error',
                    texto: `Stock insuficiente. Stock disponible: ${herramientaSeleccionada.cantidad_disponible}`
                });
                return false;
            }
        }

        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validarFormulario()) {
            return;
        }

        try {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/login');
                return;
            }

            setCargando(true);
            const response = await axios.post('prestamos', formData, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setMensaje({
                tipo: 'success',
                texto: 'Préstamo registrado exitosamente'
            });

            setTimeout(() => navigate('/prestamos'), 1500);
        } catch (error) {
            console.error('Error al registrar préstamo:', error);
            let mensajeError = 'Error al registrar el préstamo';
            
            if (error.response?.status === 403) {
                mensajeError = 'No tienes permiso para registrar préstamos';
            } else if (error.response?.status === 401) {
                mensajeError = 'Sesión expirada. Por favor, vuelve a iniciar sesión';
                setTimeout(() => navigate('/login'), 1500);
            } else if (error.response?.data?.message) {
                mensajeError = error.response.data.message;
            }
            
            setMensaje({
                tipo: 'error',
                texto: mensajeError
            });
        } finally {
            setCargando(false);
        }
    };

    if (cargando) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="text-lg font-semibold text-gray-600">
                    Cargando...
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-md">
                <h2 className="text-2xl font-bold mb-6 text-gray-800">Registrar Nuevo Préstamo</h2>
                
                {mensaje.texto && (
                    <div className={`p-4 mb-4 rounded-md ${
                        mensaje.tipo === 'success' 
                            ? 'bg-green-100 text-green-700 border border-green-400'
                            : 'bg-red-100 text-red-700 border border-red-400'
                        }`}>
                        {mensaje.texto}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Número de Ticket
                        </label>
                        <input
                            type="text"
                            name="numero_ticket"
                            value={formData.numero_ticket}
                            className="w-full p-2 bg-gray-100 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-gray-700"
                            disabled
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Herramienta
                        </label>
                        <select
                            name="herramienta_id"
                            value={formData.herramienta_id}
                            onChange={handleInputChange}
                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                            required
                        >
                            <option value="">Seleccione una herramienta</option>
                            {herramientas.map(herramienta => (
                                <option key={herramienta.id} value={herramienta.id}>
                                    {herramienta.nombre_herramienta} (Disponible: {herramienta.cantidad_disponible})
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Cantidad
                        </label>
                        <input
                            type="number"
                            name="cantidad"
                            value={formData.cantidad}
                            onChange={handleInputChange}
                            min="1"
                            max={herramientaSeleccionada ? herramientaSeleccionada.cantidad_disponible : 1}
                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                            required
                        />
                        {herramientaSeleccionada && (
                            <p className="text-sm text-gray-600 mt-1">
                                Stock disponible: {herramientaSeleccionada.cantidad_disponible}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Responsable
                        </label>
                        <input
                            type="text"
                            name="responsable"
                            value={formData.responsable}
                            onChange={handleInputChange}
                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Nombre del responsable"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Lugar de Uso
                        </label>
                        <input
                            type="text"
                            name="lugar_uso"
                            value={formData.lugar_uso}
                            onChange={handleInputChange}
                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Ubicación donde se usará la herramienta"
                            required
                        />
                    </div>

                    <div className="flex justify-end space-x-4">
                        <button
                            type="button"
                            onClick={() => navigate('/prestamos')}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={cargando}
                            className={`px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                                cargando ? 'opacity-50 cursor-not-allowed' : ''
                            }`}
                        >
                            {cargando ? 'Registrando...' : 'Registrar Préstamo'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default RegistrarPrestamo;