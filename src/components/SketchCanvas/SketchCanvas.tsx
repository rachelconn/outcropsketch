import useComponentSize from '@rehooks/component-size';
import paper from 'paper';
import * as React from 'react';
import { LabelType } from '../../classes/labeling/labeling';
import { RootState } from '../../redux/reducer';
import styles from './SketchCanvas.css';
import { useSelector } from 'react-redux';
import paperLayers from '../../utils/paperLayers';

const SketchCanvas: React.FC = () => {
  const imageURI = useSelector<RootState, string>((state) => state.image.URI);
  const imageElement = React.useRef<HTMLImageElement>();
  const canvasElement = React.useRef<HTMLCanvasElement>();
  const imageSize = useComponentSize(imageElement);

  // Initialize canvas/paper.js
  React.useEffect(() => {
    if (canvasElement.current) {
      paper.setup(canvasElement.current);
      // Create layers for each label type so they can be used later
      paperLayers.forEach((layer) => {
        new paper.Layer({ name: layer })
      });
    }
  }, [canvasElement]);

  // Make paper.js match canvas size to the image
  React.useEffect(() => {
    console.log(imageSize.width, imageSize.height);
    paper.view.viewSize = new paper.Size(imageSize.width, imageSize.height);
  }, [imageSize]);

  return (
    <>
      <div className={styles.canvasContainer}>
        <img className={styles.image} src={imageURI} ref={imageElement} />
        <canvas className={styles.canvas} ref={canvasElement} />
      </div>
    </>
  );
}

export default SketchCanvas;
