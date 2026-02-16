import { useAuth } from '../context/AuthContext';

function AdminDashboard() {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-purple-700">
      <nav className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-800">
                Panel de Administrador
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">
                👤 {user?.username} ({user?.rol})
              </span>
              <button
                onClick={logout}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition"
              >
                Cerrar Sesión
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow-xl p-8">
          <div className="text-center">
            <div className="text-6xl mb-4">🔧</div>
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              Interfaz Administrador
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Bienvenido al panel de administración, {user?.username}
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
              <div className="bg-blue-50 p-6 rounded-lg">
                <h3 className="text-xl font-semibold text-blue-800 mb-2">
                  Usuarios
                </h3>
                <p className="text-gray-600">Gestionar usuarios del sistema</p>
              </div>
              
              <div className="bg-purple-50 p-6 rounded-lg">
                <h3 className="text-xl font-semibold text-purple-800 mb-2">
                  Productos
                </h3>
                <p className="text-gray-600">Administrar inventario</p>
              </div>
              
              <div className="bg-green-50 p-6 rounded-lg">
                <h3 className="text-xl font-semibold text-green-800 mb-2">
                  Reportes
                </h3>
                <p className="text-gray-600">Ver estadísticas y reportes</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;