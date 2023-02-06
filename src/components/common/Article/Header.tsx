import * as React from 'react';
import Typography from '../Typography/Typography';
import styles from './styles.css';

export interface HeaderProps {
  center?: boolean,
}

const Header: React.FC<HeaderProps> = ({ center = false, children }) => {
  const className = center ? `${styles.header} ${styles.centeredText}`: styles.header;
  return (
    <div className={className}>
      <Typography variant="h4">
        {children}
      </Typography>
    </div>
  );
};

export default Header;
