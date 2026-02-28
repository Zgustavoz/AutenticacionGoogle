import { useMutation, useQueryClient } from '@tanstack/react-query';
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
  cerrarSesion,
} from '../../api/auth/authApi';
import { useAuth as useAuthContext } from '../context/AuthContext';

export const useAuth = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { login: contextLogin, logout: contextLogout } = useAuthContext();

  // 📌 INICIAR SESIÓN
  const login = useMutation({
    mutationFn: iniciarSesion,
    onSuccess: async () => {
      const perfil = await obtenerPerfil();
      contextLogin(perfil);
      toast.success('¡Inicio de sesión exitoso!');
      const esEmpleado = perfil.es_admin || perfil.roles_info?.some(r => r.nombre === 'empleado');
      navigate(esEmpleado ? '/dashboard' : '/cliente');
    },
    onError: (error) => {
      const errorMsg = error?.response?.data?.detail || error?.detail || 'Error al iniciar sesión';
      toast.error(errorMsg);
    },
  });

  // 📝 REGISTRAR USUARIO
  const registro = useMutation({
    mutationFn: (userData) => registrarUsuario(userData),
    onSuccess: (data) => {
      toast.success(data.message || '¡Usuario registrado exitosamente!');
      setTimeout(() => navigate('/login'), 2000);
    },
    onError: (error) => {
      const errorMsg = error.error || error.message || 'Error al registrar usuario';
      toast.error(errorMsg);
    }
  });

  // 📧 SOLICITAR RECUPERACIÓN
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
    mutationFn: loginConGoogle,
    onSuccess: async () => {
      const perfil = await obtenerPerfil();
      contextLogin(perfil);
      toast.success('¡Inicio de sesión exitoso!');
      const esEmpleado = perfil.es_admin || perfil.roles_info?.some(r => r.nombre === 'empleado');
      navigate(esEmpleado ? '/dashboard' : '/cliente');
    },
    onError: (error) => {
      const errorMsg = error?.error || error?.message || 'Error al iniciar sesión con Google';
      toast.error(errorMsg);
    },
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
  const logout = async () => {
    try {
      await cerrarSesion(); // borra cookies en el backend
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
    contextLogout();
    queryClient.clear();
    toast.success('Sesión cerrada');
    navigate('/login');
  };

  return {
    login,
    registro,
    recuperarPassword,
    restablecer,
    googleLogin,
    cambiarClave,
    logout
  };
};