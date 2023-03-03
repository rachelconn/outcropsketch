import * as React from 'react';
import { useNavigate } from '@reach/router';
import Typography from '../Typography/Typography';
import styles from './StandardPage.css';
import { isLoggedIn, logout } from '../../../utils/login';
import ErrorAlert from '../ErrorAlert/ErrorAlert';

interface PageProps {
  title: string,
  path: string,
  requiredLoginStatus?: boolean,
  onClickOverride?: () => Promise<Response> | undefined,
};

const pages: PageProps[] = [
  {
    title: 'Home',
    path: '/',
  },
  {
    title: 'Courses',
    path: '/mycourses',
    requiredLoginStatus: true,
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
  },
  {
    title: 'Sign In',
    path: '/login',
    requiredLoginStatus: false,
  },
  {
    title: 'Register',
    path: '/register',
    requiredLoginStatus: false,
  },
  {
    title: 'Sign Out',
    path: '/login',
    requiredLoginStatus: true,
    onClickOverride: logout,
  },
];

function navigationButtonClassName(path: string): string {
  const isCurrentPage = location.pathname === path;
  return styles.pageNavigationButton + (isCurrentPage ? ` ${styles.currentPageNavigationButton}` : '');
}

const StandardPage: React.FC = ({ children }) => {
  const navigate = useNavigate();
  const [errorResponse, setErrorResponse] = React.useState<Response>();

  // Create navigation buttons for static pages
  const pageNavigationButtons: JSX.Element[] = [];
  const loggedIn = isLoggedIn();
  pages.forEach(({ title, path, requiredLoginStatus, onClickOverride}) => {
    if (requiredLoginStatus !== undefined && loggedIn !== requiredLoginStatus) return;

    let handleClick = () => navigate(path);
    if (onClickOverride) {
      handleClick = () => onClickOverride()?.then?.((response) => {
        if (!response.ok) setErrorResponse(response);
      });
    }
    pageNavigationButtons.push(
      <div className={navigationButtonClassName(path)} onClick={handleClick} key={path}>
        <Typography variant="body1">{title}</Typography>
      </div>
    );
  });

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
      <ErrorAlert response={errorResponse} />
    </div>
  );
};

export default StandardPage;
