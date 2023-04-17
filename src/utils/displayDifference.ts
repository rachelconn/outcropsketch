import paper from 'paper-jsdom-canvas';
import { Store } from 'redux';
import { LabelType } from '../classes/labeling/labeling';
import SerializedProject from '../classes/serialization/project';
import { loadLabelsFromJSON } from './loadLabelsFromFile';

export function resolveOverlap(paperScope: paper.PaperScope) {
  paperScope.activate();

  // Resolve overlapping by only keeping the labels on top
  const labelPaths = [
    ...paperScope.project.layers[LabelType.STRUCTURE].children,
    ...paperScope.project.layers[LabelType.NONGEOLOGICAL].children,
  ].reverse();

  // Subtract labels on top from all labels below them
  for (let topIdx = 0; topIdx < labelPaths.length - 1; topIdx++) {
    const top = labelPaths[topIdx];
    for (let bottomIdx = topIdx + 1; bottomIdx < labelPaths.length; bottomIdx++) {
      const bottom = labelPaths[bottomIdx];
      const updatedBottom = bottom.subtract(top, { insert: false });
      bottom.replaceWith(updatedBottom);
      labelPaths[bottomIdx] = updatedBottom;
    }
  }

  paper.activate();
}

export default function displayDifference(
  paperScope: paper.PaperScope,
  projectToCompare: SerializedProject,
  store: Store,
): Promise<void> {
  // Store original labels while resolving overlap in the project being compared
  const originalProjectJSON = paperScope.project.exportJSON({ asString: false });
  paperScope.project.clear();

  return loadLabelsFromJSON(projectToCompare, {
    propagateError: true,
    paperScope,
    store,
  })
    .then(() => {
      // Resolve overlap in the labels to compare
      resolveOverlap(paperScope);
      paperScope.activate();
      const comparisonStructures = [...paperScope.project.layers[LabelType.STRUCTURE].children];
      const comparisonNonGeological = [...paperScope.project.layers[LabelType.NONGEOLOGICAL].children];

      const comparisonLabels = [...comparisonStructures, ...comparisonNonGeological];

      // Import original labels on top of the ones to compare
      paperScope.project.importJSON(originalProjectJSON);
      // Merge layers (since importJSON creates new layers for each of the original ones)
      const seenLayers = new Set<string>();
      [...paperScope.project.layers].forEach((layer) => {
        if (seenLayers.has(layer.name)) {
          paperScope.project.layers[layer.name].addChildren(layer.children);
          layer.remove();
        }
        else seenLayers.add(layer.name);
      });
      const originalLabels = [
        ...paperScope.project.layers[LabelType.STRUCTURE].children.slice(comparisonStructures.length),
        ...paperScope.project.layers[LabelType.NONGEOLOGICAL].children.slice(comparisonNonGeological.length),
      ];

      // Hide overlapping areas with the same label type
      originalLabels.forEach((originalLabel) => {
        comparisonLabels.forEach((comparisonLabel) => {
          if (originalLabel.data.label !== comparisonLabel.data.label) return;
          const updatedOriginalLabel = originalLabel.subtract(comparisonLabel, { insert: false });
          originalLabel.replaceWith(updatedOriginalLabel);
          originalLabel = updatedOriginalLabel;
        });
      });

      // Done finding all differences, remove comparison labels from the project
      comparisonLabels.forEach((comparisonLabel) => comparisonLabel.remove());
      paper.activate();
    });
}
