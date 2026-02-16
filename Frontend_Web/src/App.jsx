import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './Auth/pages/Login';
import Registro from './Auth/pages/Registro';
import RecuperarPassword from './Auth/pages/RecuperarPassword';
import RestablecerPassword from './Auth/pages/RestablecerPassword';
import AdminDashboard from './DashBoard/DashBoardPage';
import ClienteDashboard from './cliente/clientePage';
import Unauthorized from "./Auth/pages/Unauthorized";
import NotFound from "./Auth/pages/NotFound";

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

          {/* Ruta protegida - Solo Admin */}
          <Route 
            path="/admin" 
            element={
              <ProtectedRoute requireAdmin={true}>
                <AdminDashboard />
              </ProtectedRoute>
            } 
          />
          
          {/* Ruta protegida - Solo Cliente */}
          <Route 
            path="/cliente" 
            element={
              <ProtectedRoute requireAdmin={false}>
                <ClienteDashboard />
              </ProtectedRoute>
            } 
          />
          
          {/* Ruta por defecto */}
          <Route path="/" element={<Navigate to="/login" />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;