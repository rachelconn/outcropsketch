import React from 'react';
import { ReactReduxContextValue, useDispatch, useSelector } from 'react-redux';
import { ToolOption } from '../../../classes/toolOptions/toolOptions';
import { setToolOptionValue } from '../../../redux/actions/options';
import { RootState } from '../../../redux/reducer';
import { clamp } from '../../../utils/math';
import styles from '../ToolOptions.css';

export interface OptionSliderProps {
  option: ToolOption,
  minVal: number,
  maxVal: number,
  restrictToIntegers?: boolean,
  unit?: string,
};

const OptionSlider: React.FC<OptionSliderProps> = ({
  option, minVal, maxVal, restrictToIntegers = true, unit = '',
}) => {
  const dispatch = useDispatch();

  const value = useSelector<RootState, number>((state) => state.options.toolOptionValues[option] as number);
  const percentFilled = value / (maxVal - minVal) * 100;

  // Begin tracking mouse position on mouse down to update slider value
  const handleMouseDown = (event: React.MouseEvent<HTMLElement>) => {
    // Remember offsetLeft/width to calculate values on mouse move
    const offsetLeft = event.currentTarget.offsetLeft;
    const width = event.currentTarget.offsetWidth;

    // Function to update option value based on slider position
    const updateOption = (e: MouseEvent | React.MouseEvent) => {
      const newPosition = (e.clientX - offsetLeft) / width;
      let newValue = clamp(newPosition * (maxVal - minVal), minVal, maxVal);
      if (restrictToIntegers) newValue = Math.round(newValue);

      dispatch(setToolOptionValue(option, newValue));
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
          {option}
        </div>
        <div className={styles.sliderValueText}>
          {`${value}${unit}`}
        </div>
      </div>
    </div>
  );
};

export default OptionSlider;
