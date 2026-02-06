import { useEffect } from 'react';
import '../styles/Modal.css';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  userData: {
    email: string;
    username: string;
    phone: string;
  };
  isLoading?: boolean;
}

const Modal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title, 
  message, 
  userData,
  isLoading = false 
}: ModalProps) => {
  // Cerrar modal con tecla ESC
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen && !isLoading) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      // Prevenir scroll del body cuando el modal está abierto
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose, isLoading]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={!isLoading ? onClose : undefined}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">{title}</h2>
          {!isLoading && (
            <button 
              className="modal-close-btn" 
              onClick={onClose}
              aria-label="Cerrar modal"
            >
              ✕
            </button>
          )}
        </div>

        <div className="modal-body">
          <p className="modal-message">{message}</p>
          
          <div className="modal-user-info">
            <div className="info-row">
              <span className="info-label">Email:</span>
              <span className="info-value">{userData.email}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Usuario:</span>
              <span className="info-value">{userData.username}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Teléfono:</span>
              <span className="info-value">{userData.phone}</span>
            </div>
          </div>

          {isLoading && (
            <div className="modal-loading">
              <div className="spinner"></div>
              <p>Procesando registro...</p>
            </div>
          )}
        </div>

        <div className="modal-footer">
          <button 
            className="modal-btn modal-btn-cancel" 
            onClick={onClose}
            disabled={isLoading}
          >
            Cancelar
          </button>
          <button 
            className="modal-btn modal-btn-confirm" 
            onClick={onConfirm}
            disabled={isLoading}
          >
            {isLoading ? 'Procesando...' : 'Confirmar'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;