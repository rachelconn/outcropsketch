import React from 'react';
import { usePopper } from 'react-popper';
import Typography from '../Typography/Typography';
import styles from './Dropdown.css';

export interface DropdownEntry {
  name: string,
  icon?: string,
  onClick: () => any,
}

export interface DropdownProps {
  className?: string,
  open: boolean,
  onClickOutside: () => any,
  entries: DropdownEntry[],
}

const Dropdown: React.FC<DropdownProps> = ({ open, onClickOutside, entries, children, className }) => {
  const [dialogOpen, setDialogOpen] = React.useState(open);
  const [refElement, setRefElement] = React.useState<HTMLDivElement>();
  const [dialogElement, setDialogElement] = React.useState<HTMLDivElement>();
  const { styles: popperStyles, attributes } = usePopper(refElement, dialogElement, {
    modifiers: [{ name: 'offset', options: { offset: [0, -10] } }]
  });

  // Detect clicks outside of dialog to trigger onClickOutside
  React.useEffect(() => {
    if (!dialogElement) return;

    const handleClick = (e: MouseEvent) => {
      if (!dialogElement.contains(e.target as Node)) onClickOutside();
    };
    window.addEventListener('mousedown', handleClick);

    return () => window.removeEventListener('mousedown', handleClick);
  }, [dialogElement]);

  // Keep state updated based on open prop
  React.useEffect(() => {
    setDialogOpen(open);
  }, [open]);

  const entryComponents = entries.map((entry) => {
    const icon = entry.icon ? (
      <div className={styles.dropdownEntryIconContainer}>
        <img className={styles.dropdownEntryIcon} width={24} height={24} src={entry.icon} />
      </div>
    ) : null;

    return (
      <div className={styles.dropdownEntry} onClick={entry.onClick} key={entry.name}>
        {icon}
        <Typography variant="body1">{entry.name}</Typography>
      </div>
    );
  });

  const dialog = dialogOpen ? (
    <div className={styles.dialogContainer} ref={setDialogElement} style={popperStyles.popper} {...attributes.popper}>
      {entryComponents}
    </div>
  ) : null;

  return (
    <>
      <div className={className} ref={setRefElement}>
        {children}
      </div>
      {dialog}
    </>
  );
};

export default Dropdown;
