// RestablecerPassword.jsx
import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import toast from 'react-hot-toast';

function RestablecerPassword() {
  const { uid, token } = useParams();
  const navigate = useNavigate();
  const { restablecer } = useAuth();
  
  const [formData, setFormData] = useState({
    password: '',
    password2: ''
  });
  const [fieldErrors, setFieldErrors] = useState({});

  // Validar que uid y token existan
  if (!uid || !token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-600 to-blue-500 p-4">
        <div className="bg-white rounded-lg shadow-2xl p-8 w-full max-w-md text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-2">Enlace Inválido</h2>
          <p className="text-gray-600 mb-4">El enlace de recuperación no es válido.</p>
          <button
            onClick={() => navigate('/login')}
            className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700"
          >
            Ir al Login
          </button>
        </div>
      </div>
    );
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    if (fieldErrors[e.target.name]) {
      setFieldErrors({ ...fieldErrors, [e.target.name]: '' });
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.password) {
      errors.password = 'La contraseña es requerida';
    } else if (formData.password.length < 8) {
      errors.password = 'La contraseña debe tener al menos 8 caracteres';
    }
    if (!formData.password2) {
      errors.password2 = 'Debes confirmar tu contraseña';
    } else if (formData.password !== formData.password2) {
      errors.password2 = 'Las contraseñas no coinciden';
    }
    return errors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }
    
    // Mostrar datos que se enviarán
    console.log('📤 Enviando:', {
      uid,
      token,
      password: formData.password
    });
    
    restablecer.mutate(
      {
        uid,
        token,
        password: formData.password  // Enviamos como 'password'
      },
      {
        onSuccess: () => {
          setTimeout(() => navigate('/login'), 2000);
        },
        onError: (error) => {
          console.error('❌ Error:', error);
          toast.error(error.error || 'Error al restablecer contraseña');
        }
      }
    );
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-600 to-blue-500 p-4">
      <div className="bg-white rounded-lg shadow-2xl p-8 w-full max-w-md">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-2">
          Restablecer Contraseña
        </h2>
        <p className="text-center text-gray-600 mb-6">
          Ingresa tu nueva contraseña
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nueva Contraseña
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Mínimo 8 caracteres"
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 ${
                fieldErrors.password ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {fieldErrors.password && (
              <p className="text-red-500 text-xs mt-1">{fieldErrors.password}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Confirmar Contraseña
            </label>
            <input
              type="password"
              name="password2"
              value={formData.password2}
              onChange={handleChange}
              placeholder="Repite tu contraseña"
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 ${
                fieldErrors.password2 ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {fieldErrors.password2 && (
              <p className="text-red-500 text-xs mt-1">{fieldErrors.password2}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={restablecer.isPending}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-500 text-white font-semibold py-3 rounded-lg hover:shadow-lg disabled:opacity-50"
          >
            {restablecer.isPending ? 'Actualizando...' : 'Restablecer Contraseña'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default RestablecerPassword;