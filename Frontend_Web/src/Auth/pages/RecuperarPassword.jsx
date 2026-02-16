// RecuperarPassword.jsx
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

function RecuperarPassword() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const { recuperarPassword } = useAuth();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) {
      setError('Email requerido');
      return;
    }
    setError('');
    recuperarPassword.mutate({ email });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-600 to-blue-500 p-4">
      <div className="bg-white rounded-lg shadow-2xl p-8 w-full max-w-md">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-2">
          Recuperar Contraseña
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="tu@email.com"
            className="w-full px-4 py-3 border rounded-lg"
          />
          {error && <p className="text-red-500 text-sm">{error}</p>}
          
          <button
            type="submit"
            disabled={recuperarPassword.isPending}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-500 text-white py-3 rounded-lg"
          >
            {recuperarPassword.isPending ? 'Enviando...' : 'Enviar instrucciones'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default RecuperarPassword;