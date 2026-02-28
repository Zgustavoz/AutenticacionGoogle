//src/App.jsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './auth/context/AuthContext';
import ProtectedRoute from './auth/components/ProtectedRoute';
import Login from './auth/pages/Login';
import Registro from './auth/pages/Registro';
import RecuperarPassword from './auth/pages/RecuperarPassword';
import RestablecerPassword from './auth/pages/RestablecerPassword';
import { DashboardLayout } from './dashBoard/DashBoard';
import ClienteDashboard from './cliente/clientePage';
import Unauthorized from "./auth/pages/Unauthorized";
import NotFound from "./auth/pages/NotFound";

import { RolesPage } from './dashBoard/roles/pages/RolesPage';
import { UsuariosPage } from './dashBoard/usuarios/pages/UsuariosPage';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Rutas públicas */}
          <Route path="/login" element={<Login />} />
          <Route path="/registro" element={<Registro />} />
          <Route path="/recuperar-password" element={<RecuperarPassword />} />
          <Route path="/reset-password/:uid/:token" element={<RestablecerPassword />} />
          <Route path="/unauthorized" element={<Unauthorized />} />
          <Route path="*" element={<NotFound />} />
          <Route path="/" element={<Navigate to="/login" />} />

          {/* Dashboard solo empleados */}
          <Route path="/dashboard" element= {<ProtectedRoute requiredPermission='dashboard'> <DashboardLayout /></ProtectedRoute>}>
            <Route path="usuarios" element={<ProtectedRoute requiredRoles={['admin']}><UsuariosPage /></ProtectedRoute>} />
            <Route path="roles" element={<ProtectedRoute requiredRoles={['admin']}><RolesPage /></ProtectedRoute>} />
          </Route>

          {/* Cliente */}
          <Route path="/cliente" element= {<ProtectedRoute requireAdmin={false}> <ClienteDashboard /></ProtectedRoute>}>
          {/* Poner rutas del cliente */}
          </Route>

        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;