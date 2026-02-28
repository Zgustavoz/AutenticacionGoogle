// src/dashBoard/usuarios/components/UsuariosTable.jsx
import { User, Mail, Phone, Calendar, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../../Auth/context/AuthContext';

export const UsuariosTable = ({ usuarios, onToggleActive, onEditar }) => {
  const { tienePermiso } = useAuth();
  const puedeEditar = tienePermiso('editar');
  const puedeEliminar = tienePermiso('eliminar');
  const puedeCambiarEstado = tienePermiso('desactivar');

  const getEstadoBadge = (activo) => {
    return activo ? (
      <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
        Activo
      </span>
    ) : (
      <span className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full">
        Inactivo
      </span>
    );
  };
  
// Función mejorada para mostrar roles (CON KEYS CORRECTAS)
const getRolesDisplay = (usuario) => {
  if (usuario.roles_info && Array.isArray(usuario.roles_info) && usuario.roles_info.length > 0) {
    const roles = usuario.roles_info;
    const primerosRoles = roles.slice(0, 2);
    const rolesRestantes = roles.length - 2;
    
    return (
      <div className="flex items-center gap-1 group relative">
        {/* ✅ Primeros roles con key única (rol.id) */}
        {primerosRoles.map((rol) => (
          <span 
            key={`rol-${rol.id}`}  // 👈 KEY ÚNICA
            className="px-2 py-0.5 text-xs bg-gray-100 text-gray-700 rounded-full"
          >
            {rol.nombre}
          </span>
        ))}
        
        {/* ✅ Tooltip con key única también */}
        {rolesRestantes > 0 && (
          <div key="roles-restantes" className="relative">  {/* 👈 KEY AQUÍ */}
            <span className="px-2 py-0.5 text-xs bg-gray-200 text-gray-600 rounded-full cursor-help">
              +{rolesRestantes}
            </span>
            
            {/* Tooltip con lista de roles (no necesita key porque es texto) */}
            <div className="absolute bottom-full left-0 mb-2 hidden group-hover:block z-50">
              <div className="bg-gray-900 text-white text-xs rounded py-1 px-2 whitespace-nowrap">
                {roles.map(r => r.nombre).join(', ')}
              </div>
              <div className="w-2 h-2 bg-gray-900 rotate-45 absolute left-2 -bottom-1"></div>
            </div>
          </div>
        )}
      </div>
    );
  }
  
  return <span className="text-gray-400 text-xs italic">Sin rol</span>;
};

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Usuario
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Contacto
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Roles
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Registro
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Estado
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Acciones
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {usuarios.length === 0 ? (
            <tr>
              <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                No hay usuarios registrados
              </td>
            </tr>
          ) : (
            usuarios.map((usuario) => (
              <tr key={usuario.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <User className="w-5 h-5 text-gray-400 mr-3" />
                    <div>
                      <div className="font-medium text-gray-900">
                        {usuario.first_name} {usuario.last_name}
                      </div>
                      <div className="text-sm text-gray-500">@{usuario.username}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="space-y-1">
                    <div className="flex items-center text-sm text-gray-600">
                      <Mail className="w-4 h-4 mr-1" />
                      {usuario.email}
                    </div>
                    {usuario.telefono && (
                      <div className="flex items-center text-sm text-gray-600">
                        <Phone className="w-4 h-4 mr-1" />
                        {usuario.telefono}
                      </div>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-wrap gap-1">
                    {getRolesDisplay(usuario)}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar className="w-4 h-4 mr-1" />
                    {new Date(usuario.date_joined).toLocaleDateString()}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {getEstadoBadge(usuario.is_active)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <div className="flex items-center justify-end gap-2">
                    {/* Botón de cambiar estado */}
                    <button
                      onClick={puedeCambiarEstado ? () => onToggleActive(usuario) : undefined}
                      disabled={!puedeCambiarEstado}
                      className={`p-2 rounded-lg transition-colors ${
                        puedeCambiarEstado 
                          ? 'text-gray-600 hover:text-blue-600 hover:bg-blue-50 cursor-pointer' 
                          : 'text-gray-300 cursor-not-allowed opacity-50'
                      }`}
                      title={puedeCambiarEstado 
                        ? (usuario.is_active ? 'Desactivar' : 'Activar')
                        : 'No tienes permiso para cambiar estado'
                      }
                    >
                      {usuario.is_active ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                    
                    {/* Botón de editar */}
                    <button
                      onClick={puedeEditar ? () => onEditar(usuario) : undefined}
                      disabled={!puedeEditar}
                      className={`p-2 rounded-lg transition-colors ${
                        puedeEditar 
                          ? 'text-gray-600 hover:text-blue-600 hover:bg-blue-50 cursor-pointer' 
                          : 'text-gray-300 cursor-not-allowed opacity-50'
                      }`}
                      title={puedeEditar ? 'Editar usuario' : 'No tienes permiso para editar'}
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                      </svg>
                    </button>
                    
                    {/* Botón de eliminar */}
                    <button
                      onClick={puedeEliminar ? () => onToggleActive(usuario) : undefined}
                      disabled={!puedeEliminar}
                      className={`p-2 rounded-lg transition-colors ${
                        puedeEliminar 
                          ? 'text-gray-600 hover:text-red-600 hover:bg-red-50 cursor-pointer' 
                          : 'text-gray-300 cursor-not-allowed opacity-50'
                      }`}
                      title={puedeEliminar ? 'Eliminar usuario' : 'No tienes permiso para eliminar'}
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};