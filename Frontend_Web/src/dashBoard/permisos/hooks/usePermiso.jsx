import { useQuery } from '@tanstack/react-query';
import {
  getPermisos,
//   getPermiso,
  getPermisosPorModelo,
  getAppsConPermisos,
} from '../../../api/permiso/permisosApi';

export const usePermiso = () => {
  // 📋 LISTAR PERMISOS
  const permisos = useQuery({
    queryKey: ['permisos'],
    queryFn: getPermisos,
  });

  // 📋 PERMISOS AGRUPADOS POR MODELO
  const permisosPorModelo = useQuery({
    queryKey: ['permisos-por-modelo'],
    queryFn: getPermisosPorModelo,
  });

  // 📋 APPS CON PERMISOS
  const appsConPermisos = useQuery({
    queryKey: ['apps-permisos'],
    queryFn: getAppsConPermisos,
  });

//   // 🔍 OBTENER PERMISO POR ID
//   const getPermisoById = (id) => {
//     return useQuery({
//       queryKey: ['permiso', id],
//       queryFn: () => getPermiso(id),
//       enabled: !!id,
//     });
//   };

//   // Filtrar permisos por app (función helper)
//   const filtrarPorApp = (appLabel) => {
//     return useQuery({
//       queryKey: ['permisos', appLabel],
//       queryFn: () => getPermisos({ app: appLabel }),
//       enabled: !!appLabel,
//     });
//   };

  return {
    permisos,
    permisosPorModelo,
    appsConPermisos,
    // getPermisoById,
    // filtrarPorApp,
  };
};