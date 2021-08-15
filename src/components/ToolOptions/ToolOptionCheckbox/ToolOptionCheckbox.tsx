import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ToolOption } from "../../../classes/toolOptions/toolOptions";
import { setToolOptionValue } from '../../../redux/actions/options';
import { RootState } from '../../../redux/reducer';
import OptionCheckbox from '../../common/OptionCheckbox/OptionCheckbox';

export interface ToolOptionCheckboxProps {
  option: ToolOption;
}

const ToolOptionCheckbox: React.FC<ToolOptionCheckboxProps> = ({ option }) => {
  const dispatch = useDispatch();
  const initialValue = useSelector<RootState, boolean>((state) => state.options.toolOptionValues[option]);

  const handleChange = (x: boolean) => {
    dispatch(setToolOptionValue(option, x));
  };

  return <OptionCheckbox initialValue={initialValue} label={option} onChange={handleChange} />;
};

export default ToolOptionCheckbox;
