import React from 'react';
import Typography from '../common/Typography/Typography';
import styles from './styles.css';

export interface CourseCardProps {
  courseCode: number,
  description: string,
  title: string,
  owner: boolean,
}

const CourseCard: React.FC<CourseCardProps> = ({ courseCode, description, title, owner }) => {
  return (
    <div className={styles.courseCardPaper}>
      <Typography variant="h4">{title}</Typography>
      <Typography variant="body1">{description}</Typography>
    </div>
  );
};

export default CourseCard;
