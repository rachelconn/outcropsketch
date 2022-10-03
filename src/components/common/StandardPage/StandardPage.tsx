import * as React from 'react';
import Typography from '../Typography/Typography';
import styles from './StandardPage.css';
import SRLLogo from '../../../images/srl-logo.png';
import PennStateLogo from '../../../images/penn-state-logo.png';
import NSFLogo from '../../../images/nsf-logo.png';

/*
TODO:
- tabs for each page
- footer with information about us
*/

const StandardPage: React.FC = ({ children }) => {
  return (
    <div className={styles.root}>
      <div className={styles.pageContainer}>
        <Typography className={styles.title} variant="h2">Outcrop Sketch</Typography>
        {children}
      </div>
      <div className={styles.divider} />
      <div className={styles.footerLogoContainer}>
        <img className={styles.footerLogo} src={SRLLogo} />
        <img className={styles.footerLogo} src={PennStateLogo} />
        <img className={styles.footerLogo} src={NSFLogo} />
      </div>
      <div className={styles.disclaimer}>
        <Typography variant="subtitle">
          This project is a joint effort between Texas A&amp;M University and Pennsylvania State University.
          This material is based upon work supported by the National Science Foundation under Grant No. 1948660.
          Any opinions, findings, and conclusions or recommendations expressed in this material are those of the author(s) and do not necessarily reflect the views of the National Science Foundation.
        </Typography>
      </div>
    </div>
  );
};

export default StandardPage;
