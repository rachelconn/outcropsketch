import useComponentSize from '@rehooks/component-size';
import paper from 'paper';
import * as React from 'react';
import { LabelType } from '../../classes/labeling/labeling';
import styles from './SketchCanvas.css';

const SketchCanvas: React.FC = () => {
  const [imageSource, setImageSource] = React.useState('./src/images/geo-default.jpg');
  const canvas = React.useRef<HTMLCanvasElement>();
  const canvasSize = useComponentSize(canvas);

  // Initialize canvas/paper.js
  React.useEffect(() => {
    if (canvas.current) {
      paper.setup(canvas.current);
      // Create layers for each label type so they can be used later
      Object.values(LabelType).forEach((labelType) => {
        new paper.Layer({ name: labelType })
      });
    }
  }, [canvas]);

  // Let paper.js know when the canvas is resized
  React.useEffect(() => {
    paper.view.viewSize = new paper.Size(canvasSize.width, canvasSize.height);
  }, [canvasSize]);

  return (
    <>
      <div className={styles.canvasContainer}>
        <img className={styles.image} src={imageSource} />
        <canvas className={styles.canvas} ref={canvas} />
      </div>
    </>
  );
}

export default SketchCanvas;
