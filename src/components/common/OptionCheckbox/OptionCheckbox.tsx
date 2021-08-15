import React from 'react';
import styles from './OptionCheckbox.css';

export interface OptionCheckboxProps {
  initialValue: boolean;
  label: string;
  onChange: (x: boolean) => any;
};

const OptionCheckbox: React.FC<OptionCheckboxProps> = ({
  initialValue, label, onChange,
}) => {
  const [value, setValue] = React.useState(initialValue);

  const handleClick = () => {
    setValue(!value);
    onChange(!value);
  };

  return (
    <div className={styles.checkboxContainer} onClick={handleClick}>
      <input type="checkbox" checked={value} className={styles.checkbox} readOnly />
      <div className={styles.checkboxText}>
        {label}
      </div>
    </div>
  );
};

export default OptionCheckbox;
