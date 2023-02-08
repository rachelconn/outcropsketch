import * as React from 'react';
import { RouteComponentProps } from '@reach/router';
import Article from '../common/Article';
import styles from'./styles.css';
import Button from '../common/Button/Button';
import addIcon from '../../icons/add.svg';
import pencilIcon from '../../icons/pencil.svg';

interface Roles {
  instructor: boolean,
  student: boolean,
  researcher: boolean,
}

const MyCoursesPage: React.FC<RouteComponentProps> = ({ navigate }) => {
  const [roles, setRoles] = React.useState<Roles>();

  React.useEffect(() => {
    fetch('/auth/get_roles').then((response) => response.json()).then((responseJSON) => {
      setRoles(responseJSON);
    });
  }, []);

  const handleCreateCourseClick = () => navigate('create');
  const handleUseCourseCodeClick = () => navigate('use_code');
  const createCourseButton = roles?.instructor ? <Button icon={addIcon} onClick={handleCreateCourseClick}>Create Course</Button> : undefined;
  const useCourseCodeButton = roles?.student ? <Button icon={pencilIcon} onClick={handleUseCourseCodeClick}>Use Course Code</Button> : undefined;

  // TODO: show list of your courses here once the API is complete
  return (
    <>
      <div className={styles.header}>
        <div className={styles.headerTitle}>
          <Article.Header>My Courses</Article.Header>
        </div>
        <div className={styles.courseActionButtons}>
          {createCourseButton}
          {useCourseCodeButton}
        </div>
      </div>
    </>
  );
};

export default MyCoursesPage;
