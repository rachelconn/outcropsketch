import * as React from 'react';
import { usePopper } from 'react-popper';
import Typography from '../../common/Typography/Typography';
import styles from './Tooltip.css';

export interface TooltipProps {
  label?: string;
  sublabel?: string;
}

const Tooltip: React.FC<TooltipProps> = ({ label, sublabel, children }) => {
  const [tooltipVisible, setTooltipVisible] = React.useState(false);

  const [refElement, setRefElement] = React.useState<HTMLElement>();
  const [tooltipElement, setTooltipElement] = React.useState<HTMLElement>();
  const { styles: popperStyles, attributes } = usePopper(refElement, tooltipElement);

  // Don't render tooltip if no text is set
  if (!label && !sublabel) return null;

  const tooltip = tooltipVisible ? (
    <div className={styles.tooltip} ref={setTooltipElement} style={popperStyles.popper} {...attributes.popper} >
      {label ? <Typography variant="h6">{label}</Typography> : null}
      {sublabel ? <Typography className={styles.sublabelText} variant="body2">{sublabel}</Typography> : null}
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
