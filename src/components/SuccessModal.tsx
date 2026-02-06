import { useEffect } from 'react';
import '../styles/SuccessModal.css';

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;

  // 👉 Para registro
  title?: string;
  message?: string;
  buttonText?: string;

  // 👉 Para encuesta
  surveyData?: {
    date: string;
    question1: string;
    question2: string;
    question3: string;
    question4: string;
  };
}

const SuccessModal = ({
  isOpen,
  onClose,
  title,
  message,
  buttonText,
  surveyData,
}: SuccessModalProps) => {

  // Cerrar con ESC + bloquear scroll
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // 👉 Contenido SOLO si es encuesta
  const content = surveyData
    ? `RESPUESTAS DE ENCUESTA
========================

Fecha: ${surveyData.date}
Pregunta 1: ${surveyData.question1}
Pregunta 2: ${surveyData.question2}
Pregunta 3: ${surveyData.question3}
Pregunta 4: ${surveyData.question4}

========================
Fecha de registro: ${new Date().toLocaleString('es-CO')}
`
    : '';

  const handleDownload = () => {
    if (!surveyData) return;

    const blob = new Blob([content], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `encuesta_${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const handleCopy = () => {
    if (!surveyData) return;

    navigator.clipboard.writeText(content).then(() => {
      alert('✓ Respuestas copiadas al portapapeles');
    });
  };

  return (
    <div className="success-modal-overlay" onClick={onClose}>
      <div
        className="success-modal-container"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Icono animado */}
        <div className="success-icon">
          <svg width="100" height="100" viewBox="0 0 100 100" fill="none">
            <circle cx="50" cy="50" r="50" fill="#FFF5F0" />
            <circle cx="50" cy="50" r="38" fill="#FF6B35" />
            <path
              d="M30 50L43 63L70 36"
              stroke="white"
              strokeWidth="6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        {/* Título */}
        <h2 className="success-title">
          {title ?? '¡Proceso completado!'}
        </h2>

        {/* Mensaje */}
        {message && (
          <p className="success-message">{message}</p>
        )}

        {/* Botones SOLO si es encuesta */}
        {surveyData && (
          <>
            <button className="success-btn" onClick={handleDownload}>
              Descargar respuestas
            </button>

            <button className="success-btn secondary" onClick={handleCopy}>
              Copiar respuestas
            </button>
          </>
        )}

        {/* Botón final */}
        <button className="success-btn outline" onClick={onClose}>
          {buttonText ?? 'Cerrar'}
        </button>
      </div>
    </div>
  );
};

export default SuccessModal;
