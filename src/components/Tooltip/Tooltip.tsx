import * as React from 'react';
import styles from './Tooltip.css';

export interface TooltipProps {
  label: string;
}

const Tooltip: React.FC<TooltipProps> = ({ label, children }) => {
  const [tooltipVisible, setTooltipVisible] = React.useState(false);
  const tooltip = tooltipVisible ? (
  <div className={styles.tooltip}>
    {label}
  </div>
  ) : null;

  return (
    <div
      className={styles.tooltipContainer}
      onMouseEnter={() => setTooltipVisible(true)}
      onMouseLeave={() => setTooltipVisible(false)}
    >
      {children}
      {tooltip}
    </div>
  );
};

export default Tooltip;
