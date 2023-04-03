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
      onClick: () => navigate(`/mycourses/${course.courseCode}/manage`),
      visible: course.owner,
    },
    {
      text: 'View',
      onClick: () => navigate(`/mycourses/${course.courseCode}/manage`),
      visible: !course.owner,
    }
  ];

  const subtitle = course.owner ? `Course Code: ${course.courseCode}` : undefined;

  return (
    <CardBase
      title={course.title}
      subtitle={subtitle}
      description={course.description}
      buttons={buttons}
    />
  );
};

export default CourseCard;
