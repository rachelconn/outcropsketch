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
import StandardPage from '../common/StandardPage/StandardPage';

const MyCoursesPage: React.FC<RouteComponentProps> = ({ navigate }) => {
  const [roles, setRoles] = React.useState<GetRolesAPIReturnType>();
  const [courseCode, setCourseCode] = React.useState('');
  const [useCourseCodeDialogVisible, setUseCourseCodeDialogVisible] = React.useState(false);
  const [courseList, setCourseList] = React.useState<ListCoursesAPIReturnType>([]);
  const [errorResponse, setErrorResponse] = React.useState<Response>();

  const fetchRoles = () => {
    fetch('/auth/get_roles')
      .then((response) => {
        // Attempt to get roles, if it fails then treat user as having no permissions
        if (response.ok) return response.json();
        const defaultResponse: GetRolesAPIReturnType = { student: false, instructor: false, researcher: false };
        return defaultResponse;
      })
      .then((responseJSON: GetRolesAPIReturnType) => setRoles(responseJSON));
  };

  const fetchCourseList = () => {
    fetch('/courses/list')
      .then((response) => {
        if (response.ok) return response.json()
        setErrorResponse(response);
        return [];
      })
      .then((responseJSON) => setCourseList(responseJSON));
  };

  // Fetch roles and courses on first render
  React.useEffect(() => {
    fetchRoles();
    fetchCourseList();
  }, []);

  const handleCreateCourseClick = () => navigate('create');
  const handleJoinCourseClick = () => {
    setCourseCode('');
    setUseCourseCodeDialogVisible(true);
  }
  const handleCourseCodeChange = (value: string) => setCourseCode(value);
  const createCourseButton = roles?.instructor ? <Button icon={addIcon} onClick={handleCreateCourseClick}>Create Course</Button> : undefined;
  const useCourseCodeButton = roles?.student ? <Button icon={pencilIcon} onClick={handleJoinCourseClick}>Join Course</Button> : undefined;

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
      if (response.ok) {
        setUseCourseCodeDialogVisible(false);
        fetchCourseList();
      }
      else setErrorResponse(response);
    }).catch((error) => {
      console.error(error);
    });
  };

  const courseCards = courseList.map((course) => (
    <CourseCard course={course} key={course.courseCode} />
  ));

  return (
    <StandardPage>
      <Article.Header>My Courses</Article.Header>
      <div className={styles.courseActionButtons}>
        {createCourseButton}
        {useCourseCodeButton}
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
      <div className={styles.cardColumnContainer}>
        {courseCards}
      </div>
      <ErrorAlert response={errorResponse} />
    </StandardPage>
  );
};

export default MyCoursesPage;
