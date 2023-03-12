import { useNavigate } from '@reach/router';
import React from 'react';
import { LabeledImageProps } from '../../classes/API/APIClasses';
import downloadFromURI from '../../utils/downloadFromURI';
import CardBase from '../common/CardBase/CardBase';

interface LabeledImageCardProps {
  labeledImage: LabeledImageProps,
};

const LabeledImageCard: React.FC<LabeledImageCardProps> = ({ labeledImage }) => {
  const navigate = useNavigate();
  const buttons = [
    {
      text: 'Download JSON',
      // TODO: download file from jsonFile param url
      onClick: () => downloadFromURI(labeledImage.jsonFile, labeledImage.name),
    },
    {
      text: 'Annotate',
      // TODO: redirect to page where user can modify the json file
      onClick: () => {},
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
