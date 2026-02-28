import React from 'react';
import { Pencil } from 'lucide-react';

export const EditButton = ({ onClick, className = '' }) => {
  return (
    <button
      onClick={onClick}
      className={`p-2 text-gray-600 hover:text-black hover:bg-gray-100 rounded-lg transition-colors ${className}`}
      title="Editar"
    >
      <Pencil size={18} />
    </button>
  );
};