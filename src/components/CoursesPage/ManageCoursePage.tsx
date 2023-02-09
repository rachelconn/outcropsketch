import { RouteComponentProps, useParams } from '@reach/router';
import React from 'react';
import Article from '../common/Article';
import { GetCourseInfoAPIReturnType } from '../../classes/API/APIClasses';

const ManageCoursePage: React.FC<RouteComponentProps> = () => {
  const [courseInfo, setCourseInfo] = React.useState<GetCourseInfoAPIReturnType>();
  const params = useParams();

  React.useEffect(() => {
    fetch(`/courses/get/${params.courseId}`)
      .then((response) => response.json())
      .then((responseJSON) => setCourseInfo(responseJSON));
  }, []);

  // Don't render until course info has been fetched
  if (!courseInfo) return null;

  return (
    <Article.Header>{`Manage ${courseInfo.title}`}</Article.Header>
  );
};

export default ManageCoursePage;
