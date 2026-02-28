// src/Auth/pages/Unauthorized.jsx
import { Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

 function Unauthorized({ mensaje = "No tienes permisos para acceder a esta sección" }) {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-[400px] flex flex-col items-center justify-center p-8">
      <div className="bg-red-50 rounded-full p-4 mb-4">
        <Shield className="w-12 h-12 text-red-500" />
      </div>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Acceso Denegado</h2>
      <p className="text-gray-600 text-center mb-6">{mensaje}</p>
      <button
        onClick={() => navigate(-1)}
        className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800"
      >
        Volver
      </button>
    </div>
  );
};

export default Unauthorized;