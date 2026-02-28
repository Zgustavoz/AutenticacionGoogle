//src/App.jsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './Auth/context/AuthContext';
import ProtectedRoute from './Auth/components/ProtectedRoute';
import Login from './Auth/pages/Login';
import Registro from './Auth/pages/Registro';
import RecuperarPassword from './Auth/pages/RecuperarPassword';
import RestablecerPassword from './Auth/pages/RestablecerPassword';
import { DashboardLayout } from './dashBoard/DashBoard';
import ClienteDashboard from './cliente/clientePage';
import Unauthorized from "./Auth/pages/Unauthorized";
import NotFound from "./Auth/pages/NotFound";

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