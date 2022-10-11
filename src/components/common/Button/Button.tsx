import * as React from 'react';
import styles from './Button.css';

interface ButtonProps {
  type: string,
  children: string,
  disabled?: boolean,
};

const Button: React.FC<ButtonProps> = ({
  type,
  children,
  disabled,
}) => {
  return (
    <input
      className={styles.button}
      type={type}
      value={children}
      disabled={disabled}
    />
  );
};

export default Button;
