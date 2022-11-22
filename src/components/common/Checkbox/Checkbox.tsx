import * as React from 'react';
import styles from '../InputField/InputField.css';

interface CheckboxProps {
  children: string,
  name: string,
  onChange?: (value: boolean) => any,
};

const Checkbox: React.FC<CheckboxProps> = ({
  children,
  name,
  onChange = (s) => {},
}) => {
  return (
    <div className={styles.inputContainer}>
      <label htmlFor={name}>{`${children}:`}</label>
      <input
        className={styles.checkbox}
        type="checkbox"
        name={name}
        onChange={(e) => onChange(e.currentTarget.checked)}
      />
    </div>
  );
};

export default Checkbox;
