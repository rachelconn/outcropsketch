import paper from 'paper';
import React from 'react';
import { useDispatch } from 'react-redux';
import { NonLabelType } from '../../../classes/layers/layers';
import visibilityIcon from '../../../images/icons/visibility.svg';
import visibilityOffIcon from '../../../images/icons/visibility_off.svg';
import { setLabelsVisible } from '../../../redux/actions/image';
import UtilityButton from '../UtilityButton/UtilityButton';

export interface ToggleButtonProps {
	defaultState: boolean,
	activeLabel: string,
	inactiveLabel: string,
	icon: string,
	color?: string,
	onClick: (state: boolean) => any,
}

const ToggleButton: React.FC<ToggleButtonProps> = ({
	defaultState, activeLabel, inactiveLabel, icon, color, onClick,
}) => {
  const [active, setActive] = React.useState(defaultState);

  React.useEffect(() => {
		onClick(active);
  }, [active]);

  const label = active ? activeLabel : inactiveLabel;

  const handleClick = () => {
    setActive(!active);
  };

  return <UtilityButton active={active} color={color} icon={icon} label={label} onClick={handleClick} />;
};

export default ToggleButton;
