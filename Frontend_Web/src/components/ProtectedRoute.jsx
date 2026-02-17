// src/components/ProtectedRoute.jsx
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Unauthorized from './../Auth/pages/Unauthorized';

function ProtectedRoute({ children, requireAdmin = false }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-600 to-blue-500">
        <div className="text-white text-2xl">Cargando...</div>
      </div>
    );
  }

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