import React from 'react';
import styles from './UtilityButton.css';

export interface UtilityButtonProps {
  active?: boolean;
  color?: string;
  icon: string;
  onClick: ()  => any;
}

const UtilityButton: React.FC<UtilityButtonProps> = ({ active, color, icon, onClick }) => {

  const containerStyle: React.CSSProperties = {
    backgroundColor: color ?? 'dimgray',
  };

  let className = styles.utilityButton;
  if (active) className += ` ${styles.utilityButtonActive}`;

  return (
    <div style={containerStyle} className={className} onClick={onClick}>
      <img width={48} height={48} src={`./src/images/icons/${icon}`} />
    </div>
  );
};

export default UtilityButton;
