import * as React from 'react';
import { useNavigate } from '@reach/router';
import Typography from '../Typography/Typography';
import styles from './StandardPage.css';
import { isLoggedIn, logout } from '../../../utils/login';

interface PageProps {
  title: string,
  path: string,
};

const pages: PageProps[] = [
  {
    title: 'Home',
    path: '/',
  },
  {
    title: 'Labeling Tool',
    path: '/labelingtool',
  },
  {
    title: 'Get Involved',
    path: '/contribute',
  },
  {
    title: 'User Guide',
    path: '/guide',
  }
];

function navigationButtonClassName(path: string): string {
  const isCurrentPage = location.pathname === path;
  return styles.pageNavigationButton + (isCurrentPage ? ` ${styles.currentPageNavigationButton}` : '');
}

const StandardPage: React.FC = ({ children }) => {
  const navigate = useNavigate();

  // Create navigation buttons for static pages
  const pageNavigationButtons = pages.map(({ title, path }) => {
    const handleClick = () => navigate(path);

    return (
      <div className={navigationButtonClassName(path)} onClick={handleClick} key={path}>
        <Typography variant="body1">{title}</Typography>
      </div>
    );
  });

  // Create navigation button for login/logout
  const loggedIn = isLoggedIn();
  const handleLoginButtonClick = () => {
    loggedIn ? logout() : navigate('/login');
  };
  const loginButtonText = loggedIn ? 'Sign Out' : 'Sign In';
  // TODO: add icon to login button
  pageNavigationButtons.push(
    <div className={navigationButtonClassName('/login')} onClick={handleLoginButtonClick} key="login/logout">
      <Typography variant="body1">{loginButtonText}</Typography>
    </div>
  );

  // If not logged in, create a register button
  if (!loggedIn) {
    pageNavigationButtons.push(
      <div className={navigationButtonClassName('/register')} onClick={() => navigate('/register')} key="register">
        <Typography variant="body1">Register</Typography>
      </div>
    );
  }

  return (
    <div className={styles.root}>
      <div className={styles.pageContainer}>
        <Typography className={styles.title} variant="h2">Outcrop Sketch</Typography>
        <div className={styles.pageNavigationBar}>
          {pageNavigationButtons}
        </div>
        {children}
      </div>
      <div className={styles.divider} />
      <div className={styles.footerLogoContainer}>
        <img className={styles.footerLogo} src="/static/srl-logo.png" />
        <img className={styles.footerLogo} src="/static/penn-state-logo.png" />
        <img className={styles.footerLogo} src="/static/nsf-logo.png" />
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
