import * as React from 'react';
import Cookies from 'js-cookie';
import { RouteComponentProps } from '@reach/router';
import checkIcon from '../../icons/check.svg';
import Article from '../common/Article';
import styles from'./styles.css';
import Button from '../common/Button/Button';
import addIcon from '../../icons/add.svg';
import pencilIcon from '../../icons/pencil.svg';
import Dialog from '../common/Dialog/Dialog';
import InputField from '../common/InputField/InputField';
import CourseCard, { CourseCardProps } from './CourseCard';

interface Roles {
  instructor: boolean,
  student: boolean,
  researcher: boolean,
}

const MyCoursesPage: React.FC<RouteComponentProps> = ({ navigate }) => {
  const [roles, setRoles] = React.useState<Roles>();
  const [courseCode, setCourseCode] = React.useState('');
  const [useCourseCodeDialogVisible, setUseCourseCodeDialogVisible] = React.useState(false);
  const [courseList, setCourseList] = React.useState<CourseCardProps[]>([]);

  // Fetch roles and courses on first render
  React.useEffect(() => {
    fetch('/auth/get_roles').then((response) => response.json()).then((responseJSON) => setRoles(responseJSON));

    fetch('/courses/list').then((response) => response.json()).then((responseJSON) => setCourseList(responseJSON));
  }, []);

  console.log(courseList);

  const handleCreateCourseClick = () => navigate('create');
  const handleUseCourseCodeClick = () => {
    setCourseCode('');
    setUseCourseCodeDialogVisible(true);
  }
  const handleCourseCodeChange = (value: string) => setCourseCode(value);
  const createCourseButton = roles?.instructor ? <Button icon={addIcon} onClick={handleCreateCourseClick}>Create Course</Button> : undefined;
  const useCourseCodeButton = roles?.student ? <Button icon={pencilIcon} onClick={handleUseCourseCodeClick}>Use Course Code</Button> : undefined;

  const handleSubmitCodeButtonClick = () => {
    const body = JSON.stringify({ id: courseCode })
    fetch('/courses/join', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': Cookies.get('csrftoken'),
      },
      body,
    }).then((response) => {
      if (!response.ok) throw new Error(`An error occcurred trying to create a new course: ${response}`)
      // TODO: refresh course list to show added course
      setUseCourseCodeDialogVisible(false);
    }).catch((e) => {
      console.log(e);
      // TODO: show modal with error message
    });
  };

  const courseCards = courseList.map((course) => (
    <CourseCard {...course} key={course.courseCode} />
  ));

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
      <Dialog visible={useCourseCodeDialogVisible} onClickOutside={() => setUseCourseCodeDialogVisible(false)}>
        <div className={styles.dialogContent}>
          <Article.Header>Enter Course Code</Article.Header>
          <InputField name="coursecode" onChange={handleCourseCodeChange} >Course code</InputField>
          <div className={styles.submitCodeButtonContainer}>
            <Button disabled={courseCode.length < 6} icon={checkIcon} onClick={handleSubmitCodeButtonClick}>Submit</Button>
          </div>
        </div>
      </Dialog>
      <div className={styles.courseCardContainer}>
        {courseCards}
      </div>
    </>
  );
};

export default MyCoursesPage;
