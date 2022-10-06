import * as React from 'react';
import Typography from '../Typography/Typography';
import styles from './styles.css';

const ListItem: React.FC = ({ children }) => {
  return (
    <li className={styles.listItem}>
      <Typography variant="body1">
        {children}
      </Typography>
    </li>
  );
};

export default ListItem;
