import * as React from 'react';
import Typography from '../Typography/Typography';
import styles from './styles.css';

const Subheader: React.FC = ({ children }) => {
  return (
    <div className={styles.subheader}>
      <Typography variant="h5">
        {children}
      </Typography>
    </div>
  );
};

export default Subheader;
