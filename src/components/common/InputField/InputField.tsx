import * as React from 'react';
import styles from './InputField.css';

interface InputFieldProps {
  name: string,
  children: string,
  type?: 'text' | 'email' | 'password' | 'textarea',
  onChange?: (value: string) => any,
};

const InputField: React.FC<InputFieldProps> = ({
  name,
  children,
  type = 'text',
  onChange = (s) => {},
}) => {
  const inputComponent = (type === 'textarea') ? (
    <textarea className={`${styles.input} ${styles.textarea}`} name={name} onChange={(e) => onChange(e.target.value)} />
  ) : (
    <input className={styles.input} type={type} name={name} onChange={(e) => onChange(e.target.value)} />
  );

  return (
    <div className={styles.inputContainer}>
      <label htmlFor={name}>{`${children}:`}</label>
      {inputComponent}
    </div>
  );
};

export default InputField;
