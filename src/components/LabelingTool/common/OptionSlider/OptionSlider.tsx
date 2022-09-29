import React from 'react';
import checkboxStyles from '../OptionCheckbox/OptionCheckbox.css';
import styles from './OptionSlider.css';
import Tooltip from '../../Tooltip/Tooltip';
import { clamp } from '../../../../utils/math';

export interface OptionSliderProps {
  initialValue: number,
  label: string,
  minVal: number,
  maxVal: number,
  onChange: (x: number) => any,
  restrictToIntegers?: boolean,
  tooltipLabel: string,
  unit?: string,
};

const OptionSlider: React.FC<OptionSliderProps> = ({
  initialValue, label, minVal, maxVal, restrictToIntegers = true, tooltipLabel, unit = '', onChange,
}) => {
  const [value, setValue] = React.useState(initialValue);
  // checked: whether to use the value or override with minVal until checked again
  // TODO: seems intuitive that you would usually want to use minVal when unchecked, but might have to add uncheckedVal prop instead depending on how this is used in the future
  const [checked, setChecked] = React.useState(true);
  const percentFilled = (value - minVal) / (maxVal - minVal) * 100;

  // Begin tracking mouse position on mouse down to update slider value
  const handleMouseDown = (event: React.MouseEvent<HTMLElement>) => {
    // Ignore all buttons except left mouse
    if (event.button !== 0) return;

    // Remember offsetLeft/width to calculate values on mouse move
    const offsetLeft = event.currentTarget.offsetLeft;
    const width = event.currentTarget.offsetWidth;

    // Function to update option value based on slider position
    const updateOption = (e: MouseEvent | React.MouseEvent) => {
      const newPosition = (e.clientX - offsetLeft) / width;
      let newValue = clamp(newPosition * (maxVal - minVal) + minVal, minVal, maxVal);
      if (restrictToIntegers) newValue = Math.round(newValue);

      // Update value
      onChange(newValue);
      setValue(newValue);
    };

    updateOption(event);

    // Update value on mouse move
    window.addEventListener('mousemove', updateOption);

    // Stop updating on mouse up
    window.addEventListener('mouseup', () => {
      removeEventListener('mousemove', updateOption);
    }, { once: true });
  };

  const toggleChecked = () => {
    // Update checkbox state
    const newChecked = !checked;
    setChecked(newChecked);
    // Call onChange with the correct value
    if (newChecked) onChange(value);
    else onChange(minVal);
  };

  return (
    <Tooltip sublabel={tooltipLabel}>
      <div className={styles.sliderContainer}>
        <input type="checkbox" checked={checked} className={checkboxStyles.checkbox} readOnly onClick={toggleChecked} />
        <div className={styles.slider} onMouseDown={handleMouseDown}>
          <div className={styles.sliderValue} style={{ width: `${percentFilled}%`}} />
          <div className={styles.sliderText}>
            {label}
          </div>
          <div className={styles.sliderValueText}>
            {`${value}${unit}`}
          </div>
        </div>
      </div>
    </Tooltip>
  );
};

export default OptionSlider;
