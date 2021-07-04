import React from 'react';
import { useSelector } from 'react-redux';
import { ToolOption } from '../../classes/toolOptions/toolOptions';
import { RootState } from '../../redux/reducer';
import styles from './ToolOptions.css'
import OptionSlider from './OptionSlider/OptionSlider';
import OptionCheckbox from './OptionCheckbox/OptionCheckbox';

const toolOptionComponents: Record<ToolOption, JSX.Element> = {
  [ToolOption.SNAP]: <OptionSlider option={ToolOption.SNAP} minVal={0} maxVal={50} unit="px" />,
  [ToolOption.OVERWRITE]: <OptionCheckbox option={ToolOption.OVERWRITE} />,
};

const ToolOptions: React.FC = () => {
  const toolOptions = useSelector<RootState, ToolOption[]>((state) => state.options.toolOptions);

  // Render nothing if no options are available
  if (!toolOptions.length) return null;

  const availableOptions = toolOptions.map((option) => (
    <div className={styles.optionContainer} key={option}>
      {toolOptionComponents[option]}
    </div>
  ));

  return (
    <div className={styles.optionsContainer}>
      <div className={styles.optionsText}>Tool Options</div>
      <div className={styles.optionsContainer}>
        {availableOptions}
      </div>
    </div>
  );
};

export default ToolOptions;
