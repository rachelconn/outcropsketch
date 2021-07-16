import React from 'react';
import formatKeyName from '../../../utils/formatKeyName';
import Tooltip from '../../Tooltip/Tooltip';
import styles from './UtilityButton.css';

export interface UtilityButtonProps {
  active?: boolean;
  color?: string;
  icon: string;
  label: string;
  hotkey?: string;
  onClick: ()  => any;
}

const UtilityButton: React.FC<UtilityButtonProps> = ({
  active, color, icon, hotkey, label, onClick,
}) => {
  React.useEffect(() => {
    // React to key press if hotkey is set
    if (hotkey) {
      const handleKeyPress = (e: KeyboardEvent) => {
        if (e.key === hotkey) onClick();
      };

      window.addEventListener('keydown', handleKeyPress)

      return () => {
        window.removeEventListener('keydown', handleKeyPress)
      };
    }
  }, []);

  const containerStyle: React.CSSProperties = {
    backgroundColor: color ?? 'dimgray',
  };

  let className = styles.utilityButton;
  if (active) className += ` ${styles.utilityButtonActive}`;

  const labelText = label + (hotkey ? ` (Hotkey: ${formatKeyName(hotkey)})` : '');

  return (
    <Tooltip label={labelText}>
      <div style={containerStyle} className={className} onClick={onClick}>
        <img width={48} height={48} src={icon} />
      </div>
    </Tooltip>
  );
};

export default UtilityButton;
