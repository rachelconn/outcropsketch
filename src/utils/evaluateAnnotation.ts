import dataURIToBuffer from 'data-uri-to-buffer';
import paper from 'paper';
import sizeOf from 'image-size';
import { JSDOM } from 'jsdom';

import SerializedProject from '../classes/serialization/project';
import awaitCondition from './awaitCondition';
import { loadLabelsFromJSON } from './loadLabelsFromFile';
import displayDifference, { resolveOverlap } from './displayDifference';
import { labelViewerReducer } from '../redux/reducer';
import { createStore } from 'redux';
import { LabelType } from '../classes/labeling/labeling';
import { removeOutsideView } from './paperLayers';

interface Size {
  width: number,
  height: number,
  orientation?: number,
}

const sizeCache = new Map<string, Size>();

// Gives accuracy of annotation in range [0, 100]
export function evaluateAnnotation(original: SerializedProject, annotation: SerializedProject): Promise<number> {
  const store = createStore(labelViewerReducer);

  // Create virtual paper scope
  const dom = new JSDOM(`<!DOCTYPE html>
    <html>
    <head>
    <!-- Load the Paper.js library -->
    <script type="text/javascript" src="js/paper.js"></script>
    </head>
    <body>
      <canvas id="canvas" resize></canvas>
    </body>
    </html>`
  );
  const canvasElement = dom.window.document.getElementById('canvas') as HTMLCanvasElement;
  const paperScope = new paper.PaperScope();
  paperScope.setup(canvasElement);
  paperScope.view.autoUpdate = false;

  // Read image size
  let size = sizeCache.get(original.image);
  if (size === undefined) {
    const buffer = dataURIToBuffer(original.image);
    size = sizeOf(buffer);
    // Orientation 5-8 means actual image is rotated or flipped 90/270 degrees
    if (size?.orientation >= 5) {
      [size.width, size.height] = [size.height, size.width];
    }
    // Save to cache
    sizeCache.set(original.image, size);
  }

  let originalArea = 0;

  return awaitCondition(() => paperScope.project && paperScope.view)
    .then(() =>
      // Load original labels
      loadLabelsFromJSON(original, {
        propagateError: true,
        paperScope,
        store,
      })
    )
    .then(() => {
      // Update view manually since there are no canvas hooks to handle this
      paperScope.view.viewSize = new paper.Size(Math.round(size.width), Math.round(size.height))
      paperScope.view.center = new paper.Point(0, 0);
      resolveOverlap(paperScope);
      removeOutsideView(paperScope);

      // Determine area in original annotation
      paperScope.project.layers[LabelType.STRUCTURE].children.forEach((path) => originalArea += Math.abs(path.area));

      // Calculate difference between annotations
      return displayDifference(paperScope, annotation, store);
    })
    .then(() => {
      const labelPaths = removeOutsideView(paperScope);
      const differenceArea = labelPaths.reduce((acc, path) => acc + path.area, 0);

      return (1 - (differenceArea / originalArea)) * 100;
    });
}
