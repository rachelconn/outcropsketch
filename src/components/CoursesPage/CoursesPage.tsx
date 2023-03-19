import * as React from 'react';
import { RouteComponentProps, Router } from '@reach/router';

// Empty wrapper page to clean up routing
const CoursesPage: React.FC<RouteComponentProps> = ({ children }) => {
  return (
    <>
      {children}
    </>
  );
};

export default CoursesPage;
