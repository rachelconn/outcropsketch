import React from 'react';
import formatKeyName from '../../../../utils/formatKeyName';
import Tooltip from '../../Tooltip/Tooltip';
import styles from './UtilityButton.css';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../redux/reducer';

export interface UtilityButtonProps {
  active?: boolean;
  color?: string;
  icon: string;
  label: string;
  sublabel?: string;
  hotkey?: string;
  onClick: ()  => any;
}

const UtilityButton: React.FC<UtilityButtonProps> = ({
  active, color, icon, hotkey, label, sublabel, onClick,
}) => {
  const enableHotkeys = useSelector<RootState, boolean>((state) => state.options.enableHotkeys);

  React.useEffect(() => {
    // If hotkeys are disabled, don't create an event listener
    if (!enableHotkeys) return;

    // React to key press if hotkey is set
    if (hotkey) {
      const handleKeyPress = (e: KeyboardEvent) => {
        if (e.key === hotkey) {
          onClick();
          e.preventDefault();
        }
      };

      window.addEventListener('keydown', handleKeyPress)

      return () => {
        window.removeEventListener('keydown', handleKeyPress)
      };
    }
  }, [onClick, enableHotkeys]);

  const containerStyle: React.CSSProperties = {
    backgroundColor: color ?? 'dimgray',
  };

  let className = styles.utilityButton;
  if (active) className += ` ${styles.utilityButtonActive}`;

  const labelText = label + (hotkey ? ` (Hotkey: ${formatKeyName(hotkey)})` : '');

  const iconSize = 'min(48px, 4vw)';
  const iconStyle = { width: iconSize, height: iconSize };

  return (
    <Tooltip label={labelText} sublabel={sublabel}>
      <div style={containerStyle} className={className} onClick={onClick}>
        <img style={iconStyle} src={icon} />
      </div>
    </Tooltip>
  );
};

export default UtilityButton;
