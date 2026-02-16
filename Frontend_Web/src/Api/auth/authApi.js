import instancia from "../../config/axios.js";

// 🔐 LOGIN
export const iniciarSesion = async (credentials) => {
  try {
    const response = await instancia.post('/api/token/', credentials);
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: 'Error al iniciar sesión' };
  }
};

// 📝 REGISTRO
export const registrarUsuario = async (userData) => {
  try {
    const response = await instancia.post('/api/registro/', userData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: 'Error al registrar usuario' };
  }
};

// 🔄 REFRESCAR TOKEN
export const refrescarToken = async (refreshToken) => {
  try {
    const response = await instancia.post('/api/token/refresh/', {
      refresh: refreshToken
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: 'Error al refrescar token' };
  }
};

// 📧 SOLICITAR RECUPERACIÓN DE CONTRASEÑA
export const solicitarRecuperacion = async (email) => {
  try {
    const response = await instancia.post('/api/password-reset/', { email });
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: 'Error al solicitar recuperación' };
  }
};

// 🔑 RESTABLECER CONTRASEÑA (con uid y token en la URL)
export const restablecerPassword = async (data) => {
  try {
    console.log('📤 Enviando a:', `/api/restablecer-password/${data.uid}/${data.token}/`);
    console.log('📤 Con datos:', { new_password: data.password });
    
    const response = await instancia.post(`/api/restablecer-password/${data.uid}/${data.token}/`, {
      new_password: data.password
    });
    return response.data;
  } catch (error) {
    console.error('❌ Error en API restablecer:', error.response?.data);
    throw error.response?.data || { error: 'Error al restablecer contraseña' };
  }
};

// 🟢 LOGIN CON GOOGLE
export const loginConGoogle = async (token) => {
  try {
    const response = await instancia.post('/api/auth/google/', { token });
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: 'Error al iniciar sesión con Google' };
  }
};

// 👤 OBTENER PERFIL DE USUARIO
export const obtenerPerfil = async () => {
  try {
    const response = await instancia.get('/api/perfil/');
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: 'Error al obtener perfil' };
  }
};

// 🔐 CAMBIAR CONTRASEÑA (estando logueado)
export const cambiarPassword = async (data) => {
  try {
    const response = await instancia.post('/api/cambiar-password/', data);
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: 'Error al cambiar contraseña' };
  }
};