import React from 'react';
import { clamp } from '../../../utils/math';
import styles from './OptionSlider.css';

export interface OptionSliderProps {
  initialValue: number,
  label: string,
  minVal: number,
  maxVal: number,
  onChange: (x: number) => any,
  restrictToIntegers?: boolean,
  unit?: string,
};

const OptionSlider: React.FC<OptionSliderProps> = ({
  initialValue, label, minVal, maxVal, restrictToIntegers = true, unit = '', onChange,
}) => {
  const [value, setValue] = React.useState(initialValue);
  const percentFilled = (value - minVal) / (maxVal - minVal) * 100;

  // Begin tracking mouse position on mouse down to update slider value
  const handleMouseDown = (event: React.MouseEvent<HTMLElement>) => {
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

  return (
    <div className={styles.sliderContainer}>
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
  );
};

export default OptionSlider;
