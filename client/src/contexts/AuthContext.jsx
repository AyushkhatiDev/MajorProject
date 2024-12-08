import { createContext, useContext, useState, useEffect } from 'react';
import api from '../utils/axios';

const AuthContext = createContext();

export const useAuth = () => {
    return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        checkAuthStatus();
    }, []);

    const checkAuthStatus = async () => {
        try {
            const token = localStorage.getItem('token');
            if (token) {
                const response = await api.get('/auth/verify');
                setUser(response.data.user);
            }
        } catch (err) {
            localStorage.removeItem('token');
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    const login = async (email, password) => {
        try {
            const response = await api.post('/auth/login', { email, password });
            localStorage.setItem('token', response.data.token);
            setUser(response.data.user);
            setError('');
            return response.data;
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed');
            throw err;
        }
    };

    const signup = async (userData) => {
        try {
            const response = await api.post('/auth/signup', userData);
            localStorage.setItem('token', response.data.token);
            setUser(response.data.user);
            setError('');
            return response.data;
        } catch (err) {
            setError(err.response?.data?.message || 'Signup failed');
            throw err;
        }
    };

    const logout = async () => {
        try {
            await api.post('/auth/logout');
        } catch (err) {
            console.error('Logout error:', err);
        } finally {
            localStorage.removeItem('token');
            setUser(null);
        }
    };

    const updateProfile = async (userData) => {
        try {
            const response = await api.put('/user/profile', userData);
            setUser(response.data.user);
            setError('');
            return response.data;
        } catch (err) {
            setError(err.response?.data?.message || 'Profile update failed');
            throw err;
        }
    };

    const value = {
        user,
        loading,
        error,
        login,
        signup,
        logout,
        updateProfile
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
