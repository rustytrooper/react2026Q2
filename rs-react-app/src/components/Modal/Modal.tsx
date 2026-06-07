import React, { useEffect, useRef, type ReactNode } from 'react';
import { createPortal } from 'react-dom';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
  const modalRef = useRef<HTMLDivElement>(null);

  const previousFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!isOpen) return;
    previousFocusRef.current = document.activeElement as HTMLElement;

    if (modalRef.current) {
      const focusableElements = getFocusableElements(modalRef.current);
      if (focusableElements.length > 0) {
        focusableElements[0].focus();
      }
    }
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      previousFocusRef.current?.focus();
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen]);

  const getFocusableElements = (container: HTMLElement): HTMLElement[] => {
    const focusableSelectors = ['button', '[href]', 'input:not([disabled])'];

    const elements = container.querySelectorAll<HTMLElement>(
      focusableSelectors.join(',')
    );

    return Array.from(elements).filter((element) => {
      const isVisible = element.offsetParent !== null;
      const hasNoHiddenAttribute = !element.hasAttribute('hidden');
      const isNotAriaHidden = element.getAttribute('aria-hidden') !== 'true';

      return isVisible && hasNoHiddenAttribute && isNotAriaHidden;
    });
  };

  const handleTabKey = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== 'Tab') return;

    const focusableElements = getFocusableElements(modalRef.current!);
    if (focusableElements.length === 0) return;

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    if (event.shiftKey && document.activeElement === firstElement) {
      lastElement.focus();
      event.preventDefault();
    } else if (!event.shiftKey && document.activeElement === lastElement) {
      firstElement.focus();
      event.preventDefault();
    }
  };
  const handleOverlayClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };
  if (!isOpen) return null;
  const modalRoot = document.getElementById('modal-root');
  if (!modalRoot) {
    console.error('Modal root element not found!');
    return null;
  }

  return createPortal(
    <div
      className="modal-overlay"
      onClick={handleOverlayClick}
      role="presentation"
    >
      <div
        ref={modalRef}
        className="modal-content"
        onKeyDown={handleTabKey}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <button onClick={onClose} aria-label="Close modal">
          ✕
        </button>
        {children}
      </div>
    </div>,
    modalRoot
  );
};
