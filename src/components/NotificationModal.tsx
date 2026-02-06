import React from 'react';
import '../styles/notification.css';

interface NotificationModalProps {
  isOpen: boolean;
  type: 'success' | 'error' | 'warning';
  title: string;
  message: string;
  onClose: () => void;
}

const NotificationModal: React.FC<NotificationModalProps> = ({
  isOpen,
  type,
  title,
  message,
  onClose,
}) => {
  if (!isOpen) return null;

  const getIcon = () => {
    switch (type) {
      case 'success':
        return '✓';
      case 'error':
        return '✕';
      case 'warning':
        return '⚠';
      default:
        return '!';
    }
  };

  const getIconClass = () => {
    switch (type) {
      case 'success':
        return 'notification-icon-success';
      case 'error':
        return 'notification-icon-error';
      case 'warning':
        return 'notification-icon-warning';
      default:
        return '';
    }
  };

  return (
    <div className="notification-overlay" onClick={onClose}>
      <div className="notification-content" onClick={(e) => e.stopPropagation()}>
        <div className={`notification-icon ${getIconClass()}`}>
          {getIcon()}
        </div>
        <h3 className="notification-title">{title}</h3>
        <p className="notification-message">{message}</p>
        <button className="notification-button" onClick={onClose}>
          Entendido
        </button>
      </div>
    </div>
  );
};

export default NotificationModal;