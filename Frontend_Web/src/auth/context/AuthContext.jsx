// src/auth/context/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from "react";
import { obtenerPerfil } from "../../api/auth/authApi";
import { mapaPermisos } from "../../components/utils/Permisos";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Al montar, verificar si hay sesión activa pidiendo el perfil
  useEffect(() => {
    obtenerPerfil()
      .then((perfil) => {
        setUser({
          id: perfil.id,
          username: perfil.username,
          email: perfil.email,
          roles: perfil.roles_info?.map(r => r.nombre) || [],
          permisos: perfil.permisos || [],
          es_admin: perfil.es_admin,
        });
      })
      .catch(() => {
        setUser(null); // no hay sesión activa
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const login = (perfilData) => {
    setUser({
      id: perfilData.id,
      username: perfilData.username,
      email: perfilData.email,
      roles: perfilData.roles_info?.map(r => r.nombre) || [],
      permisos: perfilData.permisos || [],
      es_admin: perfilData.es_admin,
    });
  };

  const logout = () => {
    setUser(null);
  };

  const tieneAcceso = (rolesRequeridos = []) => {
    if (user?.es_admin) return true;
    if (!rolesRequeridos.length) return true;
    return rolesRequeridos.some(rol => user?.roles?.includes(rol));
  };

  const tienePermiso = (nombrePermiso) => {
    if (user?.es_admin) return true;
    const codigo = mapaPermisos[nombrePermiso];
    if (!codigo) return false;
    return user?.permisos?.includes(codigo);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, tienePermiso, tieneAcceso }}>
      {children}
    </AuthContext.Provider>
  );
};

/* eslint-disable react-refresh/only-export-components */
export const useAuth = () => useContext(AuthContext);