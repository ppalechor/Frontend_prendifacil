import React from 'react';
import { Loader2 } from 'lucide-react';

/**
 * Boton - Componente de botón reutilizable con soporte para variantes y estado de carga.
 */
const Boton = ({ 
  children, 
  variant = 'primary', 
  isLoading = false, 
  className = '', 
  ...rest 
}) => {

  // Definición de estilos base
  const baseStyle = 'inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-150 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed';

  // Definición de estilos por variante
  let variantStyle = '';
  switch (variant) {
    case 'secondary':
      variantStyle = 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50 focus:ring-indigo-500';
      break;
    case 'danger':
      variantStyle = 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500';
      break;
    case 'primary':
    default:
      variantStyle = 'bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-500';
      break;
  }

  return (
    <button
      className={`${baseStyle} ${variantStyle} ${className}`}
      disabled={rest.disabled || isLoading}
      {...rest}
    >
      {isLoading ? (
        <Loader2 className="animate-spin w-5 h-5 mr-2" />
      ) : null}
      {children}
    </button>
  );
};

export default Boton;