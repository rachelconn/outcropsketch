import * as React from 'react';
import { RouteComponentProps, useNavigate } from '@reach/router';
import Article from '../common/Article';
import styles from'./styles.css';
import Button from '../common/Button/Button';

const MyCoursesPage: React.FC<RouteComponentProps> = ({ navigate }) => {
  const handleCreateCourseClick = () => {};

  // TODO: show list of your courses here once the API is complete
  return (
    <>
      <Article.Header center>My Courses</Article.Header>
      <div className={styles.rightAlign}>
        <Button onClick={handleCreateCourseClick}>Create Course</Button>
      </div>
    </>
  );
};

export default MyCoursesPage;
