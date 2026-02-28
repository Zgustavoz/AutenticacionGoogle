import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import {
  getRoles,
  createRol,
  updateRol,
  deleteRol,
} from '../../../api/roles/rolesApi';

export const useRol = () => {
  const queryClient = useQueryClient();

  // 📋 LISTAR ROLES
  const roles = useQuery({
    queryKey: ['roles'],
    queryFn: getRoles,
  });

  // ➕ CREAR ROL
  const crearRol = useMutation({
    mutationFn: (rolData) => createRol(rolData),
    onSuccess: () => {
      queryClient.invalidateQueries(['roles']);
      toast.success('Rol creado exitosamente');
    },
    onError: (error) => {
      const errorMsg = error.error || error.message || 'Error al crear el rol';
      toast.error(errorMsg);
    },
  });

  // ✏️ ACTUALIZAR ROL
  const actualizarRol = useMutation({
    mutationFn: ({ id, data }) => updateRol(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries(['roles']);
      queryClient.invalidateQueries(['rol', variables.id]);
      toast.success('Rol actualizado exitosamente');
    },
    onError: (error) => {
      const errorMsg = error.error || error.message || 'Error al actualizar el rol';
      toast.error(errorMsg);
    },
  });

  // ❌ ELIMINAR ROL
  const eliminarRol = useMutation({
    mutationFn: (id) => deleteRol(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['roles']);
      toast.success('Rol eliminado exitosamente');
    },
    onError: (error) => {
      const errorMsg = error.error || error.message || 'Error al eliminar el rol';
      toast.error(errorMsg);
    },
  });


  // Agregar esta mutación
  const toggleActivo = useMutation({
    mutationFn: (id) => updateRol(id, { is_active: false }), // o true según el estado actual
    onSuccess: () => {
      queryClient.invalidateQueries(['roles']);
    },
    onError: (error) => {
      toast.error(error.error || 'Error al cambiar estado del rol');
    },
  });

  return {
    roles,
    crearRol,
    actualizarRol,
    eliminarRol,
    toggleActivo,
  };
};