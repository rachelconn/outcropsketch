import React from 'react';
import UtilityButton from '../UtilityButton/UtilityButton';

export interface ToggleButtonProps {
	defaultState: boolean,
	activeLabel: string,
	inactiveLabel: string,
  sublabel?: string,
  hotkey?: string,
	icon: string,
	color?: string,
	onClick: (state: boolean) => any,
}

const ToggleButton: React.FC<ToggleButtonProps> = ({
	defaultState, activeLabel, inactiveLabel, sublabel, hotkey, icon, color, onClick,
}) => {
  const [active, setActive] = React.useState(defaultState);

  React.useEffect(() => {
		onClick(active);
  }, [active]);

  const label = active ? activeLabel : inactiveLabel;

  const handleClick = () => {
    setActive(!active);
  };

  return <UtilityButton active={active} color={color} icon={icon} label={label} sublabel={sublabel} hotkey={hotkey} onClick={handleClick} />;
};

export default ToggleButton;
