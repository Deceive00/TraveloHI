import React, { useEffect, CSSProperties, useLayoutEffect } from 'react';

interface SnackbarProps {
  message: string;
  type: string;
  show: boolean; 
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
}

const Snackbar: React.FC<SnackbarProps> = ({ message, type, show, setShow }) => {
  if(!show) {
    return <></>;
  }
  useLayoutEffect(() => {
    let timer: NodeJS.Timeout;
    if (show) {
      timer = setTimeout(() => {
        setShow(false);
      }, 3000);
    }

    return () => clearTimeout(timer);
  }, [show, setShow]);

  const getBackgroundColor = (): string => {
    return type === 'success' ? '#4CAF50' : '#D32F2F';
  };

  const snackbarStyle: CSSProperties = {
    position: 'fixed',
    bottom: '0',
    left: '0',
    padding: '16px',
    borderRadius: '8px',
    opacity: show ? 1 : 0,
    visibility: show ? 'visible' : 'hidden',
    transition: 'opacity 0.3s ease-in-out',
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
