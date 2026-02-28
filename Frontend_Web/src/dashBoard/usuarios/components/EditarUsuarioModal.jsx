import { useState } from 'react';
import { X } from 'lucide-react';
import { useUsuario } from '../hooks/useUsuario';
import { useQuery } from '@tanstack/react-query';
import { getRoles } from '../../../api/roles/rolesApi';

export const EditarUsuarioModal = ({ usuario, onClose }) => {
  const { actualizarUsuario } = useUsuario();

  const [form, setForm] = useState({
    username: usuario.username || '',
    first_name: usuario.first_name || '',
    last_name: usuario.last_name || '',
    email: usuario.email || '',
    telefono: usuario.telefono || '',
    password: '',
    roles_ids: usuario.roles_info?.map(r => r.id) || [],
  });

  const [errors, setErrors] = useState({});

  const { data: roles = [] } = useQuery({
    queryKey: ['roles'],
    queryFn: () => getRoles({ activo: true }),
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }));
  };

  const handleRolToggle = (rolId) => {
    setForm(prev => ({
      ...prev,
      roles_ids: prev.roles_ids.includes(rolId)
        ? prev.roles_ids.filter(id => id !== rolId)
        : [...prev.roles_ids, rolId],
    }));
  };

  const validar = () => {
    const nuevosErrors = {};
    if (!form.username.trim()) nuevosErrors.username = 'Requerido';
    if (!form.first_name.trim()) nuevosErrors.first_name = 'Requerido';
    if (!form.last_name.trim()) nuevosErrors.last_name = 'Requerido';
    if (!form.email.trim()) nuevosErrors.email = 'Requerido';
    if (form.password && form.password.length < 8)
      nuevosErrors.password = 'Mínimo 8 caracteres';
    if (form.roles_ids.length === 0) nuevosErrors.roles_ids = 'Selecciona al menos un rol';
    return nuevosErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const nuevosErrors = validar();
    if (Object.keys(nuevosErrors).length > 0) {
      setErrors(nuevosErrors);
      return;
    }
    const data = { ...form };
    if (!data.password) delete data.password;
    actualizarUsuario.mutate({ id: usuario.id, data }, {
      onSuccess: () => onClose(),
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">

        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Editar Usuario</h2>
            <p className="text-sm text-gray-500">@{usuario.username}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">

          {/* Username y Email - campos sensibles */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Usuario
                <span className="ml-1 text-xs text-amber-500 font-normal">⚠ sensible</span>
              </label>
              <input
                type="text"
                name="username"
                value={form.username}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 bg-amber-50 ${
                  errors.username ? 'border-red-400' : 'border-amber-200'
                }`}
              />
              {errors.username && <p className="text-red-500 text-xs mt-1">{errors.username}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
                <span className="ml-1 text-xs text-amber-500 font-normal">⚠ sensible</span>
              </label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 bg-amber-50 ${
                  errors.email ? 'border-red-400' : 'border-amber-200'
                }`}
              />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
            </div>
          </div>

          {/* Nombre y Apellido */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
              <input
                type="text"
                name="first_name"
                value={form.first_name}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black ${
                  errors.first_name ? 'border-red-400' : 'border-gray-300'
                }`}
              />
              {errors.first_name && <p className="text-red-500 text-xs mt-1">{errors.first_name}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Apellido</label>
              <input
                type="text"
                name="last_name"
                value={form.last_name}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black ${
                  errors.last_name ? 'border-red-400' : 'border-gray-300'
                }`}
              />
              {errors.last_name && <p className="text-red-500 text-xs mt-1">{errors.last_name}</p>}
            </div>
          </div>

          {/* Teléfono */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Teléfono <span className="text-gray-400 font-normal">(opcional)</span>
            </label>
            <input
              type="text"
              name="telefono"
              value={form.telefono}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black"
              placeholder="+591 70000000"
            />
          </div>

          {/* Nueva contraseña */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nueva Contraseña
              <span className="ml-1 text-gray-400 font-normal text-xs">(dejar vacío para no cambiar)</span>
            </label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black ${
                errors.password ? 'border-red-400' : 'border-gray-300'
              }`}
              placeholder="••••••••"
            />
            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
          </div>

          {/* Roles */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Roles</label>
            <div className="flex flex-wrap gap-2">
              {roles.map(rol => (
                <button
                  key={rol.id}
                  type="button"
                  onClick={() => handleRolToggle(rol.id)}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                    form.roles_ids.includes(rol.id)
                      ? 'bg-black text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {rol.nombre}
                </button>
              ))}
            </div>
            {errors.roles_ids && <p className="text-red-500 text-xs mt-1">{errors.roles_ids}</p>}
          </div>

          {/* Botones */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={actualizarUsuario.isPending}
              className="flex-1 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors text-sm font-medium disabled:opacity-50"
            >
              {actualizarUsuario.isPending ? 'Guardando...' : 'Guardar cambios'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};