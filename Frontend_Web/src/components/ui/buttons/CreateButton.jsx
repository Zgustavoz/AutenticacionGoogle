//src/components/ui/buttons/CreateButton.jsx
import { Plus } from 'lucide-react';

export const CreateButton = ({ onClick, children = 'Nuevo', className = '' }) => {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors ${className}`}
    >
      <Plus size={18} />
      {children}
    </button>
  );
};