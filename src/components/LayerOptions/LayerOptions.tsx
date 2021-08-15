import React from 'react';
import paper from 'paper';
import { waitForProjectLoad } from '../../utils/paperLayers';
import Layer from '../../classes/layers/layers';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/reducer';
import OptionCheckbox from '../common/OptionCheckbox/OptionCheckbox';
import OptionSlider from '../common/OptionSlider/OptionSlider';
import styles from './LayerOptions.css';

const opacities = new Map<Layer, number>();

const LayerOptions: React.FC = () => {
  const layer = useSelector<RootState, Layer>((state) => state.options.layer);
  const [visible, setVisible] = React.useState(true);
  const [opacity, setOpacity] = React.useState(100);

  // Await project load on first render
  React.useEffect(() => {
    waitForProjectLoad().then(() => {
      setOpacity(paper.project.layers[layer].opacity);
    });
  }, []);

  const handleCheckboxChange = (newValue: boolean) => {
    // Remember old opacity
    setVisible(newValue);
    paper.project.layers[layer].opacity = newValue ? opacities.get(layer) : 0;
  };

  const handleSliderChange = (newValue: number) => {
    // Convert opacity from percent to decimal
    const newOpacity = newValue / 100;
    // Set opacity value
    setOpacity(newOpacity);
    opacities.set(layer, newOpacity);

    // Apply value only if layer is visible
    if (visible) paper.project.layers[layer].opacity = newOpacity;
  };

  return (
    <div className={styles.layerOptionsContainer}>
      <OptionCheckbox
        initialValue={visible}
        label={`Show ${layer}`}
        onChange={handleCheckboxChange}
      />
      <OptionSlider
        initialValue={opacity || opacities.get(layer)}
        label={`${layer} opacity`}
        minVal={30}
        maxVal={100}
        onChange={handleSliderChange}
        unit="%"
      />
    </div>
  );
};

export default LayerOptions
