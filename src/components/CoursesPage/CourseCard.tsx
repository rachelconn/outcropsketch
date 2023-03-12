import { useNavigate } from '@reach/router';
import React from 'react';
import { CourseProps } from '../../classes/API/APIClasses';
import CardBase from '../common/CardBase/CardBase';

const CourseCard: React.FC<CourseProps> = ({ courseCode, description, title, owner }) => {
  const navigate = useNavigate();
  const buttons = [
    {
      text: 'Manage',
      onClick: () => navigate(`mycourses/manage/${courseCode}`),
      visible: owner,
    },
  ];

  return (
    <CardBase title={title} description={description} buttons={buttons} />
  );
};

export default CourseCard;
