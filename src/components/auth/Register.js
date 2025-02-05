import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../../api/axios';

const Register = () => {
    const [formData, setFormData] = useState({
        numero_documento: '',
        nombre_completo: '',
        correo_electronico: '',
        rol: 'Empleado',
        contraseña: ''
    });

    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const response = await axios.post('/usuarios/register', formData);
            localStorage.setItem('token', response.data.token);
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.message || 'Error en el registro');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
                <h2 className="text-3xl font-extrabold text-center text-gray-900 mb-6">Registro de Usuario</h2>
                
                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-4 text-sm" role="alert">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    {[
                        { label: 'Número de Documento', name: 'numero_documento', type: 'text' },
                        { label: 'Nombre Completo', name: 'nombre_completo', type: 'text' },
                        { label: 'Correo Electrónico', name: 'correo_electronico', type: 'email' },
                        { label: 'Contraseña', name: 'contraseña', type: 'password' }
                    ].map(({ label, name, type }) => (
                        <div key={name}>
                            <label className="block text-gray-700 font-medium mb-1" htmlFor={name}>{label}</label>
                            <input
                                type={type}
                                name={name}
                                value={formData[name]}
                                onChange={handleChange}
                                required
                                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            />
                        </div>
                    ))}

                    <div>
                        <label className="block text-gray-700 font-medium mb-1" htmlFor="rol">Rol</label>
                        <select
                            name="rol"
                            value={formData.rol}
                            onChange={handleChange}
                            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        >
                            <option value="Empleado">Empleado</option>
                            <option value="Administrador">Administrador</option>
                        </select>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300"
                    >
                        Registrarse
                    </button>
                </form>

                <p className="mt-4 text-center text-sm text-gray-600">
                    ¿Ya tienes cuenta? 
                    <a href="/login" className="text-blue-500 hover:underline"> Iniciar Sesión</a>
                </p>
            </div>
        </div>
    );
};

export default Register;
