//src/dashBoard/components/layout/Sidebar.jsx
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  User,
  LogOut,
  ChevronDown,
  Menu,
  X,
  ShoppingBag,
  Users,
  Shield,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState, useEffect } from "react";
import { useAuth } from '../../../Auth/context/AuthContext';
import { useAuth as useAuthHook } from '../../../Auth/hooks/useAuth';
import { useNavigate } from 'react-router-dom';

export const Sidebar = () => {
  const location = useLocation();
  const { user, tieneAcceso } = useAuth();
  const { logout } = useAuthHook();
  const [isOpen, setIsOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openSubmenus, setOpenSubmenus] = useState({});
  const navigate = useNavigate();

  // Detectar móvil
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth < 768) {
        setIsOpen(false);
      } else {
        setIsOpen(true);
      }
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Cerrar sesión
  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  // Configuración de menús - TODOS LOS BLOQUES SIEMPRE VISIBLES
  const menuItems = [
    {
      title: "Dashboard",
      path: "/dashboard",
      icon: LayoutDashboard,
      exact: true,
    },
    {
      title: "Gestion Usuarios",
      icon: Users,
      subItems: [
        { title: "Usuarios", path: "/dashboard/usuarios", icon: User, roles: ["admin", "categorias"] },
        { title: "Roles y Permisos", path: "/dashboard/roles", icon: Shield, roles: ["admin", "roles"] },
      ],
    },
    {
      title: "Inventario",
      icon: ShoppingBag,
      subItems: [
        { title: "Productos", path: "/dashboard/productos", icon: ShoppingBag, roles: ["admin", "productos"] },
        { title: "Categorías", path: "/dashboard/categorias", icon: ShoppingBag, roles: ["admin", "categorias"] },
        { title: "Proveedores", path: "/dashboard/proveedores", icon: ShoppingBag, roles: ["admin", "proveedores"] },
      ]
    },
  ];

  const toggleSubmenu = (key) => {
    if (!isMobile && !isOpen) {
      setIsOpen(true);
      setTimeout(() => {
        setOpenSubmenus((prev) => ({ ...prev, [key]: !prev[key] }));
      }, 300);
    } else {
      setOpenSubmenus((prev) => ({ ...prev, [key]: !prev[key] }));
    }
  };

  const closeMobileMenu = () => {
    if (isMobile) setMobileOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  const isParentActive = (item) => {
    if (item.path) return location.pathname === item.path;
    if (item.subItems) {
      return item.subItems.some((sub) => location.pathname === sub.path);
    }
    return false;
  };

  const shouldShowExpanded = () => (isMobile ? mobileOpen : isOpen);

  return (
    <>
      {/* Mobile Menu Button */}
      {isMobile && (
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="fixed top-4 left-4 z-50 bg-black text-white p-2 rounded-lg shadow-lg md:hidden"
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      )}

      {/* Mobile Overlay */}
      {isMobile && mobileOpen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <motion.div
        animate={{
          width: isMobile ? (mobileOpen ? 280 : 0) : isOpen ? 280 : 80,
          x: isMobile ? (mobileOpen ? 0 : -280) : 0,
        }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="fixed md:relative bg-white text-gray-900 h-full flex flex-col z-40 shadow-xl border-r border-gray-200"
      >
        {/* Header */}
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center gap-3 min-w-0">
            <div
              className={`${
                shouldShowExpanded() ? "w-10 h-10" : "w-8 h-8 mx-auto"
              } bg-black rounded-xl flex items-center justify-center shadow-sm flex-shrink-0 transition-all`}
            >
              <ShoppingBag
                className={`${
                  shouldShowExpanded() ? "w-6 h-6" : "w-5 h-5"
                } text-white`}
              />
            </div>
            <AnimatePresence mode="wait">
              {shouldShowExpanded() && (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="min-w-0"
                >
                  <h1 className="text-lg font-bold truncate">Mi App</h1>
                  <p className="text-gray-500 text-sm truncate">
                    {user?.es_admin ? "Administrador" : "Empleado"}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Desktop Toggle */}
          {!isMobile && shouldShowExpanded() && (
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-500 hover:text-black hover:bg-gray-100 rounded-lg p-1 transition-colors flex-shrink-0"
            >
              <ChevronDown size={16} className="rotate-90" />
            </button>
          )}
        </div>

        {/* Menu Items - TODOS LOS BLOQUES SIEMPRE VISIBLES */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const hasSub = !!item.subItems;
            const active = isParentActive(item);
            const submenuOpen = openSubmenus[item.title];

            return (
              <div key={item.title}>
                {/* Bloque principal - SIEMPRE VISIBLE */}
                {hasSub ? (
                  <motion.div
                    whileHover={{ scale: shouldShowExpanded() ? 1.02 : 1 }}
                    whileTap={{ scale: 0.98 }}
                    className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all ${
                      active
                        ? "bg-gray-900 text-white shadow-sm"
                        : "text-gray-700 hover:bg-gray-100"
                    } ${!shouldShowExpanded() ? "justify-center" : ""}`}
                    onClick={() => toggleSubmenu(item.title)}
                  >
                    <div
                      className={`flex items-center ${
                        shouldShowExpanded() ? "gap-3" : "justify-center"
                      } min-w-0`}
                    >
                      <div
                        className={`p-2 rounded-lg ${
                          active ? "bg-gray-800" : "bg-gray-100"
                        } ${!shouldShowExpanded() ? "mx-auto" : ""}`}
                      >
                        <Icon className="w-4 h-4" />
                      </div>
                      <AnimatePresence>
                        {shouldShowExpanded() && (
                          <motion.span
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -10 }}
                            className="text-sm font-medium truncate"
                          >
                            {item.title}
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </div>

                    {shouldShowExpanded() && (
                      <motion.div
                        animate={{ rotate: submenuOpen ? 180 : 0 }}
                        transition={{ duration: 0.3 }}
                        className="flex-shrink-0"
                      >
                        <ChevronDown className="w-4 h-4" />
                      </motion.div>
                    )}
                  </motion.div>
                ) : (
                  <Link to={item.path} onClick={closeMobileMenu}>
                    <motion.div
                      whileHover={{ scale: shouldShowExpanded() ? 1.02 : 1 }}
                      whileTap={{ scale: 0.98 }}
                      className={`flex items-center p-3 rounded-xl cursor-pointer transition-all ${
                        isActive(item.path)
                          ? "bg-gray-900 text-white shadow-sm"
                          : "text-gray-700 hover:bg-gray-100"
                      } ${!shouldShowExpanded() ? "justify-center" : ""}`}
                    >
                      <div
                        className={`p-2 rounded-lg ${
                          isActive(item.path) ? "bg-gray-800" : "bg-gray-100"
                        } ${!shouldShowExpanded() ? "mx-auto" : ""}`}
                      >
                        <Icon className="w-4 h-4" />
                      </div>
                      <AnimatePresence>
                        {shouldShowExpanded() && (
                          <motion.span
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -10 }}
                            className="text-sm font-medium ml-3 truncate"
                          >
                            {item.title}
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  </Link>
                )}

                {/* Subitems - CON ESTADOS DESHABILITADOS */}
                {hasSub && (
                  <AnimatePresence>
                    {submenuOpen && shouldShowExpanded() && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="ml-4 pl-6 border-l-2 border-gray-200 flex flex-col space-y-1 overflow-hidden mt-1"
                      >
                        {item.subItems.map((sub) => {
                          const SubIcon = sub.icon;
                          const subActive = isActive(sub.path);
                          const puedeAcceder = tieneAcceso(sub.roles);

                          return puedeAcceder ? (
                            <Link
                              key={sub.title}
                              to={sub.path}
                              onClick={closeMobileMenu}
                            >
                              <motion.div
                                whileHover={{ scale: 1.02, x: 4 }}
                                whileTap={{ scale: 0.98 }}
                                className={`flex items-center p-2 rounded-lg transition-all ${
                                  subActive
                                    ? "bg-gray-800 text-white shadow-sm"
                                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                                }`}
                              >
                                {SubIcon && (
                                  <SubIcon className="w-3 h-3 mr-2 flex-shrink-0" />
                                )}
                                <span className="text-xs font-medium truncate">
                                  {sub.title}
                                </span>
                              </motion.div>
                            </Link>
                          ) : (
                            <div
                              key={sub.title}
                              className="flex items-center p-2 rounded-lg text-gray-400 cursor-not-allowed opacity-50"
                              title="No tienes permisos para acceder"
                            >
                              {SubIcon && (
                                <SubIcon className="w-3 h-3 mr-2 flex-shrink-0" />
                              )}
                              <span className="text-xs font-medium truncate">
                                {sub.title}
                              </span>
                            </div>
                          );
                        })}
                      </motion.div>
                    )}
                  </AnimatePresence>
                )}
              </div>
            );
          })}
        </nav>

        {/* Logout Section */}
        <div className="p-4 border-t border-gray-200">
          <button
            onClick={handleLogout}
            className={`flex items-center p-3 rounded-xl text-gray-700 hover:bg-red-50 hover:text-red-600 w-full transition-all group ${
              !shouldShowExpanded() ? "justify-center" : ""
            }`}
          >
            <div className="p-2 rounded-lg bg-gray-100 group-hover:bg-red-100 transition-colors">
              <LogOut className="w-4 h-4" />
            </div>
            <AnimatePresence>
              {shouldShowExpanded() && (
                <motion.span
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="text-sm font-medium ml-3"
                >
                  Cerrar sesión
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        </div>
      </motion.div>
    </>
  );
};