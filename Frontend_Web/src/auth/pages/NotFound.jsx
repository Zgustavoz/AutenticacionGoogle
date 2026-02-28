// src/Auth/pages/NotFound.jsx
import { useNavigate } from 'react-router-dom';

function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <h1 className="text-5xl font-bold text-gray-800 mb-4">404</h1>
        <p className="text-gray-600 mb-6">Página no encontrada.</p>
        <button
          onClick={() => navigate(-1)}
          className="bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition"
        >
          Volver
        </button>
      </div>
    </div>
  );
}

export default NotFound;