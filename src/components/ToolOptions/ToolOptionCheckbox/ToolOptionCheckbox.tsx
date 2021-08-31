import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ToolOption } from "../../../classes/toolOptions/toolOptions";
import { setToolOptionValue } from '../../../redux/actions/options';
import { RootState } from '../../../redux/reducer';
import OptionCheckbox from '../../common/OptionCheckbox/OptionCheckbox';

export interface ToolOptionCheckboxProps {
  option: ToolOption;
}

const optionLabels = new Map<ToolOption, string>([
  [ToolOption.SNAP_SAME_LABEL, 'Whether or not to enable snapping to identical labels.'],
  [ToolOption.MERGE_SAME_LABEL, 'If selected, newly drawn labels will merge with identical labels. Otherwise, they will be drawn as separate shapes.'],
  [ToolOption.OVERWRITE, "If selected, newly drawn labels should be drawn over existing ones. Otherwise, only label areas that don't already have labels."],
]);

const ToolOptionCheckbox: React.FC<ToolOptionCheckboxProps> = ({ option }) => {
  const dispatch = useDispatch();
  const initialValue = useSelector<RootState, boolean>((state) => state.options.toolOptionValues[option]);

  const handleChange = (x: boolean) => {
    dispatch(setToolOptionValue(option, x));
  };

  const tooltipLabel = optionLabels.get(option);
  if (!tooltipLabel) throw new Error(`Tool option ${option} cannot be used with a checkbox.`);

  return <OptionCheckbox initialValue={initialValue} label={option} tooltipLabel={tooltipLabel} onChange={handleChange} />;
};

export default ToolOptionCheckbox;
