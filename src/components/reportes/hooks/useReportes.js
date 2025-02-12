import { useState, useEffect } from 'react';
import axios from '../../../api/axios';

const useReportes = () => {
    const [reportes, setReportes] = useState([]);
    const [productos, setProductos] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const obtenerReportes = async () => {
        try {
            setLoading(true);
            const response = await axios.get('/reportes/salidas');
            setReportes(response.data);
            setError(null);
        } catch (err) {
            setError(err.response?.data?.message || 'Error al cargar los reportes');
        } finally {
            setLoading(false);
        }
    };

    const obtenerProductos = async () => {
        try {
            const response = await axios.get('/productos');
            setProductos(response.data);
        } catch (err) {
            setError(err.response?.data?.message || 'Error al cargar los productos');
        }
    };

    const crearReporte = async (datosReporte) => {
        try {
            setLoading(true);
            const response = await axios.post('/reportes/salidas', datosReporte);
            setReportes([response.data.reporte, ...reportes]);
            return { success: true, data: response.data };
        } catch (err) {
            setError(err.response?.data?.message || 'Error al crear el reporte');
            return { success: false, error: err.response?.data?.message };
        } finally {
            setLoading(false);
        }
    };

    const obtenerEstadisticas = async () => {
        try {
            const response = await axios.get('/reportes/estadisticas');
            return response.data;
        } catch (err) {
            setError(err.response?.data?.message || 'Error al obtener estadísticas');
            return null;
        }
    };

    useEffect(() => {
        obtenerReportes();
        obtenerProductos();
    }, []);

    return {
        reportes,
        productos,
        loading,
        error,
        crearReporte,
        obtenerReportes,
        obtenerEstadisticas
    };
};

export default useReportes;