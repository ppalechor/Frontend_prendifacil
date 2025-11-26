import React, { useEffect } from 'react';
import { CheckCircle, AlertTriangle, XCircle, X } from 'lucide-react';

/**
 * Notificacion - Muestra mensajes temporales (Toast) en la esquina superior derecha.
 */
const Notificacion = ({ isVisible, message, type = 'success', onClose }) => {
  
  // Oculta la notificación automáticamente después de 4 segundos
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  let icon, colorClasses;

  switch (type) {
    case 'success':
      icon = <CheckCircle className="w-6 h-6" />;
      colorClasses = 'bg-green-500 border-green-700 text-white';
      break;
    case 'warning':
      icon = <AlertTriangle className="w-6 h-6" />;
      colorClasses = 'bg-yellow-500 border-yellow-700 text-gray-900';
      break;
    case 'error':
      icon = <XCircle className="w-6 h-6" />;
      colorClasses = 'bg-red-500 border-red-700 text-white';
      break;
    default:
      icon = <CheckCircle className="w-6 h-6" />;
      colorClasses = 'bg-indigo-500 border-indigo-700 text-white';
  }

  return (
    <div 
      className={`fixed top-4 right-4 z-[100] p-4 pr-6 rounded-lg shadow-2xl transition-opacity duration-300 transform ${colorClasses} border-l-4`}
      role="alert"
    >
      <div className="flex items-center">
        <div className="flex-shrink-0 mr-3">
          {icon}
        </div>
        <p className="font-medium text-sm">
          {message}
        </p>
        <button 
          onClick={onClose} 
          className="absolute right-1 top-1 p-1 rounded-full hover:bg-white/20 transition"
          aria-label="Cerrar notificación"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default Notificacion;