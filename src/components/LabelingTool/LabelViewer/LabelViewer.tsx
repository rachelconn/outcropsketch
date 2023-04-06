import useComponentSize, { ComponentSize } from '@rehooks/component-size';
import paper from 'paper-jsdom-canvas';
import React from 'react';
import SerializedProject from '../../../classes/serialization/project';
import awaitCondition from '../../../utils/awaitCondition';
import { loadLabelsFromJSON } from '../../../utils/loadLabelsFromFile';
import styles from './LabelViewer.css';

interface LabelViewerProps {
  project: SerializedProject,
}

const LabelViewer: React.FC<LabelViewerProps> = ({ project }) => {
  const canvasElement = React.useRef<HTMLCanvasElement>();

  const imageElement = React.useRef<HTMLImageElement>();
  const [imageSize, setImageSize] = React.useState<ComponentSize>();
  const imageComponentSize = useComponentSize(imageElement);

  const [paperScope, setPaperScope] = React.useState<paper.PaperScope>();

  // TODO: fix first canvas being reset
  React.useEffect(() => {
    // Wait for image and canvas components to fully render or paper.js throws a hissy fit
    if (imageComponentSize.width === 0 || !canvasElement.current) return;
    // Don't run after paper scope has already been initialized
    if (paperScope) return;

    const image = new Image();
    image.src = project.image;
    image.onload = () => {
      setImageSize({ width: image.width, height: image.height })
      image.remove();
    };

    // Initialize paper scope
    const createdPaperScope = new paper.PaperScope();
    createdPaperScope.setup(canvasElement.current);

    // Load project
    awaitCondition(() => createdPaperScope.project && createdPaperScope.view)
      .then(() => {
        loadLabelsFromJSON(project, {
          loadIfBlank: true,
          propagateError: true,
          paperScope: createdPaperScope,
        })
      });

    // TODO: remove overlapping paths based on z position, remove diff
    setPaperScope(createdPaperScope);
  }, [canvasElement, imageComponentSize]);

  React.useEffect(() => {
    if (!imageSize || !imageComponentSize || !paperScope) return;

    // Update view
    paperScope.view.viewSize = new paper.Size(imageComponentSize.width, imageComponentSize.height);
    paperScope.view.center = new paper.Point(0, 0);

    const scale = imageComponentSize.height / imageSize.height;
    paperScope.view.zoom = scale;
  }, [imageSize, imageComponentSize, paperScope]);

  // TODO: set canvas dimensions
  // TODO: set image src
  return (
    <div className={styles.canvasContainer}>
      <span className={styles.imageContainer}>
        <img className={styles.image} src={project.image} ref={imageElement} />
      </span>
      <canvas className={styles.canvas} ref={canvasElement} />
    </div>
  );
};

export default LabelViewer;
