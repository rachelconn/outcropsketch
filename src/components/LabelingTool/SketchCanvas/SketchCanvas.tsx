import useComponentSize, { ComponentSize } from '@rehooks/component-size';
import paper from 'paper-jsdom-canvas';
import * as React from 'react';
import { RootState } from '../../../redux/reducer';
import styles from './SketchCanvas.css';
import { useDispatch, useSelector } from 'react-redux';
import { initializePaperLayers } from '../../../utils/paperLayers';
import { Image } from '../../../redux/reducers/image';
import { Cursor, cursorCSS } from '../../../classes/cursors/cursors';
import { resetHistory } from '../../../redux/actions/undoHistory';
import { toolHandlerStatus } from '../../../tools/createTool';
import { setImageScale } from '../../../redux/actions/image';

// Export canvas container ID for manipulation outside react
export const canvasContainerID = 'canvas-container';

// Keep track of touch distance and average position for zooming and panning
interface Coordinates {
  x: number,
  y: number,
}
let lastTouchAveragePosition: Coordinates = { x: 0, y: 0 }; // For panning
let lastTouchNumTouches = 0; // For preventing jitter when panning
let lastTouchDistance = 0; // For zooming

const getAveragePosition = (e: React.TouchEvent<HTMLDivElement>): Coordinates => {
  if (e.touches.length === 1) {
    return {
      x: e.touches[0].pageX,
      y: e.touches[0].pageY,
    };
  }
  return {
    x: (e.touches[0].pageX + e.touches[1].pageX) / 2,
    y: (e.touches[0].pageY + e.touches[1].pageY) / 2,
  };
};

const getDistance = (e: React.TouchEvent<HTMLDivElement>): number => {
  return Math.hypot(e.touches[0].pageX - e.touches[1].pageX, e.touches[0].pageY - e.touches[1].pageY);
}

const SketchCanvas: React.FC = () => {
  const dispatch = useDispatch();
  const image = useSelector<RootState, Image>((state) => state.image);
  const cursor = useSelector<RootState, Cursor>((state) => state.options.cursor);

  const canvasContainerElement = React.useRef<HTMLDivElement>();
  const imageElement = React.useRef<HTMLImageElement>();
  const canvasElement = React.useRef<HTMLCanvasElement>();
  const imageSize = useComponentSize(imageElement);

  React.useEffect(() => {
    // Initialize canvas/paper.js
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

  /*
    Touch event handlers - perform a couple of different functions:
    - Disables handling tool events if user is beginning two finger gesture instead of moving the first touch
    - Uses two-finger gestures for scrolling and zooming
  */
  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!toolHandlerStatus.mouseHasMoved && e.touches.length === 2) {
      // Disable handling tool events
      toolHandlerStatus.shouldHandleToolEvents = false;

      // Update position and distance of touch
      lastTouchAveragePosition = getAveragePosition(e);
      lastTouchDistance = getDistance(e);
    }
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!toolHandlerStatus.shouldHandleToolEvents) {
      // Determine amount to pan
      const averagePosition = getAveragePosition(e);
      // TODO: determine why scrolling stops with the line below
      if (e.touches.length === 1 && lastTouchNumTouches > 1) lastTouchAveragePosition = averagePosition;
      const dx = averagePosition.x - lastTouchAveragePosition.x;
      const dy = averagePosition.y - lastTouchAveragePosition.y;
      canvasContainerElement.current.scrollBy(-dx, -dy); // Scroll opposite direction of movement

      // Determine amount to zoom

      // Update position and distance of touch
      // Pinch to zoom if 2+ touches are being held
      if (e.touches.length > 1) {
        // TODO: zoom haha
        const touchDistance = getDistance(e);
        dispatch(setImageScale(image.scale * (touchDistance / lastTouchDistance)))
        lastTouchDistance = touchDistance;
      }
      lastTouchAveragePosition = averagePosition;
      lastTouchNumTouches = e.touches.length;
    }
  };

  return (
    <>
      <div
        id={canvasContainerID}
        className={styles.canvasContainer}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        ref={canvasContainerElement}
      >
        <span className={styles.imageContainer}>
          <img srcSet={imageSrcSet} ref={imageElement} />
        </span>
        <canvas style={canvasStyle} className={styles.canvas} ref={canvasElement} />
      </div>
    </>
  );
}

export default SketchCanvas;
