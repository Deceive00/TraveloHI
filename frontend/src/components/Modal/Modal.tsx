// Modal.js
import React, { useRef } from "react";
import styles from './Modal.module.scss';
import { IoClose } from "react-icons/io5";

const Modal: React.FC<{
  isOpen: boolean;
  onRequestClose: () => void;
  children: React.ReactNode;
}> = ({ isOpen, onRequestClose, children }) => {
  const modalClasses = `${styles.modalOverlay} ${isOpen ? styles.open : styles.hide}`;
  const contentClasses = `${styles.modalContent} ${isOpen ? styles.open : styles.hide}`;
  const contentRef = useRef<HTMLDivElement | null>(null);

  const handleClick = (e: React.MouseEvent) => {
    if (contentRef.current && contentRef.current?.contains(e.target as Node)) {
      return; 
    }
    onRequestClose();
  };
  return (
    <div className={modalClasses} onClick={handleClick}>
      <div ref={contentRef} className={contentClasses} onClick={(e) => e.stopPropagation()}>
        <IoClose
          style={{
            position: "absolute",
            right: "0.5vw",
            top: "0.5vw",
            width: "2rem",
            height: "2rem",
            cursor: "pointer"
          }}
          onClick={onRequestClose}
        />
        {children}
      </div>
    </div>
  );
};

export default Modal;
