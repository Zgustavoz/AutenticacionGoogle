import instancia from "../../config/axios.js";

// 📋 LISTAR PERMISOS
export const getPermisos = async (params = {}) => {
  try {
    const response = await instancia.get('/usuarios/permisos/', { params });
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: 'Error al obtener permisos' };
  }
};

// 🔍 OBTENER PERMISO POR ID
export const getPermiso = async (id) => {
  try {
    const response = await instancia.get(`/usuarios/permisos/${id}/`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: 'Error al obtener el permiso' };
  }
};

// 📋 PERMISOS AGRUPADOS POR MODELO
export const getPermisosPorModelo = async () => {
  try {
    const response = await instancia.get('/usuarios/permisos/por-modelo/');
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: 'Error al obtener permisos por modelo' };
  }
};

// 📋 APPS CON PERMISOS
export const getAppsConPermisos = async () => {
  try {
    const response = await instancia.get('/usuarios/permisos/apps/');
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: 'Error al obtener apps con permisos' };
  }
};