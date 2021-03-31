import useComponentSize from '@rehooks/component-size';
import paper from 'paper';
import * as React from 'react';
import { LabelType } from '../../classes/labeling/labeling';
import styles from './SketchCanvas.css';

const SketchCanvas: React.FC = () => {
  const [imageSource, setImageSource] = React.useState('./src/images/geo-default.jpg');
  const image = React.useRef<HTMLImageElement>();
  const canvas = React.useRef<HTMLCanvasElement>();
  const imageSize = useComponentSize(image);

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

  // Make paper.js match canvas size to the image
  React.useEffect(() => {
    console.log(imageSize.width, imageSize.height);
    paper.view.viewSize = new paper.Size(imageSize.width, imageSize.height);
  }, [imageSize]);

  return (
    <>
      <div className={styles.canvasContainer}>
        <img className={styles.image} src={imageSource} ref={image} />
        <canvas className={styles.canvas} ref={canvas} />
      </div>
    </>
  );
}

export default SketchCanvas;
