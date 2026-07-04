import React from 'react';
import { IoCheckmarkCircleOutline, IoCloseCircleOutline, IoWarningOutline } from 'react-icons/io5';
import './Popup.css';

export type PopupType = 'success' | 'error' | 'warning';

interface PopupProps {
  isOpen: boolean;
  type: PopupType;
  title: string;
  message: string;
  onClose: () => void;
}

const Popup: React.FC<PopupProps> = ({ isOpen, type, title, message, onClose }) => {
  if (!isOpen) return null;

  const renderIcon = () => {
    switch (type) {
      case 'success':
        return <IoCheckmarkCircleOutline className="popup-icon success" />;
      case 'error':
        return <IoCloseCircleOutline className="popup-icon error" />;
      case 'warning':
        return <IoWarningOutline className="popup-icon warning" />;
      default:
        return null;
    }
  };

  return (
    <div className="popup-overlay">
      <div className="popup-card">
        {renderIcon()}
        <h2 className="popup-title">{title}</h2>
        <p className="popup-message">{message}</p>
        <div className="popup-actions">
          <button 
            className={`btn-popup-close ${type}`}
            onClick={onClose}
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};

export default Popup;
