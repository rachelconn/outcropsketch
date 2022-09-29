import React from 'react';
import ReactDom from 'react-dom';
import { usePopper } from 'react-popper';
import styles from './Popover.css';

export interface PopoverProps {
  anchorElement: HTMLElement;
  open: boolean;
  onClose: () => any;
}

const Popover: React.FC<PopoverProps> = ({ anchorElement, children, open, onClose }) => {
  const [refElement, setRefElement] = React.useState<HTMLElement>();
  const [popoverElement, setPopoverElement] = React.useState<HTMLElement>();
  const { styles: popperStyles, attributes } = usePopper(refElement, popoverElement);

  // Update when anchor element is changed
  React.useEffect(() => {
    setRefElement(anchorElement);
  }, [anchorElement]);

  // Detect clicks outside of popover and run onClose()
  const handleClick = (event: MouseEvent) => {
    if (event.target instanceof Element && !popoverElement?.contains(event.target)) {
      onClose();
    }
  };
  React.useEffect(() => {
    document.addEventListener('click', handleClick);
    return (() => document.removeEventListener('click', handleClick));
  }, [popoverElement]);

  // Don't render if not open
  if (!open) return null;


  // Use portal to stop interaction with items outside the popover
  return ReactDom.createPortal((
    <div className={styles.backdrop} onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}>
      <div className={styles.popover} ref={setPopoverElement} style={popperStyles.popper} {...attributes.popper}>
        {children}
      </div>
    </div>
  )
  , document.body);
};

export default Popover;
