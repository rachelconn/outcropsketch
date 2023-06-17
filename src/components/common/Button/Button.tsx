import * as React from 'react';
import styles from './Button.css';

interface ButtonProps {
  type?: 'button' | 'submit' | 'reset',
  children: string,
  color?: string,
  disabled?: boolean,
  icon?: string,
  onClick?: () => any,
};

const Button: React.FC<ButtonProps> = ({
  type = 'button',
  children,
  color,
  disabled,
  icon,
  onClick,
}) => {
  // Cancel default behavior if onClick is set
  const handleClick = (e: React.MouseEvent) => {
    if (onClick) {
      e.preventDefault();
      onClick();
    }
  };
  const iconComponent = icon ? <img className={styles.icon} width={24} height={24} src={icon} /> : undefined;
  const buttonStyle: React.CSSProperties = { backgroundColor: color };

  return (
    <button
      style={buttonStyle}
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
