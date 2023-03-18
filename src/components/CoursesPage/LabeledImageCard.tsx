import { useNavigate } from '@reach/router';
import Cookies from 'js-cookie';
import React from 'react';
import { LabeledImageProps } from '../../classes/API/APIClasses';
import CardBase from '../common/CardBase/CardBase';
import deleteIcon from '../../icons/trash.svg';
import downloadIcon from '../../icons/download.svg';
import downloadFromURI from '../../utils/downloadFromURI';
import pencilIcon from '../../icons/pencil.svg';

interface LabeledImageCardProps {
  labeledImage: LabeledImageProps,
  isOwner: boolean,
};

const LabeledImageCard: React.FC<LabeledImageCardProps> = ({ labeledImage, isOwner }) => {
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
      visible: isOwner,
    },
    {
      text: 'Annotate',
      // TODO: redirect to page where user can modify the json file
      // TODO: need to go to instructor view (editing the answer key) or student view (submitting a response) based on permissions
      onClick: () => {},
      icon: pencilIcon,
    },
    {
      text: 'Delete',
      onClick: handleRemoveClick,
      icon: deleteIcon,
      visible: isOwner,
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
