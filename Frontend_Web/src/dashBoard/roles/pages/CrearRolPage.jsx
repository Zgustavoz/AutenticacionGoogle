import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { ArrowLeft } from 'lucide-react';
import { useRol } from '../hooks/useRol';

export const CrearRolPage = () => {
  const navigate = useNavigate();
  const { crearRol } = useRol();
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      name: '',
      descripcion: '',
      es_admin: false,
      is_active: true,
    },
  });

  const onSubmit = (data) => {
    crearRol.mutate(data, {
      onSuccess: () => navigate('/dashboard/roles'),
    });
  };

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
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Crear Nuevo Rol</h1>

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
              placeholder="Ej: Administrador, Vendedor, etc."
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
              placeholder="Descripción del rol..."
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
              Rol Administrador (acceso a todas las funciones)
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
              disabled={crearRol.isPending}
              className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 disabled:opacity-50"
            >
              {crearRol.isPending ? 'Creando...' : 'Crear Rol'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};