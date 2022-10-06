import * as React from 'react';
import styles from './styles.css';

const List: React.FC = ({ children }) => {
  return (
    <ul className={styles.listContainer}>
      {children}
    </ul>
  );
};

export default List;
