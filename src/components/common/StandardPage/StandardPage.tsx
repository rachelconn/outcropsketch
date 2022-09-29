import * as React from 'react';
import Typography from '../Typography/Typography';
import styles from './StandardPage.css';

type StandardPageProps = React.PropsWithChildren<{
  title?: string;
}>;

/*
TODO:
- tabs for each page
- footer with information about us
*/

const StandardPage: React.FC<StandardPageProps> = ({ title, children }) => {
  return (
    <div className={styles.root}>
      <div className={styles.pageContainer}>
        <Typography variant="h2">Outcrop Sketch</Typography>
        {children}
      </div>
    </div>
  );
};

export default StandardPage;
