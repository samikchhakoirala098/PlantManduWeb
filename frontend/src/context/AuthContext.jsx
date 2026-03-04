import { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')) || null);

    const login = async (email, password) => {
        const res = await axios.post(`${import.meta.env.VITE_API_URL}/auth/login`, { email, password });
        setUser(res.data);
        localStorage.setItem('user', JSON.stringify(res.data));
    };

    const register = async (userData) => {
        const res = await axios.post(`${import.meta.env.VITE_API_URL}/auth/register`, userData);
        setUser(res.data);
        localStorage.setItem('user', JSON.stringify(res.data));
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('user');
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
