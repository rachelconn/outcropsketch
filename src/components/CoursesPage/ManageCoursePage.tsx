import { RouteComponentProps, useParams } from '@reach/router';
import React from 'react';
import Article from '../common/Article';
import { GetCourseInfoAPIReturnType } from '../../classes/API/APIClasses';
import ErrorAlert from '../common/ErrorAlert/ErrorAlert';
import styles from './styles.css';
import LabeledImageCard from './LabeledImageCard';

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
          return undefined;
        }
      })
      .then((responseJSON) => setCourseInfo(responseJSON));
  }, []);

  // Don't render page until course info has been fetched
  if (!courseInfo) return <ErrorAlert response={errorResponse} />;

  const labeledImageCards = courseInfo.labeledImages.map((labeledImage) =>
    <LabeledImageCard labeledImage={labeledImage} key={labeledImage.id} />
  );

  return (
    <>
      <Article.Header>{`Manage ${courseInfo.title}`}</Article.Header>
      <div className={styles.cardColumnContainer}>
        {labeledImageCards}
      </div>
      <ErrorAlert response={errorResponse} />
    </>
  );
};

export default ManageCoursePage;
