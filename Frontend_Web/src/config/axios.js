// src/config/axios.js
import axios from 'axios';

const instancia = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://backend-login-production-42aa.up.railway.app',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar token
instancia.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default instancia;