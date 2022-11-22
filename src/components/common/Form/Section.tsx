import * as React from 'react';
import styles from './styles.css';

const Section: React.FC = ({ children }) => {
  return (
    <div className={styles.formSectionContainer}>
      {children}
    </div>
  );
};

export default Section;
