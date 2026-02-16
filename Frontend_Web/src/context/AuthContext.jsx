import { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const token = localStorage.getItem('access_token');
    
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const userData = {
          id: payload.user_id,
          username: payload.username,
          email: payload.email,
          rol: payload.rol,
          es_admin: payload.es_admin
        };
        setUser(userData);
      } catch (error) {
        console.error('Error al verificar autenticación:', error);
        logout();
      }
    }
    setLoading(false);
  };

  // 👇 CAMBIO: Esta función ya no navega, solo actualiza el estado
  const login = (userData) => {
    console.log('Actualizando estado del usuario en contexto:', userData);
    setUser(userData);
  };

  const loginWithGoogle = (userData) => {
    console.log('Actualizando estado del usuario (Google) en contexto:', userData);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    setUser(null);
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ user, login, loginWithGoogle, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de AuthProvider');
  }
  return context;
};