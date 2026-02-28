import React from 'react';
import { useNavigate } from 'react-router-dom';
import { EditButton, DeleteButton } from '../../../components/ui/buttons';
import { Shield, Users } from 'lucide-react';

export const RolesTable = ({ roles, onToggleActive }) => {
  const navigate = useNavigate();

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

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Rol
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Descripción
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Usuarios
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
          {roles.length === 0 ? (
            <tr>
              <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                No hay roles creados
              </td>
            </tr>
          ) : (
            roles.map((rol) => (
              <tr key={rol.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <Shield className="w-5 h-5 text-gray-400 mr-3" />
                    <div>
                      <span className="font-medium text-gray-900">{rol.name}</span>
                      {rol.es_admin && (
                        <span className="ml-2 text-xs bg-black text-white px-2 py-0.5 rounded">
                          Admin
                        </span>
                      )}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="text-gray-600">{rol.descripcion || '-'}</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center text-gray-600">
                    <Users className="w-4 h-4 mr-1" />
                    <span>{rol.usuarios_count || 0}</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {getEstadoBadge(rol.is_active)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <EditButton onClick={() => navigate(`/dashboard/roles/editar/${rol.id}`)} />
                  <DeleteButton onClick={() => onToggleActive(rol)} />
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};