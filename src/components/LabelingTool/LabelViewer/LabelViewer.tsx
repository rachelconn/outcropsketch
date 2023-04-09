import useComponentSize, { ComponentSize } from '@rehooks/component-size';
import paper from 'paper-jsdom-canvas';
import React from 'react';
import SerializedProject from '../../../classes/serialization/project';
import awaitCondition from '../../../utils/awaitCondition';
import { resolveOverlap } from '../../../utils/displayDifference';
import { loadLabelsFromJSON } from '../../../utils/loadLabelsFromFile';
import styles from './LabelViewer.css';

interface LabelViewerProps {
  project: SerializedProject,
  // onFinishRender: hook run whenever the labels are fully rendered and correctly sized
  onFinishRender?: (paperScope: paper.PaperScope) => any,
}

// TODO: only works when force refreshing page, need to find out what's preventing it from working
const LabelViewer: React.FC<LabelViewerProps> = ({ project, onFinishRender }) => {
  const canvasElement = React.useRef<HTMLCanvasElement>();

  const imageElement = React.useRef<HTMLImageElement>();
  const [imageSize, setImageSize] = React.useState<ComponentSize>();
  const imageComponentSize = useComponentSize(imageElement);

  const [paperScope, setPaperScope] = React.useState<paper.PaperScope>();

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
      })
      .then(() => {
        resolveOverlap(createdPaperScope.project);
      });

    setPaperScope(createdPaperScope);
  }, [canvasElement, imageComponentSize]);

  React.useEffect(() => {
    if (!imageSize || !imageComponentSize || !paperScope) return;

    // Update view
    paperScope.view.viewSize = new paper.Size(imageComponentSize.width, imageComponentSize.height);
    paperScope.view.center = new paper.Point(0, 0);

    const scale = imageComponentSize.height / imageSize.height;
    paperScope.view.zoom = scale;

    if (onFinishRender) onFinishRender(paperScope);
  }, [imageSize, imageComponentSize, paperScope]);

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
