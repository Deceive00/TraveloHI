import React, { useEffect, CSSProperties, useState } from 'react';

interface SnackbarProps {
  message: string;
  type: string;
  show: boolean;
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
}

const Snackbar: React.FC<SnackbarProps> = ({ message, type, show, setShow }) => {
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (show) {
      setIsExiting(false);
      timer = setTimeout(() => {
        setIsExiting(true);
        setShow(false);
      }, 3000);
    }

    return () => clearTimeout(timer);
  }, [show, setShow]);

  const getTransformValue = (): string => {
    return isExiting ? 'translateX(100%)' : 'translateX(0)';
  };

  const getBackgroundColor = (): string => {
    return type === 'success' ? '#4CAF50' : '#D32F2F';
  };

  const snackbarStyle: CSSProperties = {
    position: 'fixed',
    bottom: '1.5vw',
    left: '1vw',
    padding: '16px',
    borderRadius: '8px',
    opacity: show ? 1 : 0,
    visibility: show || isExiting ? 'visible' : 'hidden',
    transition: 'opacity 0.3s ease-in-out, transform 0.3s ease-in-out',
    transform: getTransformValue(),
    backgroundColor: getBackgroundColor(),
    color: '#fff',
  };

  return (
    <div style={snackbarStyle}>
      <p>{message}</p>
    </div>
  );
};

export default Snackbar;
