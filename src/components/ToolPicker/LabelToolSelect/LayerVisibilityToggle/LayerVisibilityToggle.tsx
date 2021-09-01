import React from 'react';
import paper from 'paper';
import Visibility from '../../../../images/icons/visibility.svg';
import VisibilityOff from '../../../../images/icons/visibility_off.svg';
import { LabelType } from '../../../../classes/labeling/labeling';
import { waitForProjectLoad } from '../../../../redux/reducers/undoHistory';

interface LayerVisibilityToggleProps {
  layer: LabelType,
};

const LayerVisibilityToggle: React.FC<LayerVisibilityToggleProps> = ({ layer }) => {
  const [visible, setVisible] = React.useState(true);

  // Set corresponding layer visibility on toggle
  React.useEffect(() => {
    waitForProjectLoad().then(() => {
      paper.project.layers[layer].opacity = visible ? 1 : 0;
    });
  }, [visible]);

  const handleClick = (event: React.MouseEvent) => {
    event.stopPropagation();
    setVisible(!visible);
  };

  const icon = visible ? Visibility : VisibilityOff;

  return <img width={24} height={24} src={icon} onClick={handleClick} />;
};

export default LayerVisibilityToggle;
