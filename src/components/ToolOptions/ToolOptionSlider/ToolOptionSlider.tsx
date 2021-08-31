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
  tooltipLabel: string,
  unit: string,
}

const toolOptionAttributes = new Map<ToolOption, ToolOptionAttributes>([
  [ToolOption.SNAP, {
    minVal: 0,
    maxVal: 50,
    unit: 'px',
    tooltipLabel: 'Makes the cursor snap to any placed labels within the selected number of pixels.',
    restrictToIntegers: true,
  }],
  [ToolOption.ERASER_TOLERANCE, {
    minVal: 0,
    maxVal: 50,
    unit: 'px',
    tooltipLabel: 'The eraser will erase any annotations within the selected number of pixels.',
    restrictToIntegers: true,
  }],
  [ToolOption.CONTINUE_SURFACES, {
    minVal: 0,
    maxVal: 50,
    unit: 'px',
    tooltipLabel: 'Drawing a surface within the selected number of pixels of another identical label will extend the existing surface instead of creating a new one.',
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
      tooltipLabel={attributes.tooltipLabel}
      unit={attributes.unit}
      onChange={handleChange}
    />
  );
};

export default ToolOptionSlider;
