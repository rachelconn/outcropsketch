import * as React from 'react';
import { RouteComponentProps, Router } from '@reach/router';
import StandardPage from '../common/StandardPage/StandardPage';

const CoursesPage: React.FC<RouteComponentProps> = ({ children }) => {
  return (
    <StandardPage>
      {children}
    </StandardPage>
  );
};

export default CoursesPage;
