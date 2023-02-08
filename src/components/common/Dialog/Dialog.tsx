import React from 'react';
import { createPortal } from 'react-dom';
import styles from './Dialog.css';

interface DialogProps {
  visible: boolean,
  onClickOutside: () => any,
}

const Dialog: React.FC<DialogProps> = ({ children, visible, onClickOutside }) => {
  const backgroundComponent = React.useRef<HTMLDivElement>();
  const backgroundClassName = React.useMemo(() => (
    visible ? styles.dialogBackground : `${styles.dialogBackground} ${styles.dialogHidden}`
  ), [visible])

  const handleBackgroundClick = (e: React.MouseEvent) => {
    if (e.target !== backgroundComponent.current) return;
    onClickOutside();
  };

  return (
    <>
      {
        createPortal((
          <div className={backgroundClassName} onClick={handleBackgroundClick} ref={backgroundComponent}>
            <div className={styles.paper}>
              {children}
            </div>
          </div>
        ), document.getElementById('root'))
      }
    </>
  );
};

export default Dialog;
