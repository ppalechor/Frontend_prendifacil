import React, { useState, useEffect } from 'react';
import axios from 'axios';

// Dirección base de tu API
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

import { AuthContext } from './useAuth';

export const AuthProvider = ({ children }) => {
    const [authReady, setAuthReady] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token'));

    useEffect(() => {
        if (token) {
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            try {
                const payload = JSON.parse(atob(token.split('.')[1] || ''));
                setCurrentUser({ username: payload.username, role: payload.role, identificacion: payload.identificacion, id_usuario: payload.id_usuario });
            } catch {
                setCurrentUser({ username: null, role: null });
            }
        } else {
            delete axios.defaults.headers.common['Authorization'];
            setCurrentUser(null);
        }
        setAuthReady(true);
    }, [token]);

    // Interceptor para manejar 401
    useEffect(() => {
        const interceptor = axios.interceptors.response.use(
            (response) => response,
            (error) => {
                const status = error?.response?.status;
                if (status === 401) {
                    logout();
                }
                return Promise.reject(error);
            }
        );

        return () => {
            axios.interceptors.response.eject(interceptor);
        };
    }, []);

    const login = async (username, password) => {
        try {
            console.log('Attempting login with:', username);
            console.log('API URL:', `${API_BASE_URL}/auth/login`);
            
            const response = await axios.post(`${API_BASE_URL}/auth/login`, { username, password });
            console.log('Login response:', response.data);
            
            const { token } = response.data;
            console.log('Received token:', token);
            
            localStorage.setItem('token', token);
            setToken(token);
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            try {
                const payload = JSON.parse(atob(token.split('.')[1] || ''));
                setCurrentUser({ username: payload.username, role: payload.role, identificacion: payload.identificacion, id_usuario: payload.id_usuario });
            } catch {
                setCurrentUser({ username, role: null });
            }
            return { success: true };
        } catch (error) {
            console.error('Login error:', error);
            console.error('Login error response:', error.response);
            return { success: false, error: error.response?.data?.error || 'Error de login' };
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        setToken(null);
        setCurrentUser(null);
        delete axios.defaults.headers.common['Authorization'];
    };

    const apiBaseUrl = API_BASE_URL;

    const value = {
        apiBaseUrl,
        currentUser,
        authReady,
        login,
        logout,
        token,
    };

    const [loginData, setLoginData] = useState({ username: '', password: '' });
    const [loginError, setLoginError] = useState('');


    const handleLogin = async (e) => {
        e.preventDefault();
        if (!/^\d+$/.test(loginData.username)) {
            setLoginError('La identificación debe contener solo números.');
            return;
        }
        const result = await login(loginData.username, loginData.password);
        if (!result.success) {
            setLoginError(result.error);
        }
    };

    if (!authReady) {
        return (
            <div className="flex justify-center items-center h-screen text-lg text-gray-600">
                Inicializando...
            </div>
        );
    }

    if (!currentUser) {
        return (
            <div className="flex justify-center items-center h-screen">
                <form onSubmit={handleLogin} className="bg-white p-6 rounded shadow-md w-80">
                    <h2 className="text-xl mb-4">Login</h2>
                    {loginError && <p className="text-red-500 mb-2">{loginError}</p>}
                    <input
                        type="text"
                        placeholder="Identificación"
                        value={loginData.username}
                        onChange={(e) => setLoginData({ ...loginData, username: e.target.value.replace(/[^0-9]/g, '') })}
                        className="w-full border p-2 mb-4 rounded"
                        required
                    />
                    <input
                        type="password"
                        placeholder="Contraseña"
                        value={loginData.password}
                        onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                        className="w-full border p-2 mb-4 rounded"
                        required
                    />
                    <p className="text-xs text-gray-500 mb-3">Recomendado: mínimo 8 caracteres.</p>
                    <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded">Iniciar Sesión</button>
                </form>
            </div>
        );
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};
