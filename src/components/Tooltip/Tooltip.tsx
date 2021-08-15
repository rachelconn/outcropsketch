import * as React from 'react';
import { usePopper } from 'react-popper';
import Typography from '../common/Typography/Typography';
import styles from './Tooltip.css';

export interface TooltipProps {
  label: string;
}

const Tooltip: React.FC<TooltipProps> = ({ label, children }) => {
  const [tooltipVisible, setTooltipVisible] = React.useState(false);

  const [refElement, setRefElement] = React.useState<HTMLElement>();
  const [tooltipElement, setTooltipElement] = React.useState<HTMLElement>();
  const { styles: popperStyles, attributes } = usePopper(refElement, tooltipElement);

  const tooltip = tooltipVisible ? (
    <div className={styles.tooltip} ref={setTooltipElement} style={popperStyles.popper} {...attributes.popper} >
      <Typography variant="body1">
        {label}
      </Typography>
    </div>
  ) : null;

  return (
    <>
      <div
        className={styles.tooltipContainer}
        onMouseEnter={() => setTooltipVisible(true)}
        onMouseLeave={() => setTooltipVisible(false)}
        ref={setRefElement}
      >
        {children}
      </div>
      {tooltip}
    </>
  );
};

export default Tooltip;
