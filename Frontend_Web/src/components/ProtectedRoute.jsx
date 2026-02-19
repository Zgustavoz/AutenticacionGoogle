// src/components/ProtectedRoute.jsx
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Unauthorized from './../Auth/pages/Unauthorized';

function ProtectedRoute({ children, requireAdmin = false }) {
  const { user } = useAuth();

  // 🔐 No autenticado
  if (!user) {
    return <Navigate to="/unauthorized" replace />;
  }

  // 🚫 Autenticado pero sin permisos
  if (requireAdmin && !user.es_admin) {
    return <Unauthorized />;
  }

  // 🔄 Admin intentando entrar a cliente
  if (!requireAdmin && user.es_admin) {
    return <Navigate to="/admin" replace />;
  }

  return children;
}

export default ProtectedRoute;