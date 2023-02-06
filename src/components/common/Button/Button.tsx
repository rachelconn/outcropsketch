import * as React from 'react';
import styles from './Button.css';

interface ButtonProps {
  type?: string,
  children: string,
  disabled?: boolean,
  onClick?: () => any,
};

const Button: React.FC<ButtonProps> = ({
  type = 'submit',
  children,
  disabled,
  onClick,
}) => {
  // Cancel default behavior if onClick is sset
  const handleClick = (e: React.MouseEvent) => {
    if (onClick) {
      e.preventDefault();
      onClick();
    }
  };

  return (
    <input
      className={styles.button}
      type={type}
      value={children}
      disabled={disabled}
      onClick={handleClick}
    />
  );
};

export default Button;
