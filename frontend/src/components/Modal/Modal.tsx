// Modal.js
import React from "react";
import styles from '../../style/Modal.module.scss';

const Modal: React.FC<{
  isOpen: boolean;
  onRequestClose: () => void;
  children: React.ReactNode;
}> = ({ isOpen, onRequestClose, children }) => {
  const modalClasses = `${styles.modalOverlay} ${isOpen ? styles.open : styles.hide}`;
  const contentClasses = `${styles.modalContent} ${isOpen ? styles.open : styles.hide}`;

  return (
    <div className={modalClasses} onClick={onRequestClose}>
      <div className={contentClasses} onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
};

export default Modal;
