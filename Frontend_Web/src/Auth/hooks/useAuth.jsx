import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
  iniciarSesion,
  registrarUsuario,
  solicitarRecuperacion,
  restablecerPassword,
  loginConGoogle,
  obtenerPerfil,
  cambiarPassword,
} from '../../Api/auth/authApi';
import { useAuth as useAuthContext } from '../../context/AuthContext';
// import { use } from 'react';

export const useAuth = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { login: contextLogin, loginWithGoogle: contextGoogleLogin, logout: contextLogout } = useAuthContext();

  // 📌 INICIAR SESIÓN
  const login = useMutation({
    mutationFn: (credentials) => iniciarSesion(credentials),
    onSuccess: (data) => {
      // Guardar tokens
      localStorage.setItem('access_token', data.access);
      localStorage.setItem('refresh_token', data.refresh);
      
      // Decodificar token para obtener datos del usuario
      const payload = JSON.parse(atob(data.access.split('.')[1]));
      const userData = {
        id: payload.user_id,
        username: payload.username,
        email: payload.email,
        rol: payload.rol,
        es_admin: payload.es_admin
      };
      
      console.log('Usuario autenticado:', userData);
      
      // Actualizar el contexto
      contextLogin(userData);
      
      toast.success('¡Inicio de sesión exitoso!');
      
      // 👇 CAMBIO: Navegar DESPUÉS de actualizar el contexto
      if (userData.es_admin) {
        console.log('Redirigiendo a /admin');
        navigate('/admin');
      } else {
        console.log('Redirigiendo a /cliente');
        navigate('/cliente');
      }
    },
    onError: (error) => {
      const errorMsg = error.error || error.detail || 'Error al iniciar sesión';
      toast.error(errorMsg);
    }
  });

// 📝 REGISTRAR USUARIO
const registro = useMutation({
  mutationFn: (userData) => {
    console.log('📤 Intentando registrar usuario con datos:', userData);
    return registrarUsuario(userData);
  },
  onSuccess: (data) => {
    console.log('✅ Registro exitoso:', data);
    toast.success(data.message || '¡Usuario registrado exitosamente!');
    setTimeout(() => navigate('/login'), 2000);
  },
  onError: (error) => {
    console.error('❌ Error en registro:', error);
    console.error('❌ Detalles del error:', error);
    console.error('❌ Error completo:', JSON.stringify(error, null, 2));
    
    const errorMsg = error.error || error.message || 'Error al registrar usuario';
    toast.error(errorMsg);
  }
});

  // 📧 SOLICITAR RECUPERACIÓN DE CONTRASEÑA
  const recuperarPassword = useMutation({
    mutationFn: ({ email }) => solicitarRecuperacion(email),
    onSuccess: (data) => {
      toast.success(data.message || 'Revisa tu email para continuar');
    },
    onError: (error) => {
      const errorMsg = error.error || error.message || 'Error al solicitar recuperación';
      toast.error(errorMsg);
    }
  });

  // 🔑 RESTABLECER CONTRASEÑA
  const restablecer = useMutation({
    mutationFn: (data) => restablecerPassword(data),
    onSuccess: (data) => {
      toast.success(data.message || 'Contraseña actualizada correctamente');
      setTimeout(() => navigate('/login'), 2000);
    },
    onError: (error) => {
      const errorMsg = error.error || error.message || 'Error al restablecer contraseña';
      toast.error(errorMsg);
    }
  });

  // 🟢 LOGIN CON GOOGLE
  const googleLogin = useMutation({
    mutationFn: (token) => loginConGoogle(token),
    onSuccess: (data) => {
      // Guardar tokens
      localStorage.setItem('access_token', data.access);
      localStorage.setItem('refresh_token', data.refresh);
      
      console.log('Usuario de Google:', data.user);
      
      // Actualizar el contexto
      contextGoogleLogin(data.user);
      
      toast.success('¡Inicio de sesión con Google exitoso!');
      
      // Redirigir según rol
      if (data.user.es_admin) {
        console.log('Redirigiendo a /admin');
        navigate('/admin');
      } else {
        console.log('Redirigiendo a /cliente');
        navigate('/cliente');
      }
    },
    onError: (error) => {
      const errorMsg = error.error || error.message || 'Error al iniciar sesión con Google';
      toast.error(errorMsg);
    }
  });

  // 👤 OBTENER PERFIL
  const perfil = useQuery({
    queryKey: ['perfil'],
    queryFn: obtenerPerfil,
    enabled: !!localStorage.getItem('access_token'),
    retry: false,
  });

  // 🔐 CAMBIAR CONTRASEÑA
  const cambiarClave = useMutation({
    mutationFn: (data) => cambiarPassword(data),
    onSuccess: () => {
      toast.success('Contraseña actualizada exitosamente');
    },
    onError: (error) => {
      const errorMsg = error.old_password?.[0] || error.error || 'Error al cambiar contraseña';
      toast.error(errorMsg);
    }
  });

  // 🚪 CERRAR SESIÓN
  const logout = () => {
    contextLogout();
    queryClient.clear();
    toast.success('Sesión cerrada');
  };

  return {
    login,
    registro,
    recuperarPassword,
    restablecer,
    googleLogin,
    perfil,
    cambiarClave,
    logout
  };
};