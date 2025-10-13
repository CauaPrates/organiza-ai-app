import React, { useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import './Modal.css';

interface BaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  subtitle?: string;
  size?: 'small' | 'medium' | 'large' | 'full';
  showCloseButton?: boolean;
  className?: string;
}

interface ModalProps extends BaseModalProps {
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({
  children,
  className = '',
  isOpen,
  onClose,
  title,
  subtitle,
  size = 'medium',
  showCloseButton = true,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
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

  // Focar no modal quando abrir
  useEffect(() => {
    if (isOpen && modalRef.current) {
      modalRef.current.focus();
    }
  }, [isOpen]);

  console.log('Modal - isOpen:', isOpen);
  if (!isOpen) return null;

  const sizeClasses = {
    small: 'max-w-md',
    medium: 'max-w-lg',
    large: 'max-w-2xl',
    full: 'max-w-full mx-4',
  };

  const handleBackdropClick = (event: React.MouseEvent) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  const modalContent = (
    <div 
      className="modal-overlay"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? 'modal-title' : undefined}
      aria-describedby={subtitle ? 'modal-subtitle' : undefined}
    >
      <div 
        ref={modalRef}
        className={`modal-container ${size} ${className}`}
        onClick={(e) => e.stopPropagation()}
        tabIndex={-1}
      >
        {/* Header */}
        {(title || subtitle || showCloseButton) && (
          <div className="modal-header">
            {title && (
              <h2 id="modal-title" className="modal-title">
                {title}
              </h2>
            )}
            {subtitle && (
              <p id="modal-subtitle" className="modal-subtitle">
                {subtitle}
              </p>
            )}
            {showCloseButton && (
              <button
                onClick={onClose}
                className="modal-close-button"
                aria-label="Fechar modal"
              >
                ×
              </button>
            )}
          </div>
        )}
        
        {/* Content */}
        <div className="modal-content">
          {children}
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};

export { Modal };