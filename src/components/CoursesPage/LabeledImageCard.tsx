import { useNavigate } from '@reach/router';
import Cookies from 'js-cookie';
import React from 'react';
import { CourseProps, LabeledImageProps } from '../../classes/API/APIClasses';
import CardBase from '../common/CardBase/CardBase';
import deleteIcon from '../../icons/trash.svg';
import downloadIcon from '../../icons/download.svg';
import downloadFromURI from '../../utils/downloadFromURI';
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
      text: 'Download JSON',
      onClick: () => downloadFromURI(labeledImage.jsonFile, labeledImage.name),
      icon: downloadIcon,
      visible: course.owner,
    },
    {
      text: 'Annotate',
      // TODO: redirect to page where user can modify the json file
      // TODO: need to go to instructor view (editing the answer key) or student view (submitting a response) based on permissions
      onClick: () => navigate(
        `/mycourses/images/${labeledImage.id}/annotate`,
        {
          state: {
            course,
            imageURL: labeledImage.jsonFile,
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
    }
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
