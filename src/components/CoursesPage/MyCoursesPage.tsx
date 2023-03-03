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
import CourseCard from './CourseCard';
import { GetRolesAPIReturnType, ListCoursesAPIReturnType } from '../../classes/API/APIClasses';
import ErrorAlert from '../common/ErrorAlert/ErrorAlert';

const MyCoursesPage: React.FC<RouteComponentProps> = ({ navigate }) => {
  const [roles, setRoles] = React.useState<GetRolesAPIReturnType>();
  const [courseCode, setCourseCode] = React.useState('');
  const [useCourseCodeDialogVisible, setUseCourseCodeDialogVisible] = React.useState(false);
  const [courseList, setCourseList] = React.useState<ListCoursesAPIReturnType>([]);
  const [errorResponse, setErrorResponse] = React.useState<Response>();

  // Fetch roles and courses on first render
  React.useEffect(() => {
    fetch('/auth/get_roles')
      .then((response) => {
        // Attempt to get roles, if it fails then treat user as having no permissions
        if (response.ok) return response.json();
        const defaultResponse: GetRolesAPIReturnType = { student: false, instructor: false, researcher: false };
        return defaultResponse;
      })
      .then((responseJSON: GetRolesAPIReturnType) => setRoles(responseJSON));

    fetch('/courses/list')
      .then((response) => {
        if (response.ok) return response.json()
        setErrorResponse(response);
        return [];
      })
      .then((responseJSON) => setCourseList(responseJSON));
  }, []);

  const handleCreateCourseClick = () => navigate('create');
  const handleUseCourseCodeClick = () => {
    setCourseCode('');
    setUseCourseCodeDialogVisible(true);
  }
  const handleCourseCodeChange = (value: string) => setCourseCode(value);
  const createCourseButton = roles?.instructor ? <Button icon={addIcon} onClick={handleCreateCourseClick}>Create Course</Button> : undefined;
  const useCourseCodeButton = roles?.student ? <Button icon={pencilIcon} onClick={handleUseCourseCodeClick}>Use Course Code</Button> : undefined;

  const handleAddCourseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const body = JSON.stringify({ id: courseCode })
    fetch('/courses/join', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': Cookies.get('csrftoken'),
      },
      body,
    }).then((response) => {
      if (response.ok) setUseCourseCodeDialogVisible(false);
      else setErrorResponse(response);
      // TODO: refresh course list to show added course
    }).catch((error) => {
      console.error(error);
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
        <form className={styles.dialogContent} onSubmit={handleAddCourseSubmit}>
          <Article.Header>Enter Course Code</Article.Header>
          <InputField name="coursecode" onChange={handleCourseCodeChange} >Course code</InputField>
          <div className={styles.submitCodeButtonContainer}>
            <Button type="submit" disabled={courseCode.length < 6} icon={checkIcon}>Submit</Button>
          </div>
        </form>
      </Dialog>
      <div className={styles.courseCardContainer}>
        {courseCards}
      </div>
      <ErrorAlert response={errorResponse} />
    </>
  );
};

export default MyCoursesPage;
