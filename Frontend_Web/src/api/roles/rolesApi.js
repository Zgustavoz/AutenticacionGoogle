// src/api/roles/rolesApi.js
import instancia from "../../config/axios.js";

// 📋 LISTAR ROLES
export const getRoles = async (params = {}) => {
  try {
    const response = await instancia.get('/usuarios/roles/', { params });
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: 'Error al obtener roles' };
  }
};

// 🔍 OBTENER ROL POR ID
export const getRol = async (id) => {
  try {
    const response = await instancia.get(`/usuarios/roles/${id}/`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: 'Error al obtener el rol' };
  }
};

// ➕ CREAR ROL
export const createRol = async (rolData) => {
  try {
    const response = await instancia.post('/usuarios/roles/', rolData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: 'Error al crear el rol' };
  }
};

// ✏️ ACTUALIZAR ROL
export const updateRol = async (id, rolData) => {
  try {
    const response = await instancia.put(`/usuarios/roles/${id}/`, rolData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: 'Error al actualizar el rol' };
  }
};

// ❌ ELIMINAR ROL
export const deleteRol = async (id) => {
  try {
    const response = await instancia.delete(`/usuarios/roles/${id}/`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: 'Error al eliminar el rol' };
  }
};