import { useNavigate } from '@reach/router';
import React from 'react';
import { CourseProps } from '../../classes/API/APIClasses';
import Button from '../common/Button/Button';
import Typography from '../common/Typography/Typography';
import styles from './styles.css';

const CourseCard: React.FC<CourseProps> = ({ courseCode, description, title, owner }) => {
  const navigate = useNavigate();
  let manageCourseButton = undefined;
  if (owner) {
    const handleManageCourseClick = () => {
      navigate(`mycourses/manage/${courseCode}`);
    };
    manageCourseButton = <Button onClick={handleManageCourseClick}>Manage</Button>;
  }

  return (
    <div className={styles.courseCardPaper}>
      <div className={styles.courseCardContent}>
        <div>
          <Typography variant="h4">{title}</Typography>
          <Typography variant="body1">{description}</Typography>
        </div>
        <div className={styles.courseCardButtons}>
          {manageCourseButton}
        </div>
      </div>
    </div>
  );
};

export default CourseCard;
