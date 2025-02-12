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
        numero_ticket: ''
    });
    const [cargando, setCargando] = useState(true);

    useEffect(() => {
        const inicializarFormulario = async () => {
            try {
                // Obtener número de ticket primero
                const token = localStorage.getItem('token');
                console.log('Obteniendo ticket con token:', !!token);
                
                const responseTicket = await axios.get('prestamos/generar-ticket', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                
                console.log('Respuesta ticket:', responseTicket.data);

                // Actualizar el número de ticket en el estado
                setFormData(prev => ({
                    ...prev,
                    numero_ticket: responseTicket.data.numero_ticket
                }));

                // Obtener herramientas disponibles
                const responseHerramientas = await axios.get('herramientas');
                console.log('Herramientas obtenidas:', responseHerramientas.data);
                
                const herramientasDisponibles = responseHerramientas.data.filter(
                    h => h.estado === 'En inventario'
                );
                console.log('Herramientas disponibles:', herramientasDisponibles);
                
                setHerramientas(herramientasDisponibles);
                setCargando(false);
            } catch (error) {
                console.error('Error detallado al inicializar formulario:', error);
                console.error('Respuesta del servidor:', error.response?.data);
                setMensaje({
                    tipo: 'error',
                    texto: error.response?.data?.message || 'Error al cargar los datos iniciales'
                });
                setCargando(false);
            }
        };

        inicializarFormulario();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        console.log(`Cambiando campo ${name} a:`, value);
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log('Estado del formulario antes de enviar:', formData);

        // Verificación detallada de campos
        const camposFaltantes = [];
        if (!formData.numero_ticket) camposFaltantes.push('numero_ticket');
        if (!formData.herramienta_id) camposFaltantes.push('herramienta_id');
        if (!formData.responsable) camposFaltantes.push('responsable');
        if (!formData.lugar_uso) camposFaltantes.push('lugar_uso');

        if (camposFaltantes.length > 0) {
            console.log('Campos faltantes:', camposFaltantes);
            setMensaje({
                tipo: 'error',
                texto: `Campos faltantes: ${camposFaltantes.join(', ')}`
            });
            return;
        }

        try {
            const token = localStorage.getItem('token');
            console.log('Token presente:', !!token);
            console.log('Datos a enviar:', formData);

            const response = await axios.post('prestamos', formData, {
                headers: { Authorization: `Bearer ${token}` }
            });

            console.log('Respuesta del servidor:', response.data);

            setMensaje({
                tipo: 'success',
                texto: 'Préstamo registrado exitosamente'
            });

            // Redireccionar después de un breve delay
            setTimeout(() => navigate('/prestamos'), 1500);
        } catch (error) {
            console.error('Error completo:', error);
            console.error('Respuesta del servidor:', error.response?.data);
            
            setMensaje({
                tipo: 'error',
                texto: error.response?.data?.message || 'Error al registrar el préstamo'
            });
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
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-6">Registrar Nuevo Préstamo</h2>
            
            {mensaje.texto && (
                <div className={`p-4 mb-4 rounded ${
                    mensaje.tipo === 'success' 
                        ? 'bg-green-100 text-green-700 border-green-400'
                        : 'bg-red-100 text-red-700 border-red-400'
                    }`}>
                    {mensaje.texto}
                </div>
            )}

            <form onSubmit={handleSubmit} className="max-w-lg">
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                        Número de Ticket
                    </label>
                    <input
                        type="text"
                        name="numero_ticket"
                        value={formData.numero_ticket || ''}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-100"
                        disabled
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                        Herramienta
                    </label>
                    <select
                        name="herramienta_id"
                        value={formData.herramienta_id}
                        onChange={handleInputChange}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        required
                    >
                        <option value="">Seleccione una herramienta</option>
                        {herramientas.map(herramienta => (
                            <option key={herramienta.id} value={herramienta.id}>
                                {herramienta.nombre_herramienta}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                        Responsable
                    </label>
                    <input
                        type="text"
                        name="responsable"
                        value={formData.responsable}
                        onChange={handleInputChange}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        required
                    />
                </div>

                <div className="mb-6">
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                        Lugar de Uso
                    </label>
                    <input
                        type="text"
                        name="lugar_uso"
                        value={formData.lugar_uso}
                        onChange={handleInputChange}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        required
                    />
                </div>

                <div className="flex gap-4">
                    <button
                        type="submit"
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    >
                        Registrar Préstamo
                    </button>
                    <button
                        type="button"
                        onClick={() => navigate('/prestamos')}
                        className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    >
                        Cancelar
                    </button>
                </div>
            </form>
        </div>
    );
};

export default RegistrarPrestamo;