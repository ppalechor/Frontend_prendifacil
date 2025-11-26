import React from 'react';

/**
 * Tarjeta (Card) - Contenedor base para secciones de contenido.
 * @param {object} props - Propiedades del componente.
 * @param {string} props.className - Clases adicionales de Tailwind para personalizar.
 * @param {React.ReactNode} props.children - Contenido anidado.
 */
const Tarjeta = ({ children, className = '' }) => {
  return (
    <div
      className={`bg-white shadow-xl rounded-xl p-6 transition-all duration-300 ${className}`}
    >
      {children}
    </div>
  );
};

export default Tarjeta;