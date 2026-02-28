import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { ArrowLeft } from 'lucide-react';
import { useRol } from '../hooks/useRol';

export const EditarRolPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getRolById, actualizarRol } = useRol();
  const { data: rol, isLoading } = getRolById(id);

  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  // Cargar datos cuando estén disponibles
  useEffect(() => {
    if (rol) {
      reset({
        name: rol.name,
        descripcion: rol.descripcion || '',
        es_admin: rol.es_admin || false,
        is_active: rol.is_active !== undefined ? rol.is_active : true,
      });
    }
  }, [rol, reset]);

  const onSubmit = (data) => {
    actualizarRol.mutate({ id, data }, {
      onSuccess: () => navigate('/dashboard/roles'),
    });
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="text-gray-500">Cargando rol...</div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      {/* Botón volver */}
      <button
        onClick={() => navigate('/dashboard/roles')}
        className="flex items-center gap-2 text-gray-600 hover:text-black mb-6"
      >
        <ArrowLeft size={20} />
        Volver a roles
      </button>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Editar Rol</h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Nombre */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nombre del rol *
            </label>
            <input
              type="text"
              {...register('name', { 
                required: 'El nombre es requerido',
                minLength: {
                  value: 3,
                  message: 'Mínimo 3 caracteres',
                },
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
            )}
          </div>

          {/* Descripción */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Descripción
            </label>
            <textarea
              {...register('descripcion')}
              rows="3"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black resize-none"
            />
          </div>

          {/* Checkbox Admin */}
          <div className="flex items-center">
            <input
              type="checkbox"
              {...register('es_admin')}
              className="w-4 h-4 text-black border-gray-300 rounded focus:ring-black"
            />
            <label className="ml-2 text-sm text-gray-700">
              Rol Administrador
            </label>
          </div>

          {/* Estado (activo/inactivo) */}
          <div className="flex items-center">
            <input
              type="checkbox"
              {...register('is_active')}
              className="w-4 h-4 text-black border-gray-300 rounded focus:ring-black"
            />
            <label className="ml-2 text-sm text-gray-700">
              Rol activo
            </label>
          </div>

          {/* Botones */}
          <div className="flex justify-end gap-2 pt-4">
            <button
              type="button"
              onClick={() => navigate('/dashboard/roles')}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={actualizarRol.isPending}
              className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 disabled:opacity-50"
            >
              {actualizarRol.isPending ? 'Actualizando...' : 'Actualizar Rol'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};