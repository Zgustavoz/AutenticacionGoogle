// src/dashBoard/usuarios/hooks/useUsuario.jsx
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import {
  listarUsuarios,
  getUsuarioID,
  createUsuario,
  updateUsuario,
  toggleUsuarioActivo,
} from '../../../api/usuarios/usuariosApi';


  // 📋 OBTENER USUARIO POR ID
const useUsuarioPorId = (id) => useQuery({
  queryKey: ['usuario', id],
  queryFn: () => getUsuarioID(id),
  enabled: !!id,  // solo ejecuta si hay id
  staleTime: 1000 * 60 * 5,
});


export const useUsuario = () => {
  const queryClient = useQueryClient();

  // 📋 LISTAR USUARIOS (sin filtros)
  const usuarios = useQuery({
    queryKey: ['usuarios'],
    queryFn: () => listarUsuarios(),
    staleTime: 1000 * 60 * 5,      // ← datos frescos por 5 minutos
    gcTime: 1000 * 60 * 10,        // ← mantener en cache 10 min
    retry: 1,
  });

  // ➕ CREAR USUARIO - requiere permiso 'crear'
  const crearUsuario = useMutation({
    mutationFn: (usuarioData) => createUsuario(usuarioData),
    onSuccess: () => {
      queryClient.invalidateQueries(['usuarios']);
      toast.success('Usuario creado exitosamente');
    },
    onError: (error) => {
      toast.error(error.error || 'Error al crear el usuario');
    },
  });

  // ✏️ ACTUALIZAR USUARIO - requiere permiso 'editar'
  const actualizarUsuario = useMutation({
    mutationFn: ({ id, data }) => updateUsuario(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries(['usuarios']);
      queryClient.invalidateQueries(['usuario', variables.id]);
      toast.success('Usuario actualizado exitosamente');
    },
    onError: (error) => {
      console.log('Error actualizar:', error); // ← agrega esto
      toast.error(error.error || 'Error al actualizar el usuario');
    },
  });

  // 🔄 CAMBIAR ESTADO - requiere permiso 'desactivar'
  const toggleActivo = useMutation({
    mutationFn: (id) => toggleUsuarioActivo(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['usuarios']);
      toast.success('Estado del usuario actualizado');
    },
    onError: (error) => {
      toast.error(error.error || 'Error al cambiar estado');
    },
  });

  return {
    usuarios,
    crearUsuario,
    actualizarUsuario,
    toggleActivo,
  };
};

export { useUsuarioPorId };