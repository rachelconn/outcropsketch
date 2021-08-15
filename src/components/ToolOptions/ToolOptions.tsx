import React from 'react';
import { useSelector } from 'react-redux';
import { ToolOption } from '../../classes/toolOptions/toolOptions';
import { RootState } from '../../redux/reducer';
import styles from './ToolOptions.css'
import ToolOptionCheckbox from './ToolOptionCheckbox/ToolOptionCheckbox';
import ToolOptionSlider from './ToolOptionSlider/ToolOptionSlider';

const toolOptionComponents: Record<ToolOption, JSX.Element> = {
  [ToolOption.SNAP]: <ToolOptionSlider option={ToolOption.SNAP} />,
  [ToolOption.SNAP_SAME_LABEL]: <ToolOptionCheckbox option={ToolOption.SNAP_SAME_LABEL} />,
  [ToolOption.OVERWRITE]: <ToolOptionCheckbox option={ToolOption.OVERWRITE} />,
  [ToolOption.MERGE_SAME_LABEL]: <ToolOptionCheckbox option={ToolOption.MERGE_SAME_LABEL} />,
  [ToolOption.ERASER_TOLERANCE]: <ToolOptionSlider option={ToolOption.ERASER_TOLERANCE} />,
  [ToolOption.CONTINUE_SURFACES]: <ToolOptionSlider option={ToolOption.CONTINUE_SURFACES} />,
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
      {availableOptions}
    </div>
  );
};

export default ToolOptions;
