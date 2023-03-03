import { RouteComponentProps, useParams } from '@reach/router';
import React from 'react';
import Article from '../common/Article';
import { GetCourseInfoAPIReturnType } from '../../classes/API/APIClasses';
import ErrorAlert from '../common/ErrorAlert/ErrorAlert';

const ManageCoursePage: React.FC<RouteComponentProps> = () => {
  const [courseInfo, setCourseInfo] = React.useState<GetCourseInfoAPIReturnType>();
  const [errorResponse, setErrorResponse] = React.useState<Response>();
  const params = useParams();

  React.useEffect(() => {
    fetch(`/courses/get/${params.courseId}`)
      .then((response) => {
        if (response.ok) return response.json();
        else {
          setErrorResponse(response);
          return [];
        }
      })
      .then((responseJSON) => setCourseInfo(responseJSON));
  }, []);

  // Don't render until course info has been fetched
  if (!courseInfo) return null;

  return (
    <>
      <Article.Header>{`Manage ${courseInfo.title}`}</Article.Header>
      <ErrorAlert response={errorResponse} />
    </>
  );
};

export default ManageCoursePage;
