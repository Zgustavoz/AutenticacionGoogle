import { createContext, useContext, useState } from "react";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

  const [user, setUser] = useState(() => {
    const token = localStorage.getItem("access_token");

    if (!token) return null;

    try {
      const payload = jwtDecode(token);

      return {
        id: payload.user_id,
        username: payload.username,
        email: payload.email,
        rol: payload.rol,
        es_admin: payload.es_admin,
      };
    } catch {
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      return null;
    }
  });

  const login = (userData) => {
    setUser(userData);
  };

  const loginWithGoogle = (userData) => {
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, login, loginWithGoogle, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

/* eslint-disable react-refresh/only-export-components */
export const useAuth = () => useContext(AuthContext);