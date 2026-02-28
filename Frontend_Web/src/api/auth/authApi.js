import instancia from "../../config/axios.js"

export const iniciarSesion = async (credentials) => {
  const response = await instancia.post('/usuarios/token/', credentials);
  return response.data;
};

export const registrarUsuario = async (userData) => {
  try {
    const response = await instancia.post('/usuarios/registro/', userData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: 'Error al registrar usuario' };
  }
};

export const solicitarRecuperacion = async (email) => {
  try {
    const response = await instancia.post('/usuarios/password-reset/', { email });
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: 'Error al solicitar recuperación' };
  }
};

export const restablecerPassword = async (data) => {
  try {
    const response = await instancia.post(
      `/usuarios/restablecer-password/${data.uid}/${data.token}/`,
      { new_password: data.password }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: 'Error al restablecer contraseña' };
  }
};

export const loginConGoogle = async (token) => {
  const response = await instancia.post('/usuarios/auth/google/', { token });
  return response.data;
};

export const obtenerPerfil = async () => {
  const response = await instancia.get('/usuarios/perfil/');
  return response.data;
};

export const cambiarPassword = async (data) => {
  try {
    const response = await instancia.post('/usuarios/cambiar-password/', data);
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: 'Error al cambiar contraseña' };
  }
};

export const cerrarSesion = async () => {
  const response = await instancia.post('/usuarios/logout/');
  return response.data;
};