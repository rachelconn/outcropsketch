import { useNavigate } from '@reach/router';
import React from 'react';
import { CourseProps } from '../../classes/API/APIClasses';
import CardBase from '../common/CardBase/CardBase';

interface CourseCardProps {
  course: CourseProps,
}

const CourseCard: React.FC<CourseCardProps> = ({ course }) => {
  const navigate = useNavigate();
  const buttons = [
    {
      text: 'Manage',
      onClick: () => navigate(`mycourses/manage/${course.courseCode}`),
      visible: course.owner,
    },
  ];

  return (
    <CardBase title={course.title} description={course.description} buttons={buttons} />
  );
};

export default CourseCard;
