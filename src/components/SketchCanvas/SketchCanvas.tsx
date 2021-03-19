import useComponentSize from '@rehooks/component-size';
import paper from 'paper';
import * as React from 'react';
import createFillLassoTool from '../../tools/fillLasso';
import styles from './SketchCanvas.css';

const SketchCanvas: React.FC = () => {
  const canvas = React.useRef<HTMLCanvasElement>();
  const canvasSize = useComponentSize(canvas);

  // Initialize canvas/paper.js
  React.useEffect(() => {
    if (canvas.current) {
      paper.setup(canvas.current);

      // Initialize tools
      const fillLasso = createFillLassoTool();
      fillLasso.activate();
    }
  }, [canvas]);

  // Let paper.js know when the canvas is resized
  React.useEffect(() => {
    paper.view.viewSize = new paper.Size(canvasSize.width, canvasSize.height);
  }, [canvasSize]);

  return (
    <>
      <div className={styles.canvasContainer}>
        <img className={styles.image} src={'./src/images/geo-default.jpg'} />
        <canvas className={styles.canvas} ref={canvas} />
      </div>
    </>
  );
}

export default SketchCanvas;