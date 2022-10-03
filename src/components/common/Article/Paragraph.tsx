import * as React from 'react';
import Typography from '../Typography/Typography';
import styles from './styles.css';

const Paragraph: React.FC = ({ children }) => {
  return (
    <div className={styles.paragraph}>
      <Typography variant="body1">
        {children}
      </Typography>
    </div>
  );
}

export default Paragraph;
