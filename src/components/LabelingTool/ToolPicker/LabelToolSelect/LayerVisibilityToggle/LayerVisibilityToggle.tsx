import React from 'react';
import paper from 'paper-jsdom-canvas';
import Visibility from '../../../../../icons/visibility.svg';
import VisibilityOff from '../../../../../icons/visibility_off.svg';
import { waitForProjectLoad } from '../../../../../redux/reducers/undoHistory';
import Layer from '../../../../../classes/layers/layers';

interface LayerVisibilityToggleProps {
  layer: Layer,
};

// TODO: need to make sure these stay updated if multiple exist for the same layer
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
