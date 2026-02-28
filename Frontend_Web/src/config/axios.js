// src/config/axios.js
import axios from 'axios';

const instancia = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000',
  timeout: 30000,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
});

instancia.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    const rutasPublicas = [
      '/usuarios/token/',
      '/usuarios/token/refresh/',
    ];

    const esRutaPublica = rutasPublicas.some(ruta =>
      originalRequest.url?.includes(ruta)
    );

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !esRutaPublica
    ) {
      originalRequest._retry = true;

      try {
        await instancia.post('/usuarios/token/refresh/');
        return instancia(originalRequest);
      } catch (refreshError) { 
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default instancia;