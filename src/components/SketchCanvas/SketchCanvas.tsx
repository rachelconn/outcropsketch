import useComponentSize from '@rehooks/component-size';
import paper from 'paper';
import * as React from 'react';
import { LabelType } from '../../classes/labeling/labeling';
import { RootState } from '../../redux/reducer';
import styles from './SketchCanvas.css';
import { useSelector } from 'react-redux';
import { initializePaperLayers, paperLayers } from '../../utils/paperLayers';
import { Image } from '../../redux/reducers/image';
import { Cursor, cursorCSS } from '../../classes/cursors/cursors';
import store from '../..';
import { resetHistory } from '../../redux/actions/undoHistory';

// Export canvas container ID for manipulation outside react
export const canvasContainerID = 'canvas-container';

const SketchCanvas: React.FC = () => {
  const { URI: imageURI, scale: imageScale } = useSelector<RootState, Image>((state) => state.image);
  const cursor = useSelector<RootState, Cursor>((state) => state.options.cursor);

  const imageElement = React.useRef<HTMLImageElement>();
  const canvasElement = React.useRef<HTMLCanvasElement>();
  const imageSize = useComponentSize(imageElement);

  // Initialize canvas/paper.js
  React.useEffect(() => {
    if (canvasElement.current) {
      paper.setup(canvasElement.current);
    }
  }, [canvasElement]);

  // Make paper.js match canvas size to the image
  React.useEffect(() => {
    paper.view.viewSize = new paper.Size(imageSize.width, imageSize.height);
    // Must be reset whenever viewSize is changed because paper.js is stupid and doesn't know how scaling works
    paper.view.center = new paper.Point(0, 0);
    paper.view.zoom = imageScale;

    // Initialize layers and reset project
    initializePaperLayers(false);
    store.dispatch(resetHistory());
  }, [imageSize]);


  // Scale image appropriately
  const imageSrcSet = `${imageURI} ${1/imageScale}x`;

  // Set cursor
  const canvasStyle: React.CSSProperties = {
    cursor: cursorCSS(cursor),
  };

  return (
    <>
      <div id={canvasContainerID} className={styles.canvasContainer}>
        <span className={styles.imageContainer}>
          <img srcSet={imageSrcSet} ref={imageElement} />
        </span>
        <canvas style={canvasStyle} className={styles.canvas} ref={canvasElement} />
      </div>
    </>
  );
}

export default SketchCanvas;
