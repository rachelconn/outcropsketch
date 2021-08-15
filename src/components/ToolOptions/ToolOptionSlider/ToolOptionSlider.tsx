import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ToolOption } from '../../../classes/toolOptions/toolOptions';
import { setToolOptionValue } from '../../../redux/actions/options';
import { RootState } from '../../../redux/reducer';
import OptionSlider from '../../common/OptionSlider/OptionSlider';

export interface ToolOptionAttributes {
  minVal: number,
  maxVal: number,
  restrictToIntegers: boolean,
  unit: string,
}

const toolOptionAttributes = new Map<ToolOption, ToolOptionAttributes>([
  [ToolOption.SNAP, {
    minVal: 0,
    maxVal: 50,
    unit: 'px',
    restrictToIntegers: true,
  }],
  [ToolOption.ERASER_TOLERANCE, {
    minVal: 0,
    maxVal: 50,
    unit: 'px',
    restrictToIntegers: true,
  }],
  [ToolOption.CONTINUE_SURFACES, {
    minVal: 0,
    maxVal: 50,
    unit: 'px',
    restrictToIntegers: true,
  }],
]);

export interface ToolOptionSliderProps {
  option: ToolOption,
}

const ToolOptionSlider: React.FC<ToolOptionSliderProps> = ({
  option,
}) => {
  const initialValue = useSelector<RootState, number>((state) => state.options.toolOptionValues[option] as number);
  const dispatch = useDispatch();

  // Fetch appropriate attributes for option and check it's valid
  const attributes = toolOptionAttributes.get(option);
  if (!attributes) throw new Error(`${option} is not a ToolOption with an adjustable value.`);

  const handleChange = (x: number) => {
    dispatch(setToolOptionValue(option, x));
  };

  return (
    <OptionSlider
      label={option}
      initialValue={initialValue}
      minVal={attributes.minVal}
      maxVal={attributes.maxVal}
      restrictToIntegers={attributes.restrictToIntegers}
      unit={attributes.unit}
      onChange={handleChange}
    />
  );
};

export default ToolOptionSlider;
