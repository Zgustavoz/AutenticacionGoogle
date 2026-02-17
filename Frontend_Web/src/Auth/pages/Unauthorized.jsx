// src/Auth/pages/Unauthorized.jsx
import { Link } from 'react-router-dom';

function Unauthorized() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-10 rounded-2xl shadow-xl text-center">
        <h1 className="text-4xl font-bold text-red-500 mb-4">403</h1>
        <p className="text-gray-600 mb-6">
          VUELVE Y INICIA SESION RATA 
        </p>
        <Link
          to="/login"
          className="bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition"
        >
          Volver al inicio
        </Link>
      </div>
    </div>
  );
}

export default Unauthorized;