import React from 'react';
import { ChromePicker, ColorResult } from 'react-color';
import Typography from '../Typography/Typography';
import styles from './ColorPicker.css';
import { usePopper } from 'react-popper';

interface ColorPickerProps {
  children: string,
  initialColor: string,
  onChangeComplete: (color: string) => any,
}

const ColorPicker: React.FC<ColorPickerProps> = ({ children, initialColor, onChangeComplete }) => {
  const [color, setColor] = React.useState(initialColor);
  const [open, setOpen] = React.useState(false);
  const [colorBoxElement, setColorBoxElement] = React.useState<HTMLDivElement>();
  const [popperElement, setPopperElement] = React.useState<HTMLDivElement>();
  const { styles: popperStyles, attributes } = usePopper(colorBoxElement, popperElement, {
    placement: 'right',
    modifiers: [{ name: 'flip', options: { fallbackPlacements: [] } }],
  });

  const handleChange = (newColor: ColorResult) => {
    setColor(newColor.hex);
  };

  const handleChangeComplete = (newColor: ColorResult) => {
    onChangeComplete(newColor.hex);
  };

  const colorPicker = open ? (
    <div className={styles.popper} ref={setPopperElement} style={popperStyles.popper} {...attributes.popper}>
      <ChromePicker color={color} onChange={handleChange} onChangeComplete={handleChangeComplete} disableAlpha />
    </div>
  ) : null;

  const handleColorBoxClick = () => setOpen(!open);

  return (
    <>
      <div className={styles.container}>
        <Typography variant="h6">
          {`${children}:`}
        </Typography>
        <div style={{ backgroundColor: color }} className={styles.colorBox} ref={setColorBoxElement} onClick={handleColorBoxClick} />
        {colorPicker}
      </div>
    </>
  );
};

export default ColorPicker;
