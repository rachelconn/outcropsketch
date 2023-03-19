import React from 'react';
import Typography from '../../../common/Typography/Typography';
import styles from './Button.css';

type Color = 'primary' | 'secondary';

interface ColorPalette {
  main: string;
  text: string;
}

const colors: Record<Color, ColorPalette> = {
  primary: {
    main: '#0060df',
    text: 'white',
  },
  secondary: {
    main: 'dimgray',
    text: 'white',
  },
};

interface ButtonProps {
  color: Color;
  icon?: string;
  onClick: () => any;
}

const Button: React.FC<ButtonProps> = ({ color, icon, onClick, children }) => {
  const { main, text } = colors[color];

  const buttonStyle: React.CSSProperties = {
    backgroundColor: main,
    color: text,
  };

  const iconComponent = icon ? <img className={styles.icon} width={24} height={24} src={icon} /> : undefined;

  return (
    <div style={buttonStyle} className={styles.button} onClick={onClick}>
      <Typography variant="button">
        {children}
      </Typography>
      {iconComponent}
    </div>
  );
};

export default Button;
