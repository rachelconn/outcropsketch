import { useNavigate } from '@reach/router';
import Cookies from 'js-cookie';
import React from 'react';
import { CourseProps, LabeledImageProps } from '../../classes/API/APIClasses';
import CardBase from '../common/CardBase/CardBase';
import deleteIcon from '../../icons/trash.svg';
import downloadIcon from '../../icons/download.svg';
import downloadFromURI from '../../utils/downloadFromURI';
import listIcon from '../../icons/list.svg';
import pencilIcon from '../../icons/pencil.svg';

interface LabeledImageCardProps {
  course: CourseProps,
  labeledImage: LabeledImageProps,
};

const LabeledImageCard: React.FC<LabeledImageCardProps> = ({ course, labeledImage }) => {
  const navigate = useNavigate();

  const handleRemoveClick = () => {
    fetch(`/courses/delete_image/${labeledImage.id}`, {
      method: 'DELETE',
      headers: {
        'X-CSRFToken': Cookies.get('csrftoken'),
      },
    })
      .then(() => {
        location.reload();
      });
  };

  const buttons = [
    {
      text: 'View Student Submissions',
        onClick: () => navigate(`/mycourses/images/${labeledImage.id}/submissions`,
        { state: { labeledImage } }
      ),
      icon: listIcon,
      visible: course.owner,
    },
    {
      text: 'Download JSON',
      onClick: () => downloadFromURI(labeledImage.jsonFile, labeledImage.name),
      icon: downloadIcon,
      visible: course.owner,
    },
    {
      text: 'Annotate',
      onClick: () => navigate(
        `/mycourses/images/${labeledImage.id}/annotate`,
        {
          state: {
            course,
            imageURL: labeledImage.jsonFile,
            isOwner: course.owner,
          },
        }
      ),
      icon: pencilIcon,
    },
    {
      text: 'Delete',
      onClick: handleRemoveClick,
      icon: deleteIcon,
      visible: course.owner,
    },
  ];

  return (
    <CardBase
      title={labeledImage.name}
      description=""
      buttons={buttons}
      image={labeledImage.thumbnail}
    />
  );
};

export default LabeledImageCard;
