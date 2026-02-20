// src/components/DownloadButton.jsx
import { FiDownload } from 'react-icons/fi';
import { useState } from 'react';

const DownloadButton = ({ 
  version = "1.0.0",  // ← VALOR POR DEFECTO
  fileSize = "48.5 MB" // ← VALOR POR DEFECTO
}) => {
  const apkUrl = "https://www.mediafire.com/file/gx4s3poi113ow7t/AutenticacionGoogle.apk/file"; // ← CORREGIDO: punto y coma por coma
  const [isHovered, setIsHovered] = useState(false);

  const handleDownload = () => {
    console.log('Iniciando descarga de la app');
    window.open(apkUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="mt-6 text-center">
      <button
        onClick={handleDownload}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="inline-flex items-center justify-center gap-2 px-6 py-3 
                   bg-gradient-to-r from-green-500 to-emerald-600 
                   text-white rounded-lg 
                   hover:from-green-600 hover:to-emerald-700 
                   transition-all duration-300 transform 
                   hover:scale-105 hover:shadow-lg
                   focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2"
      >
        <FiDownload className={`text-xl transition-transform duration-300 ${isHovered ? 'translate-y-1' : ''}`} />
        <span className="font-semibold">Descargar App Android</span>
      </button>
      
      <div className="mt-2 text-xs text-gray-500 space-x-2">
        <span>Versión {version}</span>
        <span>•</span>
        <span>{fileSize}</span>
        <span>•</span>
        <span className="text-green-600">APK directo</span>
      </div>
      
      <p className="text-xs text-gray-400 mt-1">
        Requiere Android 5.0 o superior
      </p>
    </div>
  );
};

export default DownloadButton;