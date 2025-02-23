// src/contexts/AuthContext.js
import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        try {
          // Replace with your actual profile endpoint
          const response = await axios.get('http://localhost:8000/api/profile');
          setUser(response.data);
        } catch (error) {
          console.error("Failed to load user:", error);
          localStorage.removeItem('token'); // Remove invalid token
          delete axios.defaults.headers.common['Authorization'];
        }
      }
      setLoading(false);
    };

    loadUser();
  }, []);


    const login = (token) => {
        localStorage.setItem('token', token);
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        //Get the user data after login
        loadUser();
    };
    const loadUser = async () => {
        try{
            const response = await axios.get('http://localhost:8000/api/profile');
            setUser(response.data)
        }
        catch(error){
            console.error('Failed to load user: ', error)
        }
    }
  const logout = () => {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);