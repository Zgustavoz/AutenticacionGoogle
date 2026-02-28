import React, { useState } from 'react';
import { CreateButton } from '../../../components/ui/buttons';
import { UsuariosTable } from '../components/UsuariosTable';
import { EditarUsuarioModal } from '../components/EditarUsuarioModal';
import { CrearUsuarioModal } from '../components/CrearUsuarioModal';
import { useUsuario } from '../hooks/useUsuario';
import { useAuth } from '../../../Auth/context/AuthContext';
import toast from 'react-hot-toast';

export const UsuariosPage = () => {
  const { usuarios, toggleActivo } = useUsuario();
  const { user, tienePermiso } = useAuth();
  const [modalAbierto, setModalAbierto] = useState(false);
  const [usuarioAEditar, setUsuarioAEditar] = useState(null);
  const puedeCrear = tienePermiso('crear');
  const puedeVisualizar = tienePermiso('visualizar');

  const handleToggleActive = (usuario) => {
    const accion = usuario.is_active ? 'desactivar' : 'activar';
    if (window.confirm(`¿Estás seguro de ${accion} el usuario "${usuario.username}"?`)) {
      toggleActivo.mutate(usuario.id, {
        onSuccess: () => toast.success(`Usuario ${accion}do exitosamente`),
      });
    }
  };

  if (usuarios.isLoading) return <div className="p-6 text-gray-500">Cargando usuarios...</div>;
  if (!user) return <div className="p-6">Cargando sesión...</div>;
  if (!puedeVisualizar) return (
    <div className="p-6">
      <div className="bg-red-50 text-red-600 p-4 rounded-lg">No tienes permisos para ver esta sección</div>
    </div>
  );

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Usuarios</h1>
          <p className="text-gray-600 mt-1">Gestiona los usuarios del sistema</p>
        </div>
        {puedeCrear && (
          <CreateButton onClick={() => setModalAbierto(true)}>
            Nuevo Usuario
          </CreateButton>
        )}
      </div>

      <UsuariosTable 
        usuarios={usuarios.data || []} 
        onToggleActive={handleToggleActive}
        onEditar={(usuario) => setUsuarioAEditar(usuario)}
      />

      {usuarioAEditar && (
        <EditarUsuarioModal 
          usuario={usuarioAEditar} 
          onClose={() => setUsuarioAEditar(null)} 
        />
      )}

      {modalAbierto && (
        <CrearUsuarioModal onClose={() => setModalAbierto(false)} />
      )}
    </div>
  );
};