import * as React from 'react';
import styles from './Button.css';

interface ButtonProps {
  type?: 'button' | 'submit' | 'reset',
  children: string,
  disabled?: boolean,
  icon?: string,
  onClick?: () => any,
};

const Button: React.FC<ButtonProps> = ({
  type = 'button',
  children,
  disabled,
  icon,
  onClick,
}) => {
  // Cancel default behavior if onClick is sset
  const handleClick = (e: React.MouseEvent) => {
    if (onClick) {
      e.preventDefault();
      onClick();
    }
  };
  const iconComponent = icon ? <img className={styles.icon} width={24} height={24} src={icon} /> : undefined;

  return (
    <button
      className={styles.button}
      type={type}
      disabled={disabled}
      onClick={handleClick}
    >
      {children}
      {iconComponent}
    </button>
  );
};

export default Button;
