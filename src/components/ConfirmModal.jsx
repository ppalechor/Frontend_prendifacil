import React from 'react';
import Tarjeta from './tarjeta.jsx'; 
import Boton from './boton.jsx';   
import { AlertTriangle, X } from 'lucide-react';

/**
 * ConfirmModal - Modal de diálogo para pedir confirmación al usuario.
 */
const ConfirmModal = ({ 
  isOpen, 
  title, 
  message, 
  onConfirm, 
  onCancel, 
  confirmText = 'Confirmar',
  cancelText = 'Cancelar'
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex justify-center items-center z-50 p-4">
      <Tarjeta className="w-full max-w-sm relative text-center">
        <button
          onClick={onCancel}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 transition"
          title="Cerrar"
        >
          <X className="w-6 h-6" />
        </button>
        
        <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-gray-800 mb-2">{title}</h2>
        <p className="text-gray-600 mb-6">{message}</p>
        
        <div className="flex justify-center space-x-4">
          <Boton variant="secondary" onClick={onCancel}>
            {cancelText}
          </Boton>
          <Boton variant="danger" onClick={onConfirm}>
            {confirmText}
          </Boton>
        </div>
      </Tarjeta>
    </div>
  );
};

export default ConfirmModal;