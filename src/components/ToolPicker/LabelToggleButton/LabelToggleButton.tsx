import paper from 'paper';
import React from 'react';
import { useDispatch } from 'react-redux';
import { NonLabelType } from '../../../classes/layers/layers';
import visibilityIcon from '../../../images/icons/visibility.svg';
import visibilityOffIcon from '../../../images/icons/visibility_off.svg';
import { setLabelsVisible } from '../../../redux/actions/image';
import UtilityButton from '../UtilityButton/UtilityButton';


const LabelToggleButton: React.FC = () => {
  const [visible, setVisible] = React.useState(false);
  const [loading, setLoading] = React.useState(true);

  const dispatch = useDispatch();

  React.useEffect(() => {
    // Prevent accessing project before initial render is finished
    if (loading) {
      setLoading(false);
      return;
    }

    const labelTextLayer = paper.project.layers[NonLabelType.LABEL_TEXT];
    labelTextLayer.children.forEach((item) => {
      item.visible = visible;
    });
    dispatch(setLabelsVisible(visible));

    // TODO: toggle label display
  }, [visible, loading]);

  const icon = visible ? visibilityIcon : visibilityOffIcon;
  const label = visible ? 'Hide Labels' : 'Show Labels';

  const handleClick = () => {
    setVisible(!visible);
  };

  return <UtilityButton active={visible} color='lightgray' icon={icon} label={label} onClick={handleClick} />;
};

export default LabelToggleButton;
