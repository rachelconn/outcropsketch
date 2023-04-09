import paper from 'paper-jsdom-canvas';
import { Store } from 'redux';
import { LabelType } from '../classes/labeling/labeling';
import SerializedProject from '../classes/serialization/project';
import { loadLabelsFromJSON } from './loadLabelsFromFile';

export function resolveOverlap(project: paper.Project) {
    // Resolve overlapping by only keeping the labels on top
    const labelPaths = [
      ...project.layers[LabelType.STRUCTURE].children,
      ...project.layers[LabelType.NONGEOLOGICAL].children,
    ].reverse();

    for (let topIdx = 0; topIdx < labelPaths.length - 1; topIdx++) {
      const top = labelPaths[topIdx];
      for (let bottomIdx = topIdx + 1; bottomIdx < labelPaths.length; bottomIdx++) {
        const bottom = labelPaths[bottomIdx];
        const updatedBottom = bottom.subtract(top, { insert: false });
        bottom.replaceWith(updatedBottom);
        labelPaths[bottomIdx] = updatedBottom;
      }
    }
}

export default function displayDifference(
  paperScope: paper.PaperScope,
  projectToCompare: SerializedProject,
  store: Store,
) {
  // // Resolve overlap in the original labels
  // resolveOverlap(paperScope.project);

  // Store original labels while resolving overlap in the project being compared
  const originalProjectJSON = paperScope.project.exportJSON({ asString: false });
  paperScope.project.clear();

  loadLabelsFromJSON(projectToCompare, {
    loadIfBlank: true,
    propagateError: true,
    paperScope,
    store,
  })
    .then(() => {
      // Resolve overlap in the labels to compare
      resolveOverlap(paperScope.project);
      const comparisonStructures = [...paperScope.project.layers[LabelType.STRUCTURE].children];
      const comparisonNonGeological = [...paperScope.project.layers[LabelType.NONGEOLOGICAL].children];

      const comparisonLabels = [...comparisonStructures, ...comparisonNonGeological];

      // Import original labels on top of the ones to compare
      const test = paperScope.project.importJSON(originalProjectJSON);
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
    });
}
