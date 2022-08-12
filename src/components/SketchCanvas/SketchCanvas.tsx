import useComponentSize, { ComponentSize } from '@rehooks/component-size';
import paper from 'paper-jsdom-canvas';
import * as React from 'react';
import { RootState } from '../../redux/reducer';
import styles from './SketchCanvas.css';
import { useDispatch, useSelector } from 'react-redux';
import { initializePaperLayers } from '../../utils/paperLayers';
import { Image } from '../../redux/reducers/image';
import { Cursor, cursorCSS } from '../../classes/cursors/cursors';
import { resetHistory } from '../../redux/actions/undoHistory';

// Export canvas container ID for manipulation outside react
export const canvasContainerID = 'canvas-container';

const SketchCanvas: React.FC = () => {
  const dispatch = useDispatch();
  const image = useSelector<RootState, Image>((state) => state.image);
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

  const updatePaperView = (dimensions: ComponentSize = imageSize) => {
    paper.view.viewSize = new paper.Size(dimensions.width, dimensions.height);
    // Must be reset whenever viewSize is changed because paper.js is stupid and doesn't know how scaling works
    paper.view.center = new paper.Point(0, 0);
    paper.view.zoom = image.scale;
  };

  // Make paper.js match canvas size to the image when resized
  React.useEffect(() => {
    updatePaperView();
  }, [imageSize]);

  // Scale image appropriately
  const imageSrcSet = `${image.URI} ${1 / image.scale}x`;

  // When a new image is loaded, correctly set height/width and initialize.
  // Has to be done this way since reading dimensions from the actual image is unreliable due to asynchronicity
  React.useEffect(() => {
    const img = new Image();
    img.onload = () => {
      const dims = { width: img.width * image.scale, height: img.height * image.scale };
      updatePaperView(dims);
      initializePaperLayers(false);
      dispatch(resetHistory());
      img.remove();
    };
    img.srcset = imageSrcSet;
  }, [image.version]);

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
