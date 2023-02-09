import { useNavigate } from '@reach/router';
import React from 'react';
import { CourseProps } from '../../classes/API/APIClasses';
import Typography from '../common/Typography/Typography';
import styles from './styles.css';

const CourseCard: React.FC<CourseProps> = ({ courseCode, description, title, owner }) => {

  return (
    <div className={styles.courseCardPaper}>
      <Typography variant="h4">{title}</Typography>
      <Typography variant="body1">{description}</Typography>
    </div>
  );
};

export default CourseCard;
