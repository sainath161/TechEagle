import React, { createContext, useState, useEffect } from 'react';
import api from '../api';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const { data } = await api.get('/users/profile');
                setUser(data);
            } catch (error) {
                console.error(error);
            }
        };

        const token = localStorage.getItem('token');
        if (token) {
            fetchUser();
        }
    }, []);

    const login = async (email, password) => {
        const { data } = await api.post('/users/login', { email, password });
        localStorage.setItem('token', data.token);
        setUser(data);
        navigate('/');
    };

    const signup = async (name, email, password) => {
        const { data } = await api.post('/users/register', { name, email, password });
        localStorage.setItem('token', data.token);
        setUser(data);
        navigate('/');
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
        navigate('/login');
    };

    return (
        <AuthContext.Provider value={{ user, login, signup, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
