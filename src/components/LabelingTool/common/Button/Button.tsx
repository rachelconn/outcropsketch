import React from 'react';
import Typography from '../Typography/Typography';
import styles from './Button.css';

type Color = 'primary' | 'secondary';

interface ColorPalette {
  main: string;
  text: string;
}

const colors: Record<Color, ColorPalette> = {
  primary: {
    main: '#0066ff',
    text: 'white',
  },
  secondary: {
    main: 'dimgray',
    text: 'white',
  },
};

interface ButtonProps {
  color: Color;
  onClick: () => any;
}

const Button: React.FC<ButtonProps> = ({ color, onClick, children }) => {
  const { main, text } = colors[color];

  const buttonStyle: React.CSSProperties = {
    backgroundColor: main,
    color: text,
  };

  return (
    <div style={buttonStyle} className={styles.button} onClick={onClick}>
      <Typography variant="button">
        {children}
      </Typography>
    </div>
  );
};

export default Button;
