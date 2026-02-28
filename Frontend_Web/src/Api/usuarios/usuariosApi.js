// src/api/usuarios/usuariosApi.js
import instancia from "../../config/axios.js";

// 📋 LISTAR USUARIOS
export const listarUsuarios = async () => {
  try { 
    const response = await instancia.get('/usuarios/usuarios/'); return response.data;
  } catch (error) {
    throw error.response?.data || { error: 'Error al obtener usuarios' };
  }
};

// get usuario por id
export const getUsuarioID = async (id) => {
  try {
    const response = await instancia.get(`/usuarios/usuarios/${id}/`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: 'Error al obtener el usuario' };
  }
};


// ➕ CREAR USUARIO
export const createUsuario = async (usuarioData) => {
  try {
    const response = await instancia.post('/usuarios/usuarios/', usuarioData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: 'Error al crear el usuario' };
  }
};

// ✏️ ACTUALIZAR USUARIO
export const updateUsuario = async (id, usuarioData) => {
  try {
    const response = await instancia.put(`/usuarios/usuarios/${id}/`, usuarioData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: 'Error al actualizar el usuario' };
  }
};

// ❌ ELIMINAR USUARIO
export const deleteUsuario = async (id) => {
  try {
    const response = await instancia.delete(`/usuarios/usuarios/${id}/`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: 'Error al eliminar el usuario' };
  }
};

// 🔄 CAMBIAR ESTADO (activar/desactivar)
export const toggleUsuarioActivo = async (id) => {
  try {
    const response = await instancia.post(`/usuarios/usuarios/${id}/toggle_active/`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: 'Error al cambiar estado del usuario' };
  }
};