import * as React from 'react';
import Typography from '../Typography/Typography';
import styles from './InputField.css';

interface InputFieldProps {
  name: string,
  children: string,
  inputStyle?: React.CSSProperties,
  type?: 'text' | 'email' | 'password' | 'textarea',
  onChange?: (value: string) => any,
};

const InputField: React.FC<InputFieldProps> = ({
  name,
  children,
  inputStyle,
  type = 'text',
  onChange = (s) => {},
}) => {
  const inputComponent = (type === 'textarea') ? (
    <textarea className={`${styles.input} ${styles.textarea}`} name={name} onChange={(e) => onChange(e.target.value)} />
  ) : (
    <input style={inputStyle} className={styles.input} type={type} name={name} onChange={(e) => onChange(e.target.value)} />
  );

  return (
    <div className={styles.inputContainer}>
      <Typography variant="h6">
        <label htmlFor={name}>{`${children}:`}</label>
      </Typography>
      {inputComponent}
    </div>
  );
};

export default InputField;
