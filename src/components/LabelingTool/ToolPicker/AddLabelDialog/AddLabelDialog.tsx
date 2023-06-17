import paper from 'paper-jsdom-canvas';
import React from 'react';
import { usePopper } from 'react-popper';
import Typography from '../../../common/Typography/Typography';
import styles from './AddLabelDialog.css';
import InputField from '../../../common/InputField/InputField';
import ColorPicker from '../../../common/ColorPicker/ColorPicker';
import Button from '../../../common/Button/Button';
import addIcon from '../../../../icons/add.svg';

export interface AddLabelDialogOptions {
  name: string,
  color: string,
}

export interface AddLabelDialogProps {
  open: boolean,
  onClickOutside: () => any,
  onClickDone: (options: AddLabelDialogOptions) => any,
}

const AddLabelDialog: React.FC<AddLabelDialogProps> = ({ open, onClickDone, onClickOutside, children }) => {
  const [options, setOptions] = React.useState<AddLabelDialogOptions>({ name: '', color: '#0ff'})
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

  // TODO: add error handling if label already exists
  const handleAddClick = () => {
    onClickDone(options);
  };

  const dialog = dialogOpen ? (
    <div className={styles.labelDialogContainer} ref={setDialogElement} style={popperStyles.popper} {...attributes.popper}>
      <Typography variant="h5">Add Label</Typography>
      <InputField inputStyle={{ width: 120, height: 16 }} name="name" onChange={(value) => setOptions({ ...options, name: value })}>
        Name
      </InputField>
      <ColorPicker initialColor="#0ff" onChangeComplete={(color) => setOptions({ ...options, color })}>Color</ColorPicker>
      <div className={styles.addButtonContainer}>
        <Button icon={addIcon} onClick={handleAddClick} color="#273">Add</Button>
      </div>
    </div>
  ) : null;

  return (
    <>
      <div ref={setRefElement}>
        {children}
      </div>
      {dialog}
    </>
  );
};

export default AddLabelDialog;
