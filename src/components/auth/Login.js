import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../../api/axios';

const Login = () => {
    const [formData, setFormData] = useState({
        numero_documento: '',
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
            const response = await axios.post('/usuarios/login', formData);
            localStorage.setItem('token', response.data.token);
            // Guardar datos del usuario
            localStorage.setItem('userData', JSON.stringify(response.data.usuario));
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.message || 'Error en el inicio de sesión');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-500 to-indigo-600 p-6">
            <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
                <h2 className="text-3xl font-extrabold text-center text-gray-900 mb-6">Iniciar Sesión</h2>
                
                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-4 text-sm" role="alert">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    {[
                        { label: 'Número de Documento', name: 'numero_documento', type: 'text' },
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

                    <button
                        type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300"
                    >
                        Iniciar Sesión
                    </button>
                </form>

                <p className="mt-4 text-center text-sm text-gray-600">
                    ¿No tienes cuenta? 
                    <a href="/register" className="text-blue-500 hover:underline"> Registrarse</a>
                </p>
            </div>
        </div>
    );
};

export default Login;