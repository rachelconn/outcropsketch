import { RouteComponentProps, useNavigate, useParams } from '@reach/router';
import React from 'react';
import addIcon from '../../icons/add.svg';
import Article from '../common/Article';
import Button from '../common/Button/Button';
import { GetCourseInfoAPIReturnType } from '../../classes/API/APIClasses';
import ErrorAlert from '../common/ErrorAlert/ErrorAlert';
import styles from './styles.css';
import LabeledImageCard from './LabeledImageCard';
import StandardPage from '../common/StandardPage/StandardPage';

const ManageCoursePage: React.FC<RouteComponentProps> = () => {
  const navigate = useNavigate();
  const { courseId } = useParams();
  const [courseInfo, setCourseInfo] = React.useState<GetCourseInfoAPIReturnType>();
  const [errorResponse, setErrorResponse] = React.useState<Response>();

  React.useEffect(() => {
    fetch(`/courses/get/${courseId}`)
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
  if (!courseInfo) {
    return (
      <StandardPage>
        <ErrorAlert response={errorResponse} />
      </StandardPage>
    );
  }


  const labeledImageCards = courseInfo.labeledImages.map((labeledImage) =>
    <LabeledImageCard course={courseInfo} labeledImage={labeledImage} key={labeledImage.id} />
  );

  const handleAddLabeledImageClick = () => navigate(`/mycourses/${courseId}/upload`);

  return (
    <StandardPage>
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
    </StandardPage>
  );
};

export default ManageCoursePage;
