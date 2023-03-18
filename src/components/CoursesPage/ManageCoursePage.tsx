import { RouteComponentProps, useNavigate, useParams } from '@reach/router';
import React from 'react';
import addIcon from '../../icons/add.svg';
import Article from '../common/Article';
import Button from '../common/Button/Button';
import { GetCourseInfoAPIReturnType } from '../../classes/API/APIClasses';
import ErrorAlert from '../common/ErrorAlert/ErrorAlert';
import styles from './styles.css';
import LabeledImageCard from './LabeledImageCard';

const ManageCoursePage: React.FC<RouteComponentProps> = () => {
  const navigate = useNavigate();
  const params = useParams();
  const [courseInfo, setCourseInfo] = React.useState<GetCourseInfoAPIReturnType>();
  const [errorResponse, setErrorResponse] = React.useState<Response>();

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
    <LabeledImageCard labeledImage={labeledImage} isOwner={courseInfo.owner} key={labeledImage.id} />
  );

  const handleAddLabeledImageClick = () => navigate(`/mycourses/${params.courseId}/upload`);

  return (
    <>
      <Article.Header>{`Manage ${courseInfo.title}`}</Article.Header>
      <div className={styles.courseActionButtons}>
        <Button icon={addIcon} onClick={handleAddLabeledImageClick}>
          Add Labeled Image
        </Button>
      </div>
      <div className={styles.cardColumnContainer}>
        {labeledImageCards}
      </div>
      <ErrorAlert response={errorResponse} />
    </>
  );
};

export default ManageCoursePage;
