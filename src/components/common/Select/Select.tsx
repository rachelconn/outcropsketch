import * as React from 'react';
import styles from '../InputField/InputField.css';

interface SelectProps {
  options: string[],
  name: string,
  children: string,
  onChange?: (value: string) => any,
};

const Select: React.FC<SelectProps> = ({
  options,
  name,
  children,
  onChange = (s) => {},
}) => {
  const optionComponents = ['', ...options].map((option) => {
    const handleClick = () => onChange(option);

    return (
      <option
        className={styles.option}
        value={option}
        onClick={handleClick}
        key={option}
      >
        {option || '—'}
      </option>
    );
  });

  return (
    <div className={styles.inputContainer}>
      <label htmlFor={name}>{`${children}: `}</label>
      <select className={`${styles.input} ${styles.select}`} name={name}>
        {optionComponents}
      </select>
    </div>
  );
};

export default Select;
