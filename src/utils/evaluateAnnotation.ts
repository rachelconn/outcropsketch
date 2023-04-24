import dataURIToBuffer from 'data-uri-to-buffer';
import paper from 'paper-jsdom-canvas';
import sizeOf from 'image-size';

import SerializedProject from '../classes/serialization/project';
import awaitCondition from './awaitCondition';
import { loadLabelsFromJSON } from './loadLabelsFromFile';
import displayDifference, { resolveOverlap } from './displayDifference';
import { labelViewerReducer } from '../redux/reducer';
import { createStore } from 'redux';
import { LabelType } from '../classes/labeling/labeling';

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
  const paperScope = new paper.PaperScope();
  paperScope.setup(new paper.Size(1, 1));
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

      // Determine area in original annotation
      [
        ...paperScope.project.layers[LabelType.STRUCTURE].children,
        ...paperScope.project.layers[LabelType.NONGEOLOGICAL].children,
      ].forEach((path) => originalArea += Math.abs(path.area));

      // Calculate difference between annotations
      return displayDifference(paperScope, annotation, store);
    })
    .then(() => {
      paperScope.activate();

      // Confine area inside view bounding box
      const viewRect = new paperScope.Path.Rectangle(paperScope.project.view.bounds);
      viewRect.remove();
      const labelPaths = [
        ...paperScope.project.layers[LabelType.STRUCTURE].children,
        ...paperScope.project.layers[LabelType.NONGEOLOGICAL].children,
      ];
      labelPaths.forEach((path, idx) => {
        const updatedPath = path.intersect(viewRect);
        path.replaceWith(updatedPath);
        labelPaths[idx] = updatedPath;
      })

      const differenceArea = labelPaths.reduce((acc, path) => acc + path.area, 0);

      paper.activate();

      return (1 - (differenceArea / originalArea)) * 100;
    })
}
