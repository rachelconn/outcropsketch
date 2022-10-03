import * as React from 'react';
import Typography from '../Typography/Typography';
import styles from './styles.css';

const Header: React.FC = ({ children }) => {
  return (
    <div className={styles.header}>
      <Typography variant="h4">
        {children}
      </Typography>
    </div>
  );
};

export default Header;
