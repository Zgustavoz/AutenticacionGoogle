import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CreateButton } from '../../../components/ui/buttons';
import { RolesTable } from '../components/RolesTable';
import { useRol } from '../hooks/useRol';
import toast from 'react-hot-toast';
import Unauthorized from '../../../Auth/pages/Unauthorized';
import { useAuth } from '../../../Auth/context/AuthContext';

export const RolesPage = () => {

  const navigate = useNavigate();
  const { roles, toggleActivo } = useRol();

  // Verificar si tiene acceso (solo admin)
  const { user } = useAuth();
  if (!user?.es_admin) {
    return <Unauthorized mensaje="No tienes los permisos para acceder a esta sección" />;
  }

  const handleToggleActive = (rol) => {
    const accion = rol.is_active ? 'desactivar' : 'activar';
    if (window.confirm(`¿Estás seguro de ${accion} el rol "${rol.name}"?`)) {
      toggleActivo.mutate(rol.id, {
        onSuccess: () => {
          toast.success(`Rol ${accion}do exitosamente`);
        },
      });
    }
  };

  if (roles.isLoading) {
    return (
      <div className="p-6">
        <div className="text-gray-500">Cargando roles...</div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Roles</h1>
          <p className="text-gray-600 mt-1">Gestiona los roles y permisos del sistema</p>
        </div>
        <CreateButton onClick={() => navigate('/dashboard/roles/crear')}>
          Nuevo Rol
        </CreateButton>
      </div>

      {/* Tabla */}
      <RolesTable 
        roles={roles.data || []} 
        onToggleActive={handleToggleActive}
      />
    </div>
  );
};