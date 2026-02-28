//src/auth/components/ProtectedRoute.jsx
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Unauthorized from '../pages/Unauthorized';
import { mapaPermisos } from '../../components/utils/Permisos';

function ProtectedRoute({ 
  children, 
  requiredPermission = null,  // 👈 Permiso específico requerido
  requiredRoles = [],          // 👈 Roles requeridos (opcional)
  employeeOnly = false 
}) {
  const { user, loading } = useAuth();


  if (loading) return <div>Cargando...</div>;

  // No autenticado
  if (!user) { return <Navigate to="/login" replace />; }

  // Admin todo poderoso tiene acceso a TODO
  if (user.es_admin) { return children;}

  // Verificar permiso específico
  if (requiredPermission) {
    const tienePermiso = user.permisos?.includes(mapaPermisos[requiredPermission]);
    if (!tienePermiso) { return <Unauthorized />; }}

  //Verificar roles específicos
  if (requiredRoles.length > 0) {
    const userRoles = user.roles || [];
    const tieneRol = requiredRoles.some(rol => userRoles.includes(rol));
    if (!tieneRol) { return <Unauthorized />; }
  }

  // 5️⃣ Si es área de empleados (opcional)
  if (employeeOnly) {
    const esEmpleado = user.roles?.includes('empleado');
    if (!esEmpleado) { return <Unauthorized />; }
  }

  return children;
}

export default ProtectedRoute;