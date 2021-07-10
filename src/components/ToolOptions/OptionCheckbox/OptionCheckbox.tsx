import React from 'react';
import { ReactReduxContextValue, useDispatch, useSelector } from 'react-redux';
import { ToolOption } from '../../../classes/toolOptions/toolOptions';
import { setToolOptionValue } from '../../../redux/actions/options';
import { RootState } from '../../../redux/reducer';
import styles from '../ToolOptions.css';

export interface OptionCheckboxProps {
  option: ToolOption,
};

const OptionCheckbox: React.FC<OptionCheckboxProps> = ({
  option,
}) => {
  const dispatch = useDispatch();
  const state = useSelector<RootState, boolean>((state) => state.options.toolOptionValues[option]);

  const handleClick = () => {
    dispatch(setToolOptionValue(option, !state));
  };

  return (
    <div className={styles.checkboxContainer} onClick={handleClick}>
      <input type="checkbox" checked={state} className={styles.checkbox} readOnly />
      <div className={styles.checkboxText}>
        {option}
      </div>
    </div>
  );
};

export default OptionCheckbox;
