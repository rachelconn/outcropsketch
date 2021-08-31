import React from 'react';
import styles from './OptionCheckbox.css';
import Tooltip from '../../Tooltip/Tooltip';

export interface OptionCheckboxProps {
  initialValue: boolean;
  label: string;
  tooltipLabel?: string;
  onChange: (x: boolean) => any;
};

const OptionCheckbox: React.FC<OptionCheckboxProps> = ({
  initialValue, label, tooltipLabel, onChange,
}) => {
  const [value, setValue] = React.useState(initialValue);

  const handleClick = () => {
    setValue(!value);
    onChange(!value);
  };

  return (
    <Tooltip sublabel={tooltipLabel}>
      <div className={styles.checkboxContainer} onClick={handleClick}>
        <input type="checkbox" checked={value} className={styles.checkbox} readOnly />
        <div className={styles.checkboxText}>
          {label}
        </div>
      </div>
    </Tooltip>
  );
};

export default OptionCheckbox;
