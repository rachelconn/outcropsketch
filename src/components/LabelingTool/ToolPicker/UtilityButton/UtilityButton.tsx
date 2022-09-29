import React from 'react';
import formatKeyName from '../../../../utils/formatKeyName';
import Tooltip from '../../Tooltip/Tooltip';
import styles from './UtilityButton.css';

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
  React.useEffect(() => {
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
  }, [onClick]);

  const containerStyle: React.CSSProperties = {
    backgroundColor: color ?? 'dimgray',
  };

  let className = styles.utilityButton;
  if (active) className += ` ${styles.utilityButtonActive}`;

  const labelText = label + (hotkey ? ` (Hotkey: ${formatKeyName(hotkey)})` : '');

  return (
    <Tooltip label={labelText} sublabel={sublabel}>
      <div style={containerStyle} className={className} onClick={onClick}>
        <img width={48} height={48} src={icon} />
      </div>
    </Tooltip>
  );
};

export default UtilityButton;
