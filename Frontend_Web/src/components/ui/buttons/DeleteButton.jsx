import React from 'react';
import { Trash2 } from 'lucide-react';

export const DeleteButton = ({ onClick, className = '' }) => {
  return (
    <button
      onClick={onClick}
      className={`p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors ${className}`}
      title="Eliminar"
    >
      <Trash2 size={18} />
    </button>
  );
};